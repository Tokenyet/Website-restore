title: Ubuntu中使用SublimtText3中文輸入法篇
date: 2015-07-13 15:56:34
categories: [Linux]
tags: [Ubuntu,SublimeText3]
---
前言：
SublimeText在一些不太會操作需要大量指令的人來說，真的是一個跨平台的神物。
在搜尋檔案與查看專案上，真的是各個平台統一操作模式。
不過獨獨只缺不能使用中文輸入法了。
而本篇主要是讓SublimtText3以某種不是很方便的形式來支持中文輸入法。
如果你已經看過其他網路上用Helper的就可以省下時間了。

需求：
SublimeText3 + Package Control已安裝

1.使用 Ctrl+\` 輸入下列程式碼

1. 先從Preferences-> Package Control -> 打Install Package

2. 跳出視窗後找Input Helper安裝

3. 找到後Ctrl+\`，Ctrl+Shift+Z看執行結果
會發現一些錯誤訊息。

4. Preferences-> Browse Package 將 InputHelper.sublime-package 從 Installed Package 剪貼到 Packages 資料夾下解壓縮，重開SublimeText。

5. 查看Packages資料夾內的 lib 或 InputHelper/lib 找到 linux_text_input_gui.py路徑

6. cd到 linux_text_input_gui.py 路徑後，chmod 777 /home/自己的電腦名稱/.config/sublime-text-3/Packages/\[InputHelper/lib\](可能不同)/linux_text_input_gui.py

基本上這樣應該就好了。
如果還有其他錯誤請參照：
[indianazhao](http://indianazhao.blogspot.tw/2014/08/sublime-text-3.html)









