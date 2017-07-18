title: TileRetriever圖格檢索器
date: 2017-07-18 17:10:01
categories: [Tool]
tags: [Tile]
---
{% img "/images/TileRetriever/GameSnapshot.png" 300 %}

## 由來 ##
最近正在開發一款**Tile**為美術核心的遊戲，本來使用[Tiled][]，將場景各個物件擺好後，再新增一個Object層，來擺放一些幾何的元素，讓[Box2D][]進行碰撞。y在場景與碰撞都設定好後，剩下的人物則需要在Object層指定位置，額外在程式中產生。人物的額外產生不是問題，因為每個動作影格都是固定Size的，但場景物件支援可以拆除或新增就不同了，畢竟場景元素都是**Tile**組成，例如一棟房子可能會是**各種Tile的集合體**，更甚之，一個房子還會有其他招牌什麼的，這樣就會使房子變成許多層Tile的集合體，因此也沒有固定的碰撞區域或固定圖格。
<!--more-->
</br>
</br>
## 截圖 ##
撇開程式要處理多層級Tile不說，還有其物理碰撞。這篇主要是要介紹Dowen花了點小時間製作的[TileRetriever](/project/TileRetriever.html)，用處在於程式中製作物件時，可以輕鬆得知各個Tile分別在圖格座標系的$ (x, y) $位置，如下圖所示：
</br>
</br>
{% img "/images/TileRetriever/Example.png" 1280 %}

如果要產生一棟房子，勢必要知道各個Tile所在位置，像是得知如下格式:
``` java
    final int[] TILE = { // x,y ....
            33,0,34,0,34,0,34,0,34,0,35,0,
            33,1,34,1,34,1,34,1,34,1,35,1,
            33,2,34,2,34,2,34,2,34,2,35,2,
            1 ,4, 2,4, 4,4, 5,4, 6,4, 3,4,
            1 ,5, 2,5, 4,5, 5,5, 6,5, 3,5,
    };
```
就可以產生出最開始遊戲截圖中的房子(雖然還有些額外資訊要給)。


其實本來想找網路上有沒有相關檢視器，可以幫忙做這件事，但是搜尋好久無果，且[Tiled][]只提供長寬資訊，所以就拿Javascript來打造一個囉！如果有人需要進階改版，請跟Dowen說一下，再開個 [github][] 一起維護 :)

[Tiled]: http://www.mapeditor.org/ "Tiled"
[Box2D]: http://www.mapeditor.org/ "Box2D"
[github]: https://github.com/ "github"