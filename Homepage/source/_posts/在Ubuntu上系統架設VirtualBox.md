title: 在Ubuntu上系統架設VirtualBox
date: 2015-07-17 17:52:26
categories : [Linux]
tags: [VirtualBox,Ubuntu]
---
由於工作的需求越來越多，Ubuntu裝exe程式已經不敷使用。
開始了必須在Ubuntu上裝Windows系統的旅程。
小抱怨一下，越來越多的系統需求，但是處理器也不升級一下。
真的是越來越過份了/o\


正文開始

1. 首先必須到[VirtualBox的官方網站](https://www.virtualbox.org/wiki/Linux_Downloads)找自己適合的安裝檔，我的是*Ubuntu 12.04 LTS ("Precise Pangolin")  i386 |  AMD64*這個版本。

2. cd到指定下載的資料夾(或你放置該檔案的其他位置)

3. `sudo dpkg -i virtualbox-5.0_5.0.0-101573-Ubuntu-precise_amd64.deb(自己的檔案)`

4. 安裝好後，自行安裝想要的任何系統，Dowen是安裝 Windows 7。

5. 假如以上沒有問題，就安裝好了，但是如果你遇上 VirtualBox error: Kernel driver not installed (rc=-1908)，那就請繼續往下看。

6. 其實官方網站有說，為了防止Ubuntu有時後會不相容的問題，必須要安裝dkms所以就要使用以下的指令
```
sudo aptitude update
sudo aptitude install dkms
sudo /etc/init.d/vboxdrv setup
```

7. 這樣應該就沒什麼問題了，希望有幫到像我一樣苦惱的人。
