title: Ubuntu Tracker-Store問題
date: 2015-08-17 11:28:14
categories: [Linux]
tags: [Ubuntu,tracker-store,Ubuntu property]
---
在升級到14版後
安裝了Gnome一段時間又灌了零零總總的東西之後...

有一次右鍵->檔案->屬性的時候
竟然桌面當了!? 有關於檔案系統的任何東西都開不起來。

在使用System monitor觀察後，發現是tracker-store在做怪
是安裝gnome之後自動開啟建立索引的程式

但由於在本系統中已經成為多餘的障礙，所以決定把他拿掉。
上網找東找西之後，其實只有一句話就解決問題了！
到終端機輸入
```
tracker-control -r
```

## 解決 !
