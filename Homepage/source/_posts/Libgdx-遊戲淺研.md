title: Libgdx 遊戲淺研
date: 2017-06-26 17:03:28
categories: [Libgdx]
tags: [Libgdx]
---
{% raw %}
<div>
	<img src="https://libgdx.badlogicgames.com/img/logo.png" style="width: 200px ;display:inline">
</div>
{% endraw %}

## 前言?序章? ##
[**Libgdx**](https://libgdx.badlogicgames.com/)是我目前最喜歡的遊戲開發引擎，或稱之為框架。它的厲害在於對跨平台的彈性很大，但我最喜歡說的一句話「優勢即是劣勢」，由於彈性很大，所以要磨合的地方就很多。譬如我第一個[App](/2017/04/30/Tabber-Clock-App-一個可以分類的鬧鐘/)，需要自行撰寫Android API，去理解各種Android版本所需的程式碼，現在本篇要展示Libgdx的一些知識技術，由於可選擇各種第三方插件與Libgdx相互融合，所需理解的就是許多的第三方與磨合知識。最後提一個唯一覺得是缺點的，Libgdx在撰寫UI上，藏有許多可怕的小細節，因此如果要使用Libgdx，就要跟這些細節搏鬥，好在是Open Source，底層是[Lwjgl](https://www.lwjgl.org/)，所以就算有問題，自己創造亦是一條路！
<!--more-->
<br /><br />
## 學習?開發? ##
在讓UI有點醜，經過多次改版才把bug修到很少的第一個App告一段落後，本想開發一款遊戲，但是苦於找不到點子，所以就到各大論壇看一下找點子的方法。不外乎得到的是，出去晃晃、多觀察、多找人聊天啊之類的，最後我選擇了以實作把**爛點子做個Prototype出來**的方法，這個方法強調的是，做好一個Prototype後，才可慢慢增加元素，把遊戲裝飾得更加美好。這個方案我看了很滿意，因此就開始了Libgdx漫長的Prototype開發之旅。

人家說Prototype要在一兩週最多一個月內完成，由於不知道要做什麼，所以又跑去[Itch.io](https://itch.io/)，裡面找素材讓自己有做Prototype的靈感，買了些便宜的或看似不錯的素材後，萌生了一個[Run game](https://play.google.com/store/apps/details?id=com.linecorp.LGCOOKIE&hl=zh_TW)的想法。

在有素材後，憑藉著有前一款App的開發經歷，本以為可順利打造出一款遊戲，但是事實總是殘酷的，由於以下幾點
 1. 沒有實際Prototype想法，或說沒有很明確要做Run game，那樣純粹的想法。 
 2. 遊戲開發上，總是考量到擴充性問題，所以把OO的觀念放一邊，學了遊戲最佳的架構概念(後面在提)。 
 3. 想玩遍所有Libgdx技術，所以玩了各種插件。 
 4. 想閱歷Libgdx先天們的經驗，東學西學，偷推廣[啟蒙](https://www.youtube.com/user/Profyx/about)老師。 
<br /><br />


## 插件?選用? ##
{% raw %}
<div>
	<img src="https://enigma-dev.org/docs/wiki/images/a/ab/Box2d.png" style="width: 200px ;display:inline">
</div>
{% endraw %}
[Box2D](http://box2d.org/)，2D遊戲界頂頂有名的物理引擎，由於其**自己自足(Self-Contained)**的特性，且不用相容於任何UI，使其可以在C++、Java...任何語言之間游走。其善於物理碰撞偵測與碰撞過濾器，還有可調式物理參數，讓使用者不必太在意太深細節，而專注於遊戲開發。

小提一下，由於Box2D世界是屬於Meter，因此初學者滿容易不懂Meter與Pixel如何轉換的問題，這些相關概念，有時間(?)在發篇文吧。
<br />

{% raw %}
<div>
	<img src="https://camo.githubusercontent.com/be988bf968cc1243f43f5504314d7836cee7881d/687474703a2f2f692e696d6775722e636f6d2f77386f414337332e706e673f31" style="width: 200px ;display:inline">
</div>
{% endraw %}
[Ashley](https://github.com/libgdx/ashley)，一個擁有大量共同編輯的開源**ECS系統**，何謂ECS，即是[Entity Component System](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system)，遊戲界中極為重要的系統，以前見[ThinMatrix](https://www.youtube.com/user/ThinMatrix)寫3D引擎時有用到，當初若我開發3D引擎時有學到就方便多了。

簡單介紹何謂ECS，Entity代表任何**單位**，可以是攝影機、人物、場景...天地萬物，只要認為有意義皆可，至於何謂有意義，等了解System就懂了。Component代表**元件**，像是血量、位置、速度或狀態...等。System代表**處理系統**，不論是什麼Entity，只根據使用了特定Component(s)的Entity來做處理，因此才有RenderSystem、ParticleSystem，這樣使用特別的系統來處理特別的Entity們(Renderable Componet -> Render System, Particle Component -> Particle System)。
<br />

{% raw %}
<div>
	<img src="https://cloud.githubusercontent.com/assets/2366334/4677025/64ae592a-55e2-11e4-8a31-31c2941ff995.png" style="width: 200px ;display:inline">
</div>
{% endraw %}
[gdx-AI](https://github.com/libgdx/gdx-ai)，這個最頭疼的傢伙，由於其文件糟糕程度，使得不是專門領域的人，難得其門而入，而且範例的概念，完全與Ashley背道而馳，因此為了使用gdx-AI，耗費時間甚鉅，學到的仍是皮毛，這裡就不提了，畢竟領悟不夠。

重要的三大插件都在上面，順便聊一些玩過的東西。
<br />

{% raw %}
<div>
	<img src="http://overlap2d.com/wp-content/themes/overlap2d-v3/img/logo.png" style="width: 200px ;display:inline">
</div>
{% endraw %}
[Overlap 2D](http://overlap2d.com/)，本來想用來當遊戲編輯器，但是由於其跨平台性似乎有缺陷，且使用上沒想像中好用，所以放棄了。
<br />

{% raw %}
<div>
	<img src="http://www.mapeditor.org/img/tiled-logo-white.png" style="width: 200px ;display:inline">
</div>
{% endraw %}
[Tiled](http://www.mapeditor.org/)，一個很棒的圖塊專業編輯器，還佛心免費，讓我學習了馬力歐開發的好物，不過因為我腦中的Run game不偏圖塊，因此最後沒選擇使用它。
<br />

{% raw %}
<div>
	<img src="https://cdn.codeandweb.com/img/texturepacker512.png" style="width: 200px ;display:inline">
</div>
{% endraw %}
[TexturePacker](https://www.codeandweb.com/texturepacker)，不錯的材質包裝器，基礎功能算免費的，用來將分散的材質打包成[TextureAtlas](https://www.codeandweb.com/texturepacker/tutorials)(其實應用[Libgdx內建工具](https://github.com/libgdx/libgdx/wiki/Texture-packer))，，旗下還有[PhysicsEditor](https://www.codeandweb.com/physicseditor)使用過還算不錯，但要收費，因此後來學習使用免費的[Physics Body Editor](http://www.aurelienribon.com/blog/projects/physics-body-editor/)，雖然有點麻煩，不過還算堪用。
<br />

{% raw %}
<div>
	<img src="https://github.com/libgdx/libgdx/wiki/images/particle-editor.png" style="width: 200px ;display:inline">
</div>
{% endraw %}
[2D Particle Editor](https://github.com/libgdx/libgdx/wiki/2D-Particle-Editor)，內建的特效產生器，學習資源足夠，是個好工具。
<br /><br />
## 成果? ##
此篇文章，是因想把專案告一段落，等有時間在把專案弄得更完整。

####目前的成果大致如下:####

#####遊戲編輯器:#####

{% raw %}
<div class="container-outside-div">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/W-feSDw1GGE" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}

遊戲編輯器不需要太花俏，基本功能有即可，撰寫的時候，也有想像過如何做一個Platformer遊戲通用的編輯器，不過成本頗高，加上沒什麼想法，編輯器再好也是無用。不如談談裡面的技術，主要透過Json來管控各個遊戲元件與關卡，且將遊戲資源與關卡分成\*.brpj與\*.lvl兩種，一種連結相依遊戲素材，一種儲存遊戲識別器與位置，就可有個簡單的關卡編輯器，但想深入一點，對話編輯、特殊事件之類的尚無想法耦合，畢竟若每一關用一個Class來做，那好像又超過了，不過也許是多想了，畢竟遊戲是能完成才好，不是完美架構與多重測試的商業軟體。

#####視窗/手機/網頁:#####

{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div" style="width: 33%">
		<img src="/images/RunForLife/Desktop.png" />
		<p>視窗</p>
	</div>
	<div class="container-inside-div"  style="width: 33%">
		<img src="/images/RunForLife/Android.jpg" />
		<p>手機</p>
	</div>
	<div class="container-inside-div"  style="width: 33%">
		<img src="/images/RunForLife/Html5.png" />
		<p>網頁</p>
	</div>
</div>
{% endraw %}

從做遊戲變成嘗試各種可能後，遊戲變成研究性質的東西，這邊就透露一些學到的技術吧！
1. ECS應用於畫面上的各種元件，繪製系統、平行背景系統、移動系統...等。
2. Gdxai應用於敵人的製作上，而且投入架構的緣故，把AI完全移植到一個工廠模式上，因此可將不同敵人套用不同AI，希望這模式到PathFinding或一些高深的技術時不會有問題(汗)。
3. Box2D用在各種碰撞，只是有tweak成One way walls，讓人物可以從平台下方穿越上方平台，雖然限制需要方形，但網路上還沒有完美多邊形解法。
4. Particle-2D，Libdx原生特效產生器，學會如何控制特效後放在綠瓢蟲屁股，其實好像沒什麼難的。
5. Lighting Shader，沒使用[Box2DLight](https://github.com/libgdx/box2dlights)，好歹也是圖學出生的，就親自操刀，把3D光源技術的PointLight Shader搬到了遊戲中，不過若是做光源，Box2DLight已足夠用。若要做類似刺客教條的[鷹眼特效](http://i.imgur.com/xzOn9RM.jpg)，那就需要客製Shader。題外話，縱然主OpenGL，我仍是ShaderToy中的滄海一粟中的一個小細胞啊。

跨平台上，視窗版與Android版基本上沒有什麼太大問題，iOS雖沒裝置但應比不上網頁版困難，網頁版的輸出上由於GWT的關係與撰寫Shader，導致輸出各種錯誤，好在經過數十小時的努力下終於建構出網頁版，也因此知道為何PS4/PS3會出現PSP畫質遊戲了，因為某些裝置支援的繪製能力就是比較低弱，網頁就是跨平台中最低弱的輸出平台。

還有很多繁瑣的地方，畢竟不像[Unity](https://unity3d.com/)有方便的各種系統，不過引擎只是一種工具，這些總能渡過的。總之仍是推薦使用Libgdx開發2D啦！

## 最後的最後? ##
也許是因太投入在技術，忘了遊戲的感覺，也太久沒有玩到遊戲，都在打Overwatch(?)，所以完全沒有做遊戲的靈感，因此沒有達成做出遊戲上架Google Play的目標。

*不過最近想到了一個新專案且與友人合作，如果有成，也許可以暫緩找工作的念頭，如果沒有就去找工作啦!*

<br /><br />
#### 資源 ####
給看到最後的人一點別的東西
[Let's make an indie game](https://www.youtube.com/channel/UCL_5eiPIzm--ppVBxGcSXQQ/videos)專家，尤其AI與ECS融合部分。

[Brent Aureli](https://www.youtube.com/user/Profyx/about)，就是想再提一次這位大神。

[Learnopengl](https://learnopengl.com/#!Introduction)，我圖學的啟蒙網站。

[ECS detail](https://gamedev.stackexchange.com/questions/31473/what-is-the-role-of-systems-in-a-component-based-entity-architecture)，詳細的ECS解釋。

[Music/Sound-1](http://answers.unity3d.com/questions/7743/where-can-i-find-music-or-sound-effects-for-my-gam.html)，找音樂或音效嗎?到這裡吧。

[Music/Sound-2](https://itch.io/t/11676/the-big-list-of-free-sounds)，找音樂或音效嗎?到這裡吧。

[Git最佳概念](http://nvie.com/posts/a-successful-git-branching-model/)，相信我，學這套足以打下半邊天！

[免費遊戲素材](https://opengameart.org)，雖然免費但要看懂一堆License，被這網站License轟炸後，現在略懂一點了。

[ShaderToy](https://www.shadertoy.com/)，只是提出來讓自己覺得圖學能力還遠遠不夠的網站。

[One way walls](http://www.iforce2d.net/b2dtut/one-way-walls)，多邊形單向平台解決方案。