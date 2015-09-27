title: Windows10 桌面圖示排列失效
date: 2015-09-27 12:47:19
categories: [Windows]
tags: [Windows10,Win10,桌面圖示,重新整理,排列失效]
---

升上Win10沒多久後發現桌面圖示無法像以前一樣排列到想要的位置。
每次開機就會回到左方自動排列，右鍵重新整理也是如此。

經由ESET論壇的發布，
升級上Windwos10後，剛好又是ESET的人才會發生的問題。
接下來說明如何解決這問題。
\(引用自ESET forums:AREZCO\)

```
HKEY_CLASSES_ROOT\Wow6432Node\CLSID\{42aedc87-2188-41fd-b9a3-0c966feabec1}\InProcServer32\
HKEY_CLASSES_ROOT\CLSID\{42aedc87-2188-41fd-b9a3-0c966feabec1}\InProcServer32\
```
對於這兩個檔案
選取 預設(Default) 將值從 `%SystemRoot%\SysWow64\shell32.dll` 取代為 `%SystemRoot%\system32\windows.storage.dll`.

但你可能會發生權限不夠的問題。
這時候在做上述動作之前，必須先取得權限。
對`InProcServer32`右鍵按`使用權限` \(Use Permission\)，之後選`進階` \(Advanced\)，
在上方`擁有者` \(Owner\)的位置點選`變更`，之後繼續點選`進階` \(Advanced)，
再來點選`立即選找` \(Find Now\) 選擇`Administrators`後，按下確定。
之後回到剛剛看到擁有者點選變更的視窗中，勾選以下:
`取代子容器與物件的擁有者` \(Replace owner on subcontainers and objects\)
`以可從此物件繼承的權限項目取代所有子物件的權限項目` \(Replace all child object permission entries...\)
最後回到一開始使用權限的視窗，選擇Administrator並勾選`完全控制` \(Full Control\)
就取得該註冊資料夾的權限。


完成後，`重開電腦` \(Reboot\)應該就可以得到改善。





