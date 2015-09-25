title: Windows10 System記憶體占用
date: 2015-09-25 16:17:23
categories: [Windows]
tags: [Windows10,Win10,System,ntoskrnl.exe]
---
前言:
升級到Windows10之後，真的是一堆BUGGG阿。
認識的人升級到10都跟我說沒什麼問題，只能說相信別人不如自己實測阿。
還有輸入法這糟糕的設置，根本只設計給英文使用者嘛。
大部分升級的人都說「習慣就好」，我真的很不喜歡這句話。
聽過UX嗎?習慣這句話根本就不是UX而是斗M。
如果是因為更值得的功能而改變習慣，那在UX上的確有其道理。
但是Win8後的輸入法又沒什麼特別的取代性，改了習慣壞了體驗，唉。


正題:
最近開始用VS2013有用到WinAPI，然後用了一段時間後，突然電腦趨近於當機???!!
當時我電腦上有Opera，Chrome，Planetside 2，Steam，Line，Telegram，ESET...。
然後以為是WinAPI的問題。
但是研究後發現是 <font color="red">System \(ntoskrnl.exe\)</font> 在搞鬼，這東西在Win10上可說是臭名昭彰，還有人藍白當機。

經由網路上一系列的解法我都嘗試過了，
第一個是Regedit
在HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\Ndu路徑下
將 <font color="red">Start</font> 的值從 <font color="red">2</font> 改為 <font color="red">4</font>
(個人這方法無效)

第二個是設定(Win10我不解的奇怪新產物)
點桌面->個人化->設定->系統->通知與動作
將 <font color="red">顯示關於Windows的通知</font> 關掉!!!
(這方法也沒什麼效果..)

第三個是關閉Superfetch與Prefetch(沒效也可以減少SSD的操勞)
Win+R -> services.msc -> Superfetch disable掉
到HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters
把EnablePrefetcher與EnableSuperfetch改為0

建議可以三個方法都嘗試，如果只嘗試一個無效的話。
