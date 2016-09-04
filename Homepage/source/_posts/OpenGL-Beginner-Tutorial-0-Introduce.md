title: "OpenGL 藍寶入門教學 0: Introduce"
date: 2016-06-28 21:36:47
categories: [OpenGL]
tags: [OpenGL, OpenGL教學, OpenGL入門教學, OpenGL Tutorial, OpenGL Extension, OpenGL intro]
---
## 前言: ##
不管開始任何事情之前，必須先對要做的事情先有個了解才能開始，學習OpenGL也不例外。開始前，先說一下我做教學文的風格，由於這是我以一個學中教，教中學的角度來製作，所以可能會有些不精確，希望哪裡有錯誤可以幫忙改正或指教，謝謝。


## 簡介: ##
首先OpenGL(Graphics Library)是一個API，也就是說他是一個幫助我們在不同的顯示卡配備之間做一個橋樑。聽起來很籠統，更詳細又簡單的說，即是說每張顯示卡在製作的時候，都有不同數量的繪圖處理器與不同晶片(ex.GTX970 1080)。而你不必擔心到底要如何針對不同顯示卡的規格(Spec)而寫那些控制不同機器的語法就是OpenGL的工作。


## 歷史: ## 
而身為一個OpenGL的使用者也需要知曉一點他的過去與未來，過去OpenGL是源自Silicon Graphics這家公司，當時這家公司專門製作繪圖電腦，又貴又大而且寫繪圖語言的時候，不同的繪圖電腦會有不同的寫法，完全沒有一個統一的規範。經過了一段時間，終於想到解法，就是將針對系統部分的程式碼拿掉後，也就是拿掉只能在規格完全符合才可操作API的部分，之後就開發了OpenGL 1.0版本。這個歷史告訴我們，找出邏輯中相同與不同的部分獨立出來，可以增進事務的美好。

{% img "/images/OpenGL-Beginner-Tutorial-0-Introduce/OpenGL_API.jpg" 420 %}
<!--more-->
## Core-Profile: (核心模型) ##
簡單講完他的歷史與定位後，有一件關於OpenGL核心的事情需要先說，就是在OpenGL 3.0 (2008年)後，分為兩個核心模型，一個稱為Modern版，一個稱為Compatible版。一如字面意思Modern就是現代版本，多了很多Shader,Depth,Stencil,Geometry...的一些新功能，而Compatible就是繼續使用舊的管線(fixed-pipeline)，很難讓使用者客製化。至於為什麼會講核心模型，剛開始就會要使用者講明要使用的哪種核心，才能繼續寫下去，如果說你定義要現代版，但是顯示卡不支援就會馬上知道問題所在。

{% img "/images/OpenGL-Beginner-Tutorial-0-Introduce/OpenGL_Detect.jpg" 420 %}

## Pipelines, Primitives, Pixels: (管線, 繪圖元素, 像素) ##
整個OpenGL大致上的管線的內容分為fixed與shader兩部分，fixed的部分就是我們不可參與程式的部分，而shader的部分是可以加入程式碼深度進行修改的部分。這裡簡單解釋shader，想像這一個shader就是一個超級小的筆刷，然後這個筆刷可以根據螢幕上每一點進行不同的繪製，而為何可以進行不同的繪製呢?因為這個shader就是你可以寫程式的部分，這個一般解釋是著色器，聽起來很難想像的名詞，不知道經過我有點糟的比喻有沒有想像一點。
(哦對，這裡的fixed不是指古早OpenGL，而是說流程中有部分是固定不可參與的)

OpenGL在繪製任何你所指定的東西的時候，都是將它拆解成或千或萬個Primitives之後，才開始進行繪製。而繪圖元素主要有三個，一個是點(point)，到真正實作的時候，你會發現在三維空間中要繪製一個三角形的時候，一定會指派三個點，然後點就是只畫點。另一個是線(line)，只描繪你指定點間的線。還有三角形(triangle)，就是將你指定的點間的像素都畫出來。而介紹繪圖元素的意義就是，當你要畫任何的形狀，臉阿、車子阿、多邊形怪物阿、什麼的都拆成這三個基本繪圖元素，這樣顯示卡只要專心對三角形的繪圖演算法做處理就好了，至於為什麼是三角形除了本身顯卡就只對三角形優化過外，就是Convex(凸邊形)的演算法比Concave(凹邊形)的容易許多。

其實剛剛講了很多，並不是真正的繪製，只是屬於形狀的分割最佳化，到後面經過你一連串的shader與一些fixed後最終才會經過一個名為rasterizer的傢伙進行著色(真正開始動像素的地方)，中文叫光柵化，簡單想像就是一個幫你將3D的東西繪製到2D上的步驟。


## Extension ##
這個算是新版OpenGL的一個利於內部人員的極佳擴充機制，而這些擴充機制雖然利用開發人員，不過當我們想要使用的時候卻是長得像下面這般模樣。
```
const char *name = "glGenBuffers";
void *p = (void *)wglGetProcAddress(name);
if(p == 0 ||
(p == (void*)0x1) || (p == (void*)0x2) || (p == (void*)0x3) ||
(p == (void*)-1) )
{
	HMODULE module = LoadLibraryA("opengl32.dll");
	p = (void *)GetProcAddress(module, name);
}
```
寫了8行Code只為了取得一個function在顯示卡內部的哪個位置，然後拿出來提供我們使用，看到這裡不需要害怕，[下篇](/2016/07/05/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment)文章會提到如何使用第三發開發的framework幫助我們解決這些問題。

## 小結: ##
如果聽不懂管線或是對pipelines感到陌生，就當作是一個產品生產的流程圖，先做好車體結構->再安裝車殼->再安裝輪胎，這樣的一個流程稱為pipeline。
其實本來多弄點圖解，不過實在是有點累(懶)呀，如果有需要的話，我再努力做給大家看。