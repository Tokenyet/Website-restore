title: "OpenGL 遊戲引擎開發日誌"
date: 2016-12-14 22:50:21
categories: [OpenGL]
tags: [OpenGL, 開發日誌, Development Journal]
---
## 本篇說明 ##
開發引擎是我用來考驗自己的方式，學習、理解並實作以往學到的各種圖學概念，並用上自己對物件導向與程式語言的熟悉度，希望能完成一個基本的如場景建置、粒子效果、物理碰撞、模組動畫...等等的功能。而更甚之希望當OpenGL或圖學界中有什麼新功能，可以在自己最熟悉的環境中依照概念實作。

系統環境: Windows 10
開發軟體: Visual Studio 2015
硬體設備: i7-3770 and GTX960
核心接口: [GLFW][1]/[GLEW][2]/[GLM][3]/[Assimp][4]/[SOIL2][5]/[Bullet Physics][8]
輔助插件: [Nshader for Visual Studio 2015][6]/[Glslify][7]

####其他事項####
** 2016/09/05 前的日誌乃日根據記憶回朔，09/05方開始打算紀錄。 **

<!--more-->

#### 2016/12/14 ####
為了優化引擎，確保以後物件多到不行而Lag的問題，這次實踐了「**Frustum Culling**」。這是一個很常用且對優化來說非常實用的功能。假想我有兩萬個物件，螢幕中，從人物的角度看出去卻只有五百個物件，那如果每個都與OpenGL溝通，讓GPU判斷，會導致非常大量無謂的**Draw Call**，換言之就是減少溝通次數，從某些層面來看比減少面數的優化實用又輕鬆多了！

關於技術的部份，**Frustum Culling**是透過**Projection Matrix**與**View Matrix**來產生出一塊虛擬的可視區(或是相關輸入參數)，透過投影矩陣可以解析出一個基本可視區，而透過視野矩陣，可以使其反矩陣後得到旋轉與位移量。透視矩陣會解析出六個盤子(跟Narrowphase碰撞偵測類似，有興趣看參考Plane Math)，乘上反矩陣就會得到世界座標的可視區，最後的步驟是，根據自己每個物件的AABB來進行篩選。說是這樣，不過還是做了好幾天啊ORZ

最後附註，由於這樣的區域看不見，因此順便努力地實踐了相對的Graphics Debugger與旁觀者Camera，雖然不是什麼新技術，不過看得到對Debug還是很有幫助的。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/dT5OltFqIJs" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}

這部分比較難看出任何效果，因為是到視窗外才會拋棄繪製，不過可以注意到的是畫面拉近到某個距離，角色就會被迅速拋棄，這樣比較細微變化。

#### Reference: ####
[View Frustum Culling](http://www.lighthouse3d.com/tutorials/view-frustum-culling/)
[Plane Math 1](http://www.lighthouse3d.com/tutorials/maths/plane/)
[Plane Math 2](http://tutorial.math.lamar.edu/Classes/CalcIII/EqnsOfPlanes.aspx)
[Cross Product Calculator](http://onlinemschool.com/math/assistance/vector/multiply1/)
[Anonymous Function in C++](http://stackoverflow.com/questions/12483753/how-do-define-anonymous-functions-in-c)


#### 2016/12/6 ####
這次紀錄，要說的專有名詞與失敗的嘗試也是非常多，就先從我要導入引擎的技術開始說起了，這次要讓引擎能有**Level Of Details**的優化效果，也就是說越遠的物體，所畫面數減少，這樣可以降低GPU的負擔，進而提升效能(以前我是不信的)。

在開始前，想投過學術的方式達成這項功能，也就是載入物件後，自動進行簡化技術。舉例來說，自動為每一個物件做出簡化的三種模型，其實是想產生三種EBO物件。而欲使用的技術為**Half-Edge Collapse**，其技術基本上來說就是，將物件統整為**Half-Edge Structure**，這樣的好處是，可以輕易查詢哪個邊、點或面使用哪個邊、點或面，此外還可以查詢鄰近的邊點面，對以後如果有需要做模組網格即時查詢很有幫助。

學習與實作完Half-Edge Collaspe技術後，不是指標無法找尋到對應的邊(Opposite pair)，就是無法削減任何一面，因此又開始了一段痛苦的找問題之旅。

起初經過不斷測試，懷疑演算法不夠堅固或邏輯有誤，因此找上了專門網格的第三方函式庫「[OpenMesh](https://www.openmesh.org/)」，導入引擎雖然有些難處，不過經過很多次導入的磨練，這倒不成問題，但問題還是出現了，使用函式庫對網格簡化所提供的**ModQuadric**演算法，也無法消除任何一面，這樣的事情等同宣告問題出在資料來源。

詳細看過資料來源的時候，經過一些發問與深度查詢，才知道原來Assimp導入的資料是所謂的Non-Manifold網格，當然這是Assimp對OpenGL/DirectX的friendly支援。而這樣的支援出現了問題，無法建立出Adjacency Graph，就無法產生Half-edge structure，而如果自行實作物件讀取器，又無法多檔支援。至於為什麼Assimp的格式會這樣? 仔細想過，如果一個Vertex只支援多個Normal還有多個TexCoord(也許還有bone weight)，那寫讀取器的時候，到底是要怎麼讓Vertex擁有多個資料還要知道是哪個面的? Assimp就將點分為多個不同但同位置的點，然後讓一個Vertex只帶一組Normal和TexCoord。

想通箇中困難後，本來趨近於放棄實作Lod，但是靈機一動想到，改寫程式架構，使一個物件可以承載多個物件，就可以在適當的時候做切換。這樣的好處是，可以控制簡化後的模型，還有品質也是自己控制的。壞處是，必須先做好多種模型。因此這裡想到了一個很好的解，就是在Blender寫一個專門的lod格式的obj檔，然後寫一個專門的讀取器，可以讀一個物件帶多個EBO，那就解決了。不過壞處是，只支援obj檔。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/0OViWX_mafo" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}

#### Problem And Slove ####
在自己實作期間遇到的問題與解決:
[Edge Collapse with Assimp](http://stackoverflow.com/questions/40880330/edge-collapse-with-assimp/40905514#40905514)
[Mesh Simplification with Assimp and OpenMesh](http://stackoverflow.com/questions/40961441/mesh-simplification-with-assimp-and-openmesh/40989491#40989491)

#### Reference: ####
[The Half-Edge Data Structure](http://www.flipcode.com/archives/The_Half-Edge_Data_Structure.shtml)
[The Halfedge Data Structure](http://www.openmesh.org/Daily-Builds/Doc/a00016.html)
[Mesh Simplication 1](https://www.cs.mtu.edu/~shene/COURSES/cs3621/SLIDES/Simplification.pdf)
[Mesh Simplication 2](http://graphics.stanford.edu/courses/cs468-10-fall/LectureSlides/08_Simplification.pdf)
[Mesh Simplication 3](http://www.cs.virginia.edu/~gfx/Courses/1999/advanced.spring99.html/lecture23/sld001.htm)
[Mesh Simplication Code](https://github.com/novalain/mesh-simplification/blob/master/Mesh.h)
[Mesh Decimation Framework by OpenMesh](http://www.openmesh.org/Documentation/OpenMesh-Doc-Latest/a00004.html#DecimaterExa)
[Halfedge and Mesh Simplication Explaination](http://stackoverflow.com/questions/15365471/initializing-half-edge-data-structure-from-vertices)
[Halfedge and Mesh Simplication Issue](http://stackoverflow.com/questions/27049163/mesh-simplification-edge-collapse-conditions)
[Meshlab](http://meshlab.sourceforge.net/)


#### 2016/11/25 ####
又一次革命性系統改革，將以前天真的架構砍了，又把原本碰撞系統各種關聯全部砍掉，為的就是引進新的物理系統**「Bullet Physics」**。透過天才所做的物理引擎，可以節省實作碰撞系統與物理模擬的各種難題與測試。當然換引擎的代價也是很大的，學習使用一個引擎除了要有豐厚的經驗才能搭建橋樑外，還有原本的架構擺好卻要大修改，此外還牽涉到讀檔與圖形暫存記憶體管理的部分，實在非常之多啊。

當然換新引擎不是沒有缺陷，這樣的引擎由於物理特性十足，有時候要模擬像是人物走路或者一些簡單動作的時候，在我之前粗鄙的引擎下十分容易且順暢，但是在成熟引擎擁有各種質量、摩擦力...的特性，所以為了表現如我想像，經過了很多調校，終於調整到看起來舒服的樣子，雖然還是有點小問題，不過都是等以後熟練後就能駕馭。

此外**Graphic Debugger**，在這段實作上仍佔十分重要的地位，當初未了解**Bullet Physics**，所以自行以挖資料的方式實作一個，但某天發現Bullet Physics竟然有提供這樣的介面！就花了幾天實作了出來，其中碰到記憶體管理問題，還會讓網頁或影片炸裂，差點害我以為顯卡被我玩壞了，不過也因為碰到這問題才知道VBO的管理是十分必要的，如果每次產生物件都不去理會暫存，那爆掉的那刻，影響的不只是程式，而是用到GPU的所有程式。

這邊就不列出到底改了什麼就簡單提點一下實作關鍵。
1. Debug模式下測試**個位數**的Bullet Physics物件，Release模式下測試**大量物件**，否則會Lag。
2. 架構最好不要多重繼承，雙重就已悲劇，不管如何都要使用介面或抽象方式。
3. 若要渲染多筆相似物件，可以考慮渲染前再存入Buffer，一次送給GPU，此非Instancing，不過也適用。
4. 動態物件必須要做Convex Reduction，否則物理引擎會受不了(?)
5. Bullet Physics的原點是質量原點，繪製原點則是: {% math %}
\begin{bmatrix} 
Origin_{visual}.x \\
Origin_{visual}.y \\
Origin_{visual}.z \\
\end{bmatrix}
= 
\begin{bmatrix} 
Origin_{bullet}.x \\
Origin_{bullet}.y + Offset_{localspace} \times Scale_{entity} \\ 
Origin_{bullet}.z \\
\end{bmatrix}
{% endmath %}

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/zAXUK8q5jUg" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}
最後Release模式下，未開圖形除錯器:60fps，開了:35fps，差異是多繪製了幾十萬條線，也許以後需要其他方式優化。

#### Problem And Slove ####
在自己實作期間遇到的問題與解決:
[Few rigidbody cause Bullet Physics slowly](http://stackoverflow.com/questions/40574918/few-rigidbody-cause-bullet-physics-slowly/40587204#40587204)
[Debug mode or Release mode](http://stackoverflow.com/questions/40575482/debug-mode-or-release-mode)

#### Reference: ####
[btShapeHull vertex reduction utility](http://www.bulletphysics.org/mediawiki-1.5.8/index.php/BtShapeHull_vertex_reduction_utility)
[Bullet Physics Tutorial](http://bulletphysics.org/mediawiki-1.5.8/index.php/Tutorial_Articles)
[Bullet Physics Collision Callback](https://www.youtube.com/watch?v=YweNArzAHs4)
[Character Movement in physics engine](http://gamedev.stackexchange.com/questions/24772/how-would-i-move-a-character-in-an-rpg-with-bullet-physics-ogre3d)
[Sphere Vertices Generation 1](http://stackoverflow.com/questions/5988686/creating-a-3d-sphere-in-opengl-using-visual-c)
[Sphere Vertices Generation 2](http://gamedev.stackexchange.com/questions/16585/how-do-you-programmatically-generate-a-sphere)
[Bullet Physics Object Origin 1](http://stackoverflow.com/questions/24825615/libgdx-bullet-offset-origin?rq=1)
[Bullet Physics Object Origin 2](http://www.bulletphysics.org/Bullet/phpBB3/viewtopic.php?f=9&t=2209)
[Collision Margin Technique 1](http://gamedev.stackexchange.com/questions/113774/why-do-physics-engines-use-collision-margins)
[Collision Margin Technique 2](https://www.youtube.com/watch?v=BGAwRKPlpCw)
[Graphic Debugger for old opengl example](https://github.com/NickHardeman/ofxBullet/blob/master/src/render/GLDebugDrawer.cpp)

#### 2016/11/5 ####
消失了將近一個月，其實是碰撞系統實在是太難實作。由於以為上一個部分的SAP Broad Phase Collision Detection 實作完畢且正確，導致我在這部分卡了個天荒地老，還好期間有接案來騙自己這段時間沒有白費(?)，不過經過這一番戰役，我確定打了個敗仗，當然收穫還是很多的。

首先這個月來實作的是Narrow Phase Collision Detection，光看Paper花了約一週詳細了解數學，但是發現其中的數學寫得並不完整，只給公式不講解由來的部分也有，所幸後面部分有附一些關鍵程式碼，還可以納入自己的系統中。Paper位於後方參考。

再來經由無數的失敗直到前幾天，才知道原來Broad Phase的部分，在AABB Box原來並不是**想像**中的那樣，當時不了解Graphics Debugger的精隨，現在終於懂一點了。這部分影片中會展示。

目前碰撞系統缺陷
1. 兩動態物體無法完美碰撞，因此拿掉此部分。
2. AABBbox 範圍不夠大，會導致Narrow Phase演算法判斷失敗。

經歷這場敗仗的收穫
1. Graphics Debugger很重要。
2. 不要過度Reinvent the wheel。
3. Broad Phase Collion Detection代表可能碰撞的物件。
4. Narrow Phase Collion Detection代表測試物件詳細碰撞表面並予以回應。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/As8FOJfmH1E" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}


##### Reference: #####
[collision detection and response](http://www.peroxide.dk/papers/collision/collision.pdf)
[deeper article - dynamic bounding volume](http://www.codeproject.com/Articles/832957/Dynamic-Bounding-Volume-Hiearchy-in-Csharp)
[deeper article - octree](http://www.gamedev.net/page/resources/_/technical/game-programming/introduction-to-octrees-r3529)



#### 2016/10/09 ####
研究了好幾天，看了Paper無數遍，終於完成了**Sweep And Prune**的碰撞系統!(其實是卡了作者講了一句我看不懂的話卡了好幾天，到現在仍是未知 .汗)，在碰撞物件排序上使用了**Radix Sort**，不過在碰撞物件不到過萬，**Radix Sort**根本耗時，因此換成**Quick Sort**。

##### Subject: 基礎碰撞偵測系統 #####
##### Add: #####
1. 新增CollisionSystem，專門將Entity指標轉為碰撞專用Rigid指標。
2. 新增PropertyMaster，任何實作此介面者，可作為屬性大師(?)，目的是讓Entity物件以後需要各種屬性時使用，像是加上Rigid屬性，CollisionSystem便可從該實例中取出該屬性，注意的是PropertyMaster只能同類別(Property Type)只能擁有一個Property。
3. 新增SAPCollisionSystem，透過CollisionSystem呼叫後，會經由此系統判定後回傳物件碰撞結果。

##### Note&Imp Note: #####
1. 雖然此碰撞系統速度很快，算是**Broad-Phase Collision Detection**，但仍要進行非常多優化，像是物件不該每個frame重新移除加入後判定，還有使用[Uniform Grid](https://0fps.net/2015/01/18/collision-detection-part-2/)與[Dynamic AABB tree](http://www.randygaul.net/2013/08/06/dynamic-aabb-tree/)，加速取得碰撞物件的技巧。
2. 除了碰撞系統外，其他系統也是不該每個迴圈重新運算，完全是測試取向。
3. 接下來的開發會針對碰撞偵測與優化，因為下個目標是實作**Narrow Phase Collision Detection**，當然會花時間重新構築整個引擎與各系統。
4. 優化的目標項目有: **View Frustum Culling**，**Edge Collapse Algorithm**。
5. 最後最遠的目標: Multiplayer, Water, Shadow Mapping, Deferred Shading...。

##### Reference: #####
[SAP paper](http://www.codercorner.com/SAP.pdf)
[FastBoxIntersection Paper](http://pub.ist.ac.at/~edels/Papers/2002-J-01-FastBoxIntersection.pdf)
[Quick Sort](http://program-lover.blogspot.tw/2008/11/quicksort.html)
[Radix Sort](http://www.codercorner.com/RadixSortRevisited.htm)
[Radix Sort Chinese](http://notepad.yehyeh.net/Content/Algorithm/Sort/Radix/Radix.php)

縱使目前引擎如Note處描述有多糟糕，但是fps仍有18以上。好啦，是非常糟糕，希望過幾個月後能大幅提升效能。順道一提，本碰撞系統測試影片中約300多個碰撞物件的碰撞測試，只讓樹與人加上碰撞屬性。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/1vc0lKWDh-s" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}


#### 2016/10/02 ####
##### Subject: Skybox #####
##### Add: #####
1. 新增Skybox，目前支援日夜變化，與天體旋轉。
2. 新增SkyboxShader，繪製天體的Shader，支援迷霧遮蔽天體。
3. 新增SkyboxRenderer，日夜變化參數控制，繪製單一Skybox。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/3aOPsv3wYUM" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}


#### 2016/10/01 ####
這幾天學了一個強大的工具**glslify**，雖然是屬於Nodejs的範疇，但是並不用懂任何javascript或原生語法，只需要依照管理概念去分散Shader，就可以達到Reuse的最大效用。
##### Subject: 引入多光源系統 #####
##### Add: #####
1. 新增DirLight，繼承基本光源，用不到的屬性可用來繪製光源位置。
2. 新增PointLight，繼承基本光源。
3. 新增SpotLight，但目前尚不實作出來。

##### Modify&Improment: #####
1. 修改基本Shader檔，透過glslify產生。
2. 修改Mesh Shader檔，透過glslify產生，並修正VertexShader產生的Normal Vector錯誤。
3. 修改Terrain Shader檔，透過glslify產生。

大概的使用如圖:

{% img "/images/ODJ/20161001screenshot.png" 420 %}

當前畫面:

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/XZ5kvIsFL10" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}



#### 2016/09/29 ####
##### Subject: GUI系統實作 #####
##### Add: #####
1. 新增GuiTexture，專門用來顯示在GUI系統中。
2. 新增GuiRenderer，稱為GUI系統，也可稱為Renderer。
3. 新增GuiShader，綁定GuiRenderer。

##### Note: #####
1. GUI實作不可使用Normalized位置，傳入Shader後做矩陣轉換會導致圖像變形。 (雖然可以想像得出原因，但還不太好解釋)
2. 將系統架構定義為視窗中間為原點的架構，左右則為視窗的視窗像素寬高，例如原點為$(0,0)$，那$X$軸的範圍就是$\begin{bmatrix}\frac{-width}{2} 
\thicksim \frac{width}{2}\end{bmatrix}$，而$Y$軸的範圍就是$\begin{bmatrix}\frac{-height}{2} 
\thicksim \frac{height}{2}\end{bmatrix}$。
3. GUI元件做縮放旋轉可依照3D世界的概念，但位移必須額外傳入Shader，詳細解方寫於**Other**中的解答區。

##### Other: #####
1. 在google找尋解決2D圖片變形的GUI問題，皆沒人解答，Dowen克服後到其中一篇稱為[Keep 2d GUI shape through rotation](http://gamedev.stackexchange.com/questions/128052/keep-2d-gui-shape-through-rotation/130654#130654)提出解決方案。


{% img "/images/ODJ/20160928screenshot.png" 420 %}


#### 2016/09/26 ####
終於完成了一個簡單的人物動畫系統，雖然程式架構上有許多需要改進的部分，但模組動畫的引入實作，到這裡終於可以告一段落，從上個階段完成的讀取單一動畫，到變成一個可以載入多模組動畫的架構，真的是認識到C++許多物件導向與指標的糾葛，如有一日要完整重構，可能目前許多地方都得改成指標才能避免無謂的資料複製與操作。

##### Add: #####
1. 新增AnimatablePlayer，繼承Player，隨人物移動觸發動畫移動事件。
2. 新增CustomPlayer，繼承AnimatablePlayer，為實作AnimatablePlayer控制動畫移動。
3. 新增Animation，將動畫一切資訊與操作從MeshModel移至此。

##### Modify: #####
1. 修改AssimpLoader，將原本載入MeshModel且動畫資訊的地方，改回只讀MeshModel與骨架資訊。
2. 修改MeshModel，改回純粹的Mesh模組。
3. 修改MeshesModel，用來管理整個模組的所有骨架基本資訊(inverseBindPose, index)，並接受自定義動畫名稱與動畫實體，但需注意動畫名稱需與實作AnimatablePlayer者相同。
4. 修改AssimpLoader，新增專門載入模組動畫的函式。

{% raw %}
<div class="container-outside-div">
		<img src="/images/ODJ/20160926screenshot.png" style="width: 420px">
		<p>Modify.3中提到的使用者傳入自定義動畫名稱與實體。</p>
</div>
{% endraw %}


{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/mkb4ys7f4mw" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}


#### 2016/09/24 ####
過了一周的Assimp動畫實作與各種數學矩陣的轉換後，終於在自己的引擎中可支援骨架動畫，起初實作。不了解背後數學公式與一些OpenGL技巧，導致最後連模組都無法出現，到中期了解數學公式後，在OpenGL中將Int資料填入Shader必須使用 `glVertexAttribIPointer`。還有`glBindAttribLocation`的使用時機，導致需要重整ShaderProgram相關程式。最後末期，由於Assimp文件中有些地方解釋模糊，在Stackoverflow發文後，還是靠自己無數的Debug後，才知道該矩陣的意義。

##### Modify: #####
1. 修改ShaderProgram、StaticShader、MeshShader、TerrainShader。
2. 修改MeshModel，以支援骨架與動畫資訊。
3. 修改AssimpLoader，支援骨架與動畫的格式，主要使用COLLADA(*.dae)。

##### Debug: #####
1. 修復`glBindAttribLocation`在基底Shader中的呼叫情況。
2. 從`glVertexAttribPointer` 修復為`glVertexAttribIPointer`在Loader載入Vertex Attribute為Int資料上，無法傳入的問題。
3. 修復骨架矩陣上的各種問題。

##### Other: #####
1. [Stackoverflow的發問與自解](http://stackoverflow.com/questions/39632517/assimp-animation-bone-transformation/39666893#39666893)。

##### Reminder: #####
1. 發表關於`glBindAttribLocation`的蠢問題文章。
2. 發表關於如何利用Assimp載入模組與動畫知識的文章。

##### Reference: #####
1. [Skeletal Animation With Assimp](http://ogldev.atspace.co.uk/www/tutorial38/tutorial38.html)
2. [Matrix calculations for gpu skinning](http://stackoverflow.com/questions/29565245/matrix-calculations-for-gpu-skinning#comment47327416_29565245)
3. [OpenGL : Bone Animation, Why Do I Need Inverse of Bind Pose When Working with GPU?](http://stackoverflow.com/questions/17127994/opengl-bone-animation-why-do-i-need-inverse-of-bind-pose-when-working-with-gp)
4. [Game Engine Architecture](https://www.amazon.com/Game-Engine-Architecture-Jason-Gregory/dp/1568814135/ref=sr_1_1?ie=UTF8&qid=1341514685)
5. [Blender Matrix to OpenGL Matrix](https://www.blender.org/forum/viewtopic.php?t=26417)
6. [I can't figure out how to animate my loaded model with Assimp](http://gamedev.stackexchange.com/questions/26382/i-cant-figure-out-how-to-animate-my-loaded-model-with-assimp)

{% raw %}
<div class="container-outside-div">
		<img src="/images/ODJ/20160924screenshot.gif" style="width: 420px">
		<p>(模組躺著是因為Blender座標系統與OpenGL座標系統有出入，以後慢慢修復。)</p>
</div>
{% endraw %}


#### 2016/09/19 ####
##### Target: 引入3D模組動畫 #####
##### Progress&Record: ##### 
1. 了解骨架空間矩陣運算
2. 了解模組動畫Keyframe
3. Game Engine Architecture Jason Gregory, page 11.1 ~ 11.5節很重要。
4. 了解需注意開發環境與輸入檔案是否同為左手或右手座標空間，若不同則需轉換。
5. 了解GLM與ASSIMP矩陣上，前者為Column Major，後者為Row Major，在骨架使用上皆必須先轉置，否則結果將不如預期。

##### Other Other: #####
研究螢幕閃頻與檯燈閃頻問題。
護眼螢幕: 淨藍光、不閃頻
護眼檯燈: 不閃頻、抗眩光


#### 2016/09/15 ####
Learn: 3D模組建構
1. 認識基本3D模組建構。
2. 認識模組UV Mapping。
3. 認識模組比重繪製。
4. 認識基本骨架。
5. 認識骨架綁定。
6. 認識控制骨架。
7. 使用Paint.Net繪製UV Mapping。

{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/ODJ/20160915screenshot1.png" style="width: 300px">
		<p>模組切割紀錄</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/ODJ/20160915screenshot2.png" style="width: 300px">
		<p>骨架操作紀錄</p>
	</div>
</div>
{% endraw %}
{% img "" 420 %}


#### 2016/09/14 ####
##### Think&Imp: Texture Atlases #####
1. 支援多材質圖片。

##### Note 1: ##### 相關使用如樹木四季變化,不同樹葉同模組草地。

{% img "/images/ODJ/20160914screenshot.png" 420 %}


#### 2016/09/12 ####
##### Think&Imp: 地形碰撞偵測，場景物體貼齊地形 #####
1. 記錄地形每點高度，利用重心座標系平緩高度變化。

##### Note 1: ##### 地形碰撞偵測使用到Barycentric Coordinate，相關數學知識紀錄於數學筆記區中。

##### Big Isuue: ##### 許多資料型態都應使用指標較符合使用情境，C++中動態記錄陣列必定要使用指標為宣告方式，否則會被馬上解構，因此地形全使用指標式，從表層改入裏層。難怪Cocos2d任何物體都使用`->`來操作物件，而不是`.`。C++真是個難開發的語言阿...。

{% img "/images/ODJ/20160912screenshot.png" 420 %}


#### 2016/09/11 ####
##### Think&Imp: 進階地形&整理程式 #####
1. 支援24bit Height Map調整地形起伏變化。
2. 增加地形Normal向量，支援光影變化。

##### Note 1: ##### 地形之Normal是以Finite Difference方法算出，相較於Cross Product 法更為節省效能，不過也有在Geometry Shader利用GPU負擔的算法，也許以後可以實驗比較。

##### Note 2: ##### 首次用到位元位移技巧，利用SOIL提供讀取完後的unsinged char*位移轉換可將24bit存入32bit int中。原先利用std::bitset<24>，但實在過於緩慢，方自己寫24bit -> int。而若使用到透明度，可以從原本支援地形變化16,777,216種變為4,294,967,296種。

{% img "/images/ODJ/20160911screenshot.png" 420 %}


#### 2016/09/10 ####
##### Think&Imp: 第三人稱攝影機 #####
1. 新增滑鼠點擊與滾輪的Callback事件。
2. 新增第三人稱攝影機PlayerCamera。

##### Issue: ##### glfw事件屬於driven式，雖然是poll check，不過沒driven到就不會觸發callback，因此在滑鼠滾輪事件上需要添加Timestamp來製作Mouse靜態Class的調整。

{% raw %}
<div class="container-outside-div">
<iframe width="560" height="315" src="https://www.youtube.com/embed/btdXzboOrGI" frameborder="0" allowfullscreen align="middle"></iframe>
</div>
{% endraw %}


#### 2016/09/08 ####
##### Think&Imp: 地形多重材質混合 #####
1. 新增TerrainTexturePack，包含四個顏色。
2. 修改TerrainRenderer與TerrainShader配合BlendMap概念。

##### Other: ##### 地形利用RGB與黑色達成四個材質混合，如果利用透明度可達成五個材質，又有聞之用其他色彩數學方法可達成八材質，Unity基本支援即是八種材質地形。

##### Issue 1: ##### 縱使單一材質地形仍須使用BlendMap。
##### Issue 2: ##### 需要一所見及所得的編輯器比較好製作BlendMap。

{% img "/images/ODJ/20160908screenshot.png" 420 %}


#### 2016/09/07 ####
##### Think&Imp: 增加草地物件與迷霧效果 #####
1. 修改SOIL讀取圖片格式從SOIL_LOAD_RGB -> SOIL_LOAD_RGBA，支援透明度。
2. 修改一般Shader中遇到透明會自動discard。
3. 將Texture.ID改為Texture.GetID(),C++的Readonly public variable不可信任。
4. 草地運用trick: Fake Lighting，使Normal都朝上，讓光源一致。
5. 將各種Shader從Renderer中拔出，將共同參數交給MasterRenderer一起設置，以免未來更改Super Shader需要從每個Renderer中逐一修改。
6. 針對單一天空顏色產生遠處迷霧效果，僅光源暫時不參與迷霧效果。

##### Question: ##### 迷霧效果是實踐於Vertex Shader，其原理與常用的深度轉換FragCoord.z相似，是否應實踐於Fragment且改用深度轉換效果較佳，因為Vertex Shader到Fragment是Intepolate的方式產生插值，就如早期光影[Gouraud Shading](https://en.wikipedia.org/wiki/Gouraud_shading)的視覺差異。

##### Other: ##### Terrain的迷霧密度不小心調太高導致畫面不協調。

{% img "/images/ODJ/20160907screenshot.png" 420 %}


#### 2016/09/06 ####
##### Think&Imp: 增加平坦地形相關繪製功能 #####
1. 增加Terrain物件。
2. 增加TerrainRenderer利用效率較高的GL_TRIANGE_STRIP繪製地形。
3. 增加TerrainShader，繼承一般Shader，擁有基本光影。

##### Issue: ##### 樹木物件數量繪製達500有些微Lag，至1000有明顯Lag，以後需要新增Instancing功能。

{% img "/images/ODJ/20160906screenshot.png" 420 %}


#### 2016/09/05 ####
##### Think&Imp: Renderer分割責任 #####
1. 引入Template，將Entity<模組>，代表任何模組都可擁有位置、旋轉等基礎參數。
2. MasterRenderer: 總繪製器，儲存使用者不同的物件Entity List。
3. LightSourceRenderer: 光源繪製，目前專門繪製PointLight的光源。
4. MeshesRenderer: 模組面集合繪製，將模組載入之所有面進行繪製。
5. Renderer: 一般的Renderer，只繪製擁有一張貼圖的物件。
6. CubeShader: 目前當作光源繪製著色器，只接受基本光源參數。
7. ModelShader: 模組用，也許未來需依照模組新增其他模組著色器，目前支援單一光源的Phong光影特效。
8. StaticShader: 僅適合單一材質物件，不過也支持光影特效。
9. 優化Texture載入次數。

##### Issue: 優化在C++中的問題 #####
若Texture相同，就不重新載入，但遇到std::map跟std::unorder_map使用問題，由於std::unorder_map太難實作，故利用std::map並讓TextureModel可以互相比較來建立材質索引表。所幸TextureID OpenGL控制得很好，載入過的材質僅讓使用者維護編號，因此利用TextureModel當std::map的key可行。

{% img "/images/ODJ/20160905screenshot.png" 420 %}


#### 2016/09/04 ####
##### Think&Imp: 新增著色器與不同Renderer與引入Assimp，並實作簡單光影。 #####
1. 引入模組載入AssimpLoader，新增一組MeshRenderer與MeshShader來專門繪製模組。
2. 加入Phong Model的光影特效。
3. 利用Debug版Assimp載入史丹佛龍約略7秒，Release版約略1秒。


#### 2016/09/03 ####
##### Think&Imp: 基礎架構與模組載入 #####
1. 修改核心模組，將Keyboard、Mouse、ErrorCheck、Debug等訊息以靜態方式呼叫。
2. 新增TextureModel概念，擁有BasicRenderModel及一組材質讀取。
3. 加入Entity概念，Entity代表物件的位置、旋轉角、縮放...等基礎屬性。
4. 實作讀取簡單obj file的ObjLoader。

##### Issue: 模組讀取速度 #####
對於讀取一個[史丹佛龍](http://graphics.stanford.edu/data/3Dscanrep/dragon.gif)來講，C++的getline實在非常緩慢，大概要一分鐘才可載入完200,000行的OBJ。思考引入Assimp。

{% img "/images/ODJ/long-time-dragon.png" 420 %}


#### 2016/09/02 ####
##### Think&Imp: 基礎架構 #####
1. 基礎四元素 Renderer, BasicRenderModel, Shader, Loader
2. Renderer: 目前專門繪製單一BasicRenderModel。
3. BasicRenderModel: 只是一個存取用的資料結構，存放VAO與繪製點數(Indices)。
4. Shader: 延伸Shader，繼承Shader介面者，代表一組特殊的著色器，未來可分為一般物件著色氣、模組著色器、地形著色器...。
5. Loader: 載入資料與創造BasicRenderModel，並且具有資源管理，管理所有VAO,VBO。


#### 2016/09/01 ####
##### Re-Contruct: 架構除了核心部分打掉重練。 #####
##### Re-Target: 失敗經驗，並吸收外國專家經驗，重新架構。 #####


#### 2016/08/31 ####
##### Think&Imp: 加入地形材質 #####

{% img "/images/ODJ/flat-terrian.png" 420 %}


#### 2016/08/30 ####
##### Think&Imp: 繪製平坦地形 #####
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
##### Think&Imp: 繪製平面與正方體 #####
1. 依照CCW順序，自行建構正方體的Vertex與Index。
##### Issue: #####
1. 開發有點吃緊，許多參數如位置、旋轉...等不知如何參與。


#### 2016/08/28 ####
##### Issue: #####
1. 實作並思考後發現，對於Renderer與Shader的定義不明確。
2. Renderer依照此模式下去，只有一個而且責任非常小，將限制RenderOjbect開發。
3. Shader目前定位非常虛幻，每一個新物件必須重新實作且綁定。


#### 2016/08/27 ####
##### Think&Imp: 繪製基本物件架構。 #####
1. 每個基礎的可繪製物件稱為RenderObject。
2. RenderObject大致為StartUp,Shutdown,Render。
3. RenderSystem繪製RenderObject抽象的集合。
4. 繼承RenderObject者可任意實作自己的繪製函式。


#### 2016/08/26 ####
##### Target: 依照書中所見的sb7來嘗試實作一個類似的開發環境。 #####
##### Think&Imp: 建立基礎環境。 #####
1. 建立Core類別存放核心標頭GLFW,GLEW,GLM。
2. 匯入Shader類別，提供vertex,fragment,geometry,tessellation...基礎建構功能，從檔案載入。
3. 匯入Camera類別，提供基本攝影機移動。


[1]: http://www.glfw.org/ "GLFW"

[2]: http://glew.sourceforge.net/ "GLEW"

[3]: http://glm.g-truc.net/ "GLM"

[4]: http://www.assimp.org/ "Assimp"

[5]: https://bitbucket.org/SpartanJ/soil2 "SOIL2"

[6]: http://www.horsedrawngames.com/shader-syntax-highlighting-in-visual-studio-2013/ "Nshader"

[7]: https://github.com/stackgl/glslify "GLSLIFY"

[8]: https://github.com/bulletphysics/bullet3/releases "Bullet Physics"