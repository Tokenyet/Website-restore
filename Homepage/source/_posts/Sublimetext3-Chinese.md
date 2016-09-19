title: "Sublimetext 3 中文側欄與黑側欄"
date: 2016-09-12 02:30:37
categories: [Other]
tags: [Sublimetext, 中文亂碼, 側欄, Sidebar]
---
## 文前說明 ##
經過數年，Sublimetext3官方依然沒有對不同解析度中文字體的解決方案，網路上指流傳著一個一定要屈服才可顯示中文的方法`"dpi_scale" : 1.0`，逼著大螢幕的中文程式設計師使用小到極致的字體來用這套完美的軟體。而如今終於有專家提出藥方，接下來就跟著本篇慢慢實裝到自己的環境吧！

### 老方法 ###
首先大家知道的老方法還是提一下，就是**Preferences** -> ** Settings-User** 裡面增加一行文字:

```
{
	"dpi_scale": 1.0
}
```

抱歉，舊方法實在太令我印象深刻了，如果有人因為這行滿意就不用往下看下去。

<!--more-->

### 新方法 ###
根據此議題最新的[Issue報告](https://github.com/SublimeTextIssues/Core/issues/1066#issuecomment-240116281)，[Vova Kolobok](https://github.com/vovkkk)專家提出了一道解方，就是在`Default.sublime-theme`中新增以下文字，左方的側欄字體就會變大。

```
[
    {
        "class": "sidebar_label",
        "font.face": "monospace",
        "font.size": 18
    },
    {
        "class": "tab_label",
        "font.face": "monospace",
        "font.size": 18
    },
    {
        "class": "tool_tip_label_control",
        "font.face": "monospace",
        "font.size": 18
    },
    {
        "class": "quick_panel_label",
        "font.face": "monospace",
        "font.size": 18
    },
    {
        "class": "quick_panel_path_label",
        "font.face": "monospace",
        "font.size": 18
    },
    {
        "class": "quick_panel_score_label",
        "font.face": "monospace",
        "font.size": 18
    },
]
```

Q1. **Default.sublime-theme** 在哪? 
點**Preferences** -> **Browse Packages**可以到**Package資料夾**，點進**User**後，自行新增**Default.sublime-theme**，記住副檔名是**.sublime-theme**，不是**.txt**。

Q2. 你說側邊攔中文字體仍顯示方框?
因為必須搭配老方法，`"dpi_scale" : 1.0`才可以正確的使字體變大。

Q3. 左方中文字體變大後很醜怎麼辦?
接下來介紹最後一個方法將是目前最完美的解決方案。


### 完美解決方案 ###
意外地找到[SODA](http://buymeasoda.github.io/soda-theme/)這個SublimeText3的主題插件，本來只是想將左方側欄也弄成黑底，但意外地[SODA](http://buymeasoda.github.io/soda-theme/)提供了一個Retina的功能，把Mac的解析度方案搬到Sublime插件裡，Dowen稱此插件作者是天才也不為過。

0. 開啟清單(Ctrl + Shift + P)。
1. 使用 Package Control: Install Package 打上**Theme - Soda**。
2. **Preferences** -> ** Settings-User**
3. 新增theme參數，完成後側邊欄位應為黑/白色。
```
{
    "theme": "Soda Dark 3.sublime-theme"
    //"theme": "Soda Light 3.sublime-theme" // If you want light theme
}
```
4. 將老方法**"dpi_scale": 1.0**移除，新方法與本方法步驟都正確的話應該會跟Dowen的Sublimetext長得相似。

{% img "/images/Sub3Ch/editor.png" 420 %}


#### 額外補充 ####
新方法中調整過font.face改成微軟正黑體(Microsoft JhengHei)後字體雖然會變好看，但是使用搜尋欄(Ctrl + F)時，會產生破圖現象。不過字體大小不會影響破圖與否，可以盡情調整。另外，讀者如果有更好的方法，希望可與Dowen分享，謝謝！
