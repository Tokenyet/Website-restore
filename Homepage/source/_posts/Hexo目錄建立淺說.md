title: Hexo目錄建立淺說
date: 2015-07-10 01:08:26
categories: [網頁相關]
tags: [Hexo分類,Hexo目錄]
---

前言：
由於Dowen是個想完成某項功能就會盡全力去研究的人，雖然建立網站不是我的專長，縱使CSS,Javscript,JQuery只學了半套，而且還不了解什麼node.js還有express，但是憑著一顆堅毅的熱情，總算完成了目錄頁面的建立。
當然目錄建立有很簡單的作法，是直接`hexo new page categories`，但是發現旁邊的widget既然可以自動建立，那為什麼我要自己手動建立呢？

由於上網看了許久，幾乎沒發現有人分享如何從無到有建立起一個自動產生的目錄頁面，除了[feemind](http://wzpan.github.io/hexo-theme-freemind/)有使用到之後，就沒有其他範例了。

那麼就開始說明如何自動建立吧！
在此之前先感謝[freemind作者：Joseph Pan](https://github.com/wzpan)告訴身為初學者的我，該如何找到物件內容的方法(console.log(物件))，否則還真沒有現在的網站。


首先要能用 hexo server 瀏覽自己的網站 <del> （廢話） </del> 

再來必須知道 layout.ejs 基礎的內容在寫些什麼。

接下來再 source 頁面中，產生一個categories的資料夾與一個index.html。
index.html內容是
>title: Categories
>layout: categories

接下來重點來了，在themes/自己的主題/layout/ 中，產生一個categories.ejs。

Hexo就會自動幫你把 index.html 要的內容從 ejs 中印出來。

至於categories.ejs要如何實作呢？
首先先參照自己layout/_partial下的archive.ejs是怎麼實作的。

將那一段他自動為你印出時間與文章的地方記起來後。

然後把全部內容貼到categories.ejs，把你判斷到是印時間與文章的地方刪掉，你就知道那段是你要實作的地方。


真正key part就在這裡，我是參照[freemind的categories.ejs](https://github.com/wzpan/hexo-theme-freemind/blob/master/layout/categories.ejs)的作法，先從site.categories中取得，每一項category名稱，之後藉由site.posts，取得對應的文章標題與連結然後放在每個category之下。


關鍵程式碼如下：

```
<% site.categories.sort('name').each(function(item){ %>
	<h4 class="archive-ul show" data-toggle="collapse" id="<%= item.name %>" data-target="#modal-<%= item.name %>"> 
	<%= item.name %> <b class="caret"></b></h4>
	<ul id="modal-<%= item.name %>" class="collapse in">
		<% site.posts.sort('date', -1).forEach(function(it){ %>
			<% if (it.categories.length == 1 && it.categories.data[0]._id == item._id){ %>
			<li class="listing-item"><a href="<%= config.root %><%= it.path %>" <% if (it.description) { %> title="<%= it.description %>" <% } %>><%= it.title %></a></li>
			<% } %>
		<% }); %>
	</ul>
<% }); %>
```

這段就是能否實作目錄的關鍵了。由於知識不夠的我寫的很亂，想看的話就去我[存網站的地方](https://github.com/Tokenyet/Website-restore/blob/master/Homepage/themes/landscape-custom/layout/categories.ejs)看吧。



