title: "OpenGL 遊戲引擎開發日誌"
date: 2016-09-11 22:00:37
categories: [OpenGL]
tags: [OpenGL, 開發日誌, Development Journal]
---
## 本篇說明 ##
開發引擎是我用來考驗自己的方式，學習、理解並實作以往學到的各種圖學概念，並用上自己對物件導向與程式語言的熟悉度，希望能完成一個基本的如場景建置、粒子效果、物理碰撞、模組動畫...等等的功能。而更甚之希望當OpenGL或圖學界中有什麼新功能，可以在自己最熟悉的環境中依照概念實作。

系統環境: Windows 10
開發軟體: Visual Studio 2015
硬體設備: i7-3770 and GTX960
核心接口: [GLFW][1]/[GLEW][2]/[GLM][3]/[Assimp][4]/[SOIL2][5]
輔助插件: [Nshader for Visual Studio 2015][6]

####其他事項####
** 2016/09/05 前的日誌乃日根據記憶回朔，09/05方開始打算紀錄。 **

<!--more-->

#### 2016/09/11 ####
Think&Imp: 進階地形&整理程式
1. 支援24bit Height Map調整地形起伏變化。
2. 增加地形Normal向量，支援光影變化。

Note 1: 地形之Normal是以Finite Difference方法算出，相較於Cross Product 法更為節省效能，不過也有在Geometry Shader利用GPU負擔的算法，也許以後可以實驗比較。

Note 2: 首次用到位元位移技巧，利用SOIL提供讀取完後的unsinged char*位移轉換可將24bit存入32bit int中。原先利用std::bitset<24>，但實在過於緩慢，方自己寫24bit -> int。而若使用到透明度，可以從原本支援地形變化16,777,216種變為4,294,967,296種。

{% img "/images/ODJ/20160911screenshot.png" 420 %}


#### 2016/09/10 ####
Think&Imp: 第三人稱攝影機
1. 新增滑鼠點擊與滾輪的Callback事件。
2. 新增第三人稱攝影機PlayerCamera。

Issue: glfw事件屬於driven式，雖然是poll check，不過沒driven到就不會觸發callback，因此在滑鼠滾輪事件上需要添加Timestamp來製作Mouse靜態Class的調整。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/btdXzboOrGI" frameborder="0" allowfullscreen align="middle"></iframe>
</div>
{% endraw %}


#### 2016/09/08 ####
Think&Imp: 地形多重材質混合
1. 新增TerrainTexturePack，包含四個顏色。
2. 修改TerrainRenderer與TerrainShader配合BlendMap概念。

Other: 地形利用RGB與黑色達成四個材質混合，如果利用透明度可達成五個材質，又有聞之用其他色彩數學方法可達成八材質，Unity基本支援即是八種材質地形。

Issue 1: 縱使單一材質地形仍須使用BlendMap。
Issue 2: 需要一所見及所得的編輯器比較好製作BlendMap。

{% img "/images/ODJ/20160908screenshot.png" 420 %}


#### 2016/09/07 ####
Think&Imp: 增加草地物件與迷霧效果
1. 修改SOIL讀取圖片格式從SOIL_LOAD_RGB -> SOIL_LOAD_RGBA，支援透明度。
2. 修改一般Shader中遇到透明會自動discard。
3. 將Texture.ID改為Texture.GetID(),C++的Readonly public variable不可信任。
4. 草地運用trick: Fake Lighting，使Normal都朝上，讓光源一致。
5. 將各種Shader從Renderer中拔出，將共同參數交給MasterRenderer一起設置，以免未來更改Super Shader需要從每個Renderer中逐一修改。
6. 針對單一天空顏色產生遠處迷霧效果，僅光源暫時不參與迷霧效果。

Question: 迷霧效果是實踐於Vertex Shader，其原理與常用的深度轉換FragCoord.z相似，是否應實踐於Fragment且改用深度轉換效果較佳，因為Vertex Shader到Fragment是Intepolate的方式產生插值，就如早期光影[Gouraud Shading](https://en.wikipedia.org/wiki/Gouraud_shading)的視覺差異。

Other: Terrain的迷霧密度不小心調太高導致畫面不協調。

{% img "/images/ODJ/20160907screenshot.png" 420 %}


#### 2016/09/06 ####
Think&Imp: 增加平坦地形相關繪製功能
1. 增加Terrain物件。
2. 增加TerrainRenderer利用效率較高的GL_TRIANGE_STRIP繪製地形。
3. 增加TerrainShader，繼承一般Shader，擁有基本光影。

Issue: 樹木物件數量繪製達500有些微Lag，至1000有明顯Lag，以後需要新增Instancing功能。

{% img "/images/ODJ/20160906screenshot.png" 420 %}


#### 2016/09/05 ####
Think&Imp: Renderer分割責任
1. 引入Template，將Entity<模組>，代表任何模組都可擁有位置、旋轉等基礎參數。
2. MasterRenderer: 總繪製器，儲存使用者不同的物件Entity List。
3. LightSourceRenderer: 光源繪製，目前專門繪製PointLight的光源。
4. MeshesRenderer: 模組面集合繪製，將模組載入之所有面進行繪製。
5. Renderer: 一般的Renderer，只繪製擁有一張貼圖的物件。
6. CubeShader: 目前當作光源繪製著色器，只接受基本光源參數。
7. ModelShader: 模組用，也許未來需依照模組新增其他模組著色器，目前支援單一光源的Phong光影特效。
8. StaticShader: 僅適合單一材質物件，不過也支持光影特效。
9. 優化Texture載入次數。

Issue: 優化在C++中的問題
若Texture相同，就不重新載入，但遇到std::map跟std::unorder_map使用問題，由於std::unorder_map太難實作，故利用std::map並讓TextureModel可以互相比較來建立材質索引表。所幸TextureID OpenGL控制得很好，載入過的材質僅讓使用者維護編號，因此利用TextureModel當std::map的key可行。

{% img "/images/ODJ/20160905screenshot.png" 420 %}


#### 2016/09/04 ####
Think&Imp: 新增著色器與不同Renderer與引入Assimp，並實作簡單光影。
1. 引入模組載入AssimpLoader，新增一組MeshRenderer與MeshShader來專門繪製模組。
2. 加入Phong Model的光影特效。
3. 利用Debug版Assimp載入史丹佛龍約略7秒，Release版約略1秒。


#### 2016/09/03 ####
Think&Imp: 基礎架構與模組載入
1. 修改核心模組，將Keyboard、Mouse、ErrorCheck、Debug等訊息以靜態方式呼叫。
2. 新增TextureModel概念，擁有BasicRenderModel及一組材質讀取。
3. 加入Entity概念，Entity代表物件的位置、旋轉角、縮放...等基礎屬性。
4. 實作讀取簡單obj file的ObjLoader。

Issue: 模組讀取速度
對於讀取一個[史丹佛龍](http://graphics.stanford.edu/data/3Dscanrep/dragon.gif)來講，C++的getline實在非常緩慢，大概要一分鐘才可載入完200,000行的OBJ。思考引入Assimp。

{% img "/images/ODJ/long-time-dragon.png" 420 %}


#### 2016/09/02 ####
Think&Imp: 基礎架構
1. 基礎四元素 Renderer, BasicRenderModel, Shader, Loader
2. Renderer: 目前專門繪製單一BasicRenderModel。
3. BasicRenderModel: 只是一個存取用的資料結構，存放VAO與繪製點數(Indices)。
4. Shader: 延伸Shader，繼承Shader介面者，代表一組特殊的著色器，未來可分為一般物件著色氣、模組著色器、地形著色器...。
5. Loader: 載入資料與創造BasicRenderModel，並且具有資源管理，管理所有VAO,VBO。


#### 2016/09/01 ####
Re-Contruct: 架構除了核心部分打掉重練。
Re-Target: 失敗經驗，並吸收外國專家經驗，重新架構。


#### 2016/08/31 ####
Think&Imp: 加入地形材質

{% img "/images/ODJ/flat-terrian.png" 420 %}


#### 2016/08/30 ####
Think&Imp: 繪製平坦地形
1. 了解地形結構。
概念:

Vertex:
0  1  2  3  4
5  6  7  8  9
10 11 12 13 14
15 16 17 18 19
20 21 22 23 24

Indices:
0   5  1   6  2   7  3   8  4   9    9   5
5  10  6  11  7  12  8  13  9  14   14  10
10 15 11  16 12  17 13  18 14  19   19  15
15 20 16  21 17  22 18  23 19  24

由於使用GL_TRIANGLE_STRIP每兩排結尾都加上一些多的Vertex，開發日誌就不多說了。

{% img "/images/ODJ/flat-terrian-line.png" 420 %}


#### 2016/08/29 ####
Think&Imp: 繪製平面與正方體
1. 依照CCW順序，自行建構正方體的Vertex與Index。
Issue:
1. 開發有點吃緊，許多參數如位置、旋轉...等不知如何參與。


#### 2016/08/28 ####
Issue:
1. 實作並思考後發現，對於Renderer與Shader的定義不明確。
2. Renderer依照此模式下去，只有一個而且責任非常小，將限制RenderOjbect開發。
3. Shader目前定位非常虛幻，每一個新物件必須重新實作且綁定。


#### 2016/08/27 ####
Think&Imp: 繪製基本物件架構。
1. 每個基礎的可繪製物件稱為RenderObject。
2. RenderObject大致為StartUp,Shutdown,Render。
3. RenderSystem繪製RenderObject抽象的集合。
4. 繼承RenderObject者可任意實作自己的繪製函式。


#### 2016/08/26 ####
Target: 依照書中所見的sb7來嘗試實作一個類似的開發環境。
Think&Imp: 建立基礎環境。
1. 建立Core類別存放核心標頭GLFW,GLEW,GLM。
2. 匯入Shader類別，提供vertex,fragment,geometry,tessellation...基礎建構功能，從檔案載入。
3. 匯入Camera類別，提供基本攝影機移動。


[1]: http://www.glfw.org/ "GLFW"

[2]: http://glew.sourceforge.net/ "GLEW"

[3]: http://glm.g-truc.net/ "GLM"

[4]: http://www.assimp.org/ "Assimp"

[5]: https://bitbucket.org/SpartanJ/soil2 "SOIL2"

[6]: http://www.horsedrawngames.com/shader-syntax-highlighting-in-visual-studio-2013/ "Nshader"