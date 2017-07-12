title: 'A* Path finding With Libgdx'
date: 2017-07-13 1:05:51
categories: [Libgdx]
tags: [Libgdx, A*, A Star, path finding]
---
{% raw %}
<div>
	<img src="https://upload.wikimedia.org/wikipedia/commons/9/98/AstarExampleEn.gif" style="width: 500px ;display:inline">
</div>
{% endraw %}

## 起源 ##
老毛病了，總是想做個遊戲，也想了許多特色跟腦中的構想，但又突然被技術吸引過去，一個死工程師的概念，所以我決定一旦有什麼技術測試完成就立即撰下幾筆。

<!--more-->
<br /><br />
## 正文 ##
在開始講正式的路徑搜尋前，可以先思考如果要自己發明的話，該如何實作。首先假設這裡有個{% math %}30x51{% endmath %}的網格，最左下是起點，右上是終點，然後沒有障礙物。用眼睛看最佳的路徑，一定是不走回頭路即可。

{% img "/images/AstarLibgdx/noobstacle.png" 420 %}

但當障礙物一多的時候，哪一條才是真正的最佳路徑呢?哦，抱歉，如果是想找最佳路徑，可能得按上一頁了，因為A*也不是找最佳路徑的演算法。

{% img "/images/AstarLibgdx/obstacle.png" 420 %}

看上方這張圖，由於是用隨機產生演算法，可能會讓讀者覺得好走，但對電腦就不同了，給一個點跟目標，必須嘗試過往右往上，如果遇到障礙物過多，甚至還要回頭呢。
<br />
 #### A\* Path finding(簡稱A\*) ####
 情境大概建立起來了，接下來就進入正式的演算法上。該演算法主要的參數有{% math %}f\left(G\right), f\left(H\right), f\left(F\right){% endmath %}，G代表與上一步累加的距離，F代表G+H的總和可以說是一個總權重，那H就特別了，稱為**啟發值(Heuristic)**，而要每個人需根據自己需求，改變產生啟發值函式。不瞞讀者，Dowen用的只是數學的距離公式{% math %}\sqrt{\left(x_0 - x_1\right)^2 +\left(y_0 - y_1\right)^2}{% endmath %}當啟發值而已。
<br />
而演算法有些難說明，就搭配[Wiki的Persudo-code](https://en.wikipedia.org/wiki/A*_search_algorithm)來說明吧。
`closedSet := {}`，在每回合演算法執行(Loop)，最佳的節點就會被存在`closedSet`。
`openSet := {start}` 每回合都會加入根據上一回合演算的可能性，其實就是鄰居啦。
`comeFrom` 紀錄每個節點的最佳上一步，或說這個點最好的走法是從上個點來的。
`gScore := map with default value of Infinity` 
會根據每回合算完後...等等會說到，既知道為何要無限大。
`gScore[start] := 0` 同上
`fScore := map with default value of Infinity` 同上。
`fScore[start] := heuristic_cost_estimate(start, goal)` 同上。
`current := the node in openSet having the lowest fScore[] value` 找當前最佳f值來當要走的下一步。
`openSet.Remove(current)` 剔除掉當前最佳節點，就不會再算一次。
`closedSet.Add(current)` 把算過的放進來。
`if neighbor in closedSet` 鄰居是算過的就跳過。
`if neighbor not in openSet` 鄰居不在待運算區，就放著等下回合算。
` tentative_gScore := gScore[current] + dist_between(current, neighbor)` g權重是由上一個節點和與上個節點的距離所算出來的，所以起始節點是0，右邊可能是1，下面可能是2，然後右邊的右邊從1+距離，下面的任一邊也是。
`if tentative_gScore >= gScore[neighbor]` 這裡避免覆蓋已有的最佳g值，由於可能被算過(在openSet內)，所以要確保不會覆蓋最佳值。
`cameFrom[neighbor] := current` 幫鄰居設定當前節點是最佳的來源節點。
`gScore[neighbor] := tentative_gScore` 覆寫或第一次寫入g值。
`fScore[neighbor] := gScore[neighbor] + heuristic_cost_estimate(neighbor, goal)` 只是個總權重值。
`return failure` 找不到任何路徑。

<br />
#### 研究結果 ####
不知道有沒有解釋好，總之「按圖施工，保證成功」，雖然自己實作上，東漏西漏，而且資料結構些許不同，但仍可結合自己的理念完成！

{% raw %}
<div class="container-outside-div">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/XEqCkgJzAwg" frameborder="0" allowfullscreen></iframe>
</div>
{% endraw %}

影片中，各種綠框框代表Box2D的靜態Body物件，必須寫個方法將物件映射到一個虛擬格子地圖上，之後才可使用。這影片中還有很多問題存在：
1. 村民碰撞矩形會導致虛擬地圖判斷可行走，實際不可的問題。
2. 若靜態物體為多邊形，則需要一個公式映射，並且會導致肉眼認為可行走，演算法不行的一致性問題。
3. A*演算法尚可經由許多調校，像是格子紀錄用更好的資料結構，Dowen用2D矩陣。還有啟發值產生函式，也還有其他可能性。

一些優化：
A1. 也許將判斷不可行走的區域，設定為直直朝向，或是找到附近可行走區域後，在直直朝向，就可以解決Box2D世界與虛擬地圖的問題。
A2. [多邊形格子](https://stackoverflow.com/questions/12460939/algorithm-cutting-polygon-by-grid)，如果要將多邊形映射完成，首先必須要了解其他演算法，不然就像Dowen一樣，自己限制城矩形吧(誤)。

<br /><br />
## 資源 ##
[A* Pathfinding-1](https://www.youtube.com/watch?v=KNXfSOx4eEE)

[A* Pathfinding-2](https://www.youtube.com/watch?v=aKYlikFAV4k&feature=youtu.be)

[A* Pathfinding Wiki](https://en.wikipedia.org/wiki/A*_search_algorithm)

[Tile maps](https://github.com/libgdx/libgdx/wiki/Tile-maps)
