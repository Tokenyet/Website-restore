title: Windows10-音量控制問題
date: 2015-10-08 19:26:20
categories: [Windows]
tags: [Windows10,Win10,音量,Modern UI,Metro App,Windows Store]
---
前言:
Windows 10問題連連，假設你跟Dowen一樣想玩踩地雷，但是從Windows App載完後發現音量超級大聲，且假設說你喜歡聽自己的音樂，又想聽Windows App的特效的時候，就會發現「什麼?**不能調音量!!**」，因為Win10在Modern UI的這些Metro App中沒有加入適當API，所以在音量混合器中沒有這個選項。
因此，繼透明度、Classic Shell...等，為Win10裝插件之旅又開始了。

正題開始:
到[EarTrumpet](https://github.com/File-New-Project/EarTrumpet/releases)的Release中下載最新版本。
如果無法安裝，顯示**This program does not support the version of Windows your computer is running**。
則以下這部分就必須依賴有Visual Studio的人，載下Source Code後，自行編譯出來的.EXE跟.DLL放到一個固定位置。
將.EXE的捷徑放到啟動中，這樣以後就能隨時開機就自動開啟這個軟體了。
這軟體大勝Windows內建的Mixer啊!!!

如果有人有需求，我在附上自己編譯出來的檔案以供使用。
