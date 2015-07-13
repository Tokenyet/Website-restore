title: Ubuntu疑難雜症
date: 2015-07-13 10:52:21
categories: [Linux]
tags: Ubuntu
---

前記：
由於在實習的工作中需要用到這個人覺得很難使用的Ubuntu系統
所以遇到了種種的挫折與困難，全部寫在這裡了。


1. 瀏覽器的問題
安裝瀏覽器的時候我使用過Opera,Chrome,Firefox這三種。
1-1. Opera跟Firefox
直接下載能看影片，不過額外裝flash會有較好效果，
在擴充插件上，Opera跟Firefox在Ubuntu的支援度較高，
\*如果要知道如何安裝flash插件請參考1-1-1。
\*安裝firefox參考1-1-2。
1-2.Chrome
不需裝插件即可觀看影片內建flash
但是在某些版本的Ubuntu上不能裝插件，對Ubuntu的支援度較低較低

Opera
推薦度：☆★★★★
Firefox
推薦度：★★★★★
Chrome
推薦度：☆☆★★★

1-1-1.安裝flashplugin
```
sudo apt-get install flashplugin-installer 
```
1-1-2.安裝firefox
```
sudo apt-get update
sudo apt-get --purge --reinstall install firefox
```


2. There is no public key available for the following key IDs
如果遇到以上的問題請重新取得Public Key
```
sudo apt-get install debian-keyring debian-archive-keyring
sudo apt-get install
```

3. 沒有中文輸入法
在遇到沒有中文輸入法的情況，先確認是否有Language Support這個選項。
3-1. 若無則先安裝Language Support。
```
sudo apt-get install language-selector-gnome
sudo gnome-language-selector
```
完成後到Language Support的鍵盤輸入法的地方設定ibus為預設輸入法系統。

3-2. 若已經有Language Support。則只要先暫時清除ibus安裝新酷音後就可以了。
```
sudo apt-get purge ibus
sudo apt-get install ibus-chewing
```
\*在確認一次：語言支援 -> 鍵盤輸入法系統 ibus
重新登入後就可以打中文了。
\*如果是在 SublimeText3 上測試沒顯示是正常的，Sublimetext 目前並不支援中文輸入在Ubuntu上。

4. /etc/apt/Source.list遭更換問題
有時候由於你碰到的電腦是屬於某些廠商客制化過的，
在apt-get這類的指令輸入上想安裝或作任何事情，都會跳出找不到'apt'之類的選項。
這時候就要上網找一個正確的Source.list做更換，或是利用舊的Source.list.old把新的更換掉。
\*sources.list.old這個內容如果很少的話代表就不能用此方式替換

個人是先把權限輸入密碼的部份拿掉後，另外作一個執行檔來作迅速的更換。
（主要是想將source.list換成可update後，如果廠商來看可以把source.list換回原本的，以防問題）
主要的過程如下（不包含拿掉權限密碼的教學部份）
先將sources.list（被廠商搞過的檔案）與sources.list.old(正常的檔案）
分別保存在一個地方，我是放在名為Backup的資料夾裡面。
然後兩個各自分類存到 正常的sources 與 廠商的sources
之後在替換上就可以使用以下的方法


-將正常的sources.list取代原本的萬惡廠商sources.list

```
sudo -s
rm -rf /etc/apt/sources.list
cp /home/自己的電腦名稱/Desktop/SourceList/Backup/正常的sources/sources.list /etc/apt
```
\*使用sources.list.old的人，記得將其改名為sources.list。

-如果廠商來看電腦的話就把sources.list換回它的萬惡檔案
```
sudo -s
rm -rf /etc/apt/sources.list
cp /home/自己的電腦名稱/Desktop/SourceList/Backup/廠商的sources/sources.list /etc/apt
```


5. 找到同個副檔名的檔案並複製到指定資料夾

```
find . -name "*.TIF" -exec cp {} new \;
```
簡單解釋一下
這個意思就是說`find`（找） `-name`（名字是） `"*.TIF"`(副檔名是TIF)的所有檔案，
並 `-exec` 執行 `cp {} new \;`後面的這串是 複製集合 {} 到 new 這個資料夾內。








