title: Ubuntu上安裝Line
date: 2015-07-13 15:34:13
categories: [Linux]
tags: [Ubuntu,Line]
---
由於工作需要安裝Line的關係。
但是沒有筆記型電腦，又不想用Teamviewer連回家中使用Line。
那麼在申請了一個工作的Line之後，開始的繁瑣中作就來了！
（不會雙帳號的上網參考一下吧，很簡單的，但你要能裝Bluestacks，我是Teamviewer回家使用這些操作）

--
由於有環境疑慮
所以奉上自己版本很低的環境
Ubuntu 12.4.10
--

1. 首先如果你是跟我一樣64bit ubuntu的同伴們就必須先作一些前置動作，如果你是32bit的請直接看第3點。

2. 64bit的同伴們必須先安裝libx11-dev:i386 and libfreetype6-dev:i386這兩個套件。
安裝方式如下：
```
sudo apt-get install libx11-dev:i386
sudo apt-get install libfreetype6-dev:i386
```

3. 再來安裝wine最新版即可。（如果有任何疑難雜症請看[Ubuntu疑難雜症](Ubuntu疑難雜症)）
```
sudo add-apt-repository ppa:ubuntu-wine/ppa
sudo apt-get update
sudo apt-get install wine1.7
```

4. 安裝三個套件3.\[dotnet20\],\[msxml6\],\[vcrun2008\]

4-1.使用環境參數（這段設好環境參數可自行開tools安裝,這僅有指令版）
```
configure WINEARCH=win32 WINEPREFIX=~/.wine32
winetricks dotnet20
winetricks msxml6
winetricks vcrun2008
```

4-2.整合一鍵執行版
```
env WINEARCH=win32 WINEPREFIX=~/.wine32 winetricks dotnet20
env WINEARCH=win32 WINEPREFIX=~/.wine32 winetricks msxml6
env WINEARCH=win32 WINEPREFIX=~/.wine32 winetricks vcrun2008
```

5. 直接到官方網站下載Line

6. wine LineInst.exe (cd到該資料夾後執行）

7. 安裝好後應該就能享受在Ubuntu上使用Line的環境了。


