title: "OpenGL Beginner Tutorial 2: Strat With Triangle"
date: 2016-07-10 23:47:49
categories: [OpenGL]
tags: [OpenGL,OpenGL教學,OpenGL Tutorial]
---
## 開始前介紹 ##
本系列文將使用*OpenGL 4.5*版本，並且以作者能理解的方式進行教學，如有細節那裡誤解或是講錯的部分，或是跳太快應該先講什麼後講什麼的地方，請不吝多多指教！謝謝！

## 從點開始 ##
要畫一個三角形之前，總要會在畫面上繪出一個點來，在那之前，由於使用的是Modern版的OpenGL，所以凡事都要要求的有兩個東西，其中一個是*「Vertex Array Object」*，簡稱*VAO*，另一個則是Shader，其中包含基礎的兩個稱為Vertex Shader與Fragment Shader。

* Shader: 其實並不只有Vertex Shader與Fragment Shader，還有Geomerty Shader、Tessellation Control Shader、Tessellation Evaluation Shader，由於屬於初階文章，所以其他的暫不探討。而Shader其中必寫的其實只有Fragment就好，本文不討論這部分。

首先在了解繪一個點需要看起來很多的東西時，會認為很繁瑣。當深入一點後，將了解僅是一連串常用的手續，以後只要複製貼上加修改。而這裡就先示意部分的OpenGL pipeline，也就是讀者目前為止會碰到的pipeline，倘若一次列出全部流程，會猶豫一陣子。
{% img "/images/OBT2/opengl_easy_pipeline.png" 600 %}
上方的流程是說明，使用者可以*以某種方式*將一些資料傳給Vertex Shader，本文章目前不會先做傳資料的動作，先給一個小概念。 而傳完之後Vertex Shader仍會以*某種方式*將資料傳給流程中的下一個Shader，就是Fragment Shader，最後Fragment Shader 跑完之後會將圖片輸出到螢幕上。

理解到OpenGL流程的基礎後，接下來就是從實作中學習，如果沒有環境的讀者可以參考[上篇](/2016/07/05/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment)中的Code來建立基礎環境。

### 為OpenGL搭起一個Shader的介面 ###
``` cpp
GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
glCompileShader(vertexShader);
glCompileShader(fragmentShader);
```
「數字代表物件，物件管理是OpenGL的事」，這裡必須先提到，OpenGL在實作上由於需符合C/C++，所以物件管理的方式是給我們從Create Function中抽一個序號，然後那個序號就是你的物件編號，有這物件編號後，我們必須*妥善保存*，然後在任何需要的時候可以跟OpenGL說要設定/刪除，先來解釋一下上面的例子就會明白。
首先我們準備了抽序號的物件`vertexShader`然後向`glCreateShader`要求一些東西，而這裡是要求Vertex Shader的命令。之後要設定這個`vertexShader`物件的各種屬性，當然我們看不到是什麼屬性，而是透過將編號(vertexShader)傳給`glShaderSource`進行設定，這裡的設定是將shader的程式碼傳過去設定，不要想傳程式碼很奇怪，因為Shader就是一個給我們程式設計的地方。

_void glShaderSource(GLuint shader, GLsizei count, const GLchar **string, const GLint *length);_
* 第一個參數指要用哪個Shader物件。
* 第二個是Source Code的String指標跟length指標的個數。
* 第三個是程式碼整體的雙重指標。
* 第四個是你每一個指標所包含的字串長度應該讀取多少，使用NULL代表就是不指定，讀取到NULL為止。

### Shader編譯後變成 Shader Program ###
``` cpp
GLuint program = glCreateProgram();
glAttachShader(program, vertexShader);
glAttachShader(program, fragmentShader);
glLinkProgram(program);
...
// in loop before you want to draw something
glUseProgram(program)
```
同樣是設定，這裡將剛剛產生的Shader設定在`program`裡面，接下來的`glLinkProgram`代表準備好各種Shader後的Compile，就是不給更改了，也就變成一個程式。然後在需要繪製前在使用簡單的`glUseProgram`就可以在你繪製前，套用要使用的Shader Program。

### Shader 的程式碼 ###
``` cpp
const GLchar *vertexShaderSource =
	"#version 450 core\n"
	"\n"
	"void main(void)\n"
	"{\n"
	"	gl_Position = vec4(0.0, 1.0, 0.5, 1.0);\n"
	"}\n";
const GLchar *fragmentShaderSource =
	"#version 450 core\n"
	"\n"
	"out vec4 color;\n"
	"\n"
	"void main(void)\n"
	"{\n"
	"	color = vec4(0.0, 0.0, 1.0, 1.0);\n"
	"}\n";
```
`vertexShaderSource`跟`fragmentShaderSource`是程式碼，就像寫程式一下要先有Code才能用IDE編譯，而這裡就是Code到時候會丟給OpenGL編譯成一個program如之前的範例，這裡是解釋該如何簡單撰寫一個Shader，根據官方所述，主要是由C下去變形，所以在C的基礎中能做，基本上都可以使用，而一個良好的Shader Code需要標明版本 `#version 450 core` 與進入點 `main` 。 有了之後以上就是最基礎的shader, `gl_Position` 代表的是以NDC空間中的位置，NDC空間簡單解釋就是說到Vertex Shader 這段，未來要做的是將三維空間轉換成NDC空間，未來講MVP矩陣的時候會提到，這裡只要想成Z指向螢幕外,Y是數學所學的上方,X是右方即可，超過1.0跟-1.0會超出螢幕範圍這樣。

### Vertex Array Object ###
``` cpp
GLuint vertexArrayObject;
glCreateVertexArrays(1, &vertexArrayObject);
```
VAO設定到Shader作為Input本篇先不做說明，但必要讓讀者知道的是，OpenGL一定要在有VAO的狀況下才能進行繪製，縱使你產生出來是空的也好。像是下面這樣。
``` cpp
glUseProgram(program);
//shader.UseProgram();
glBindVertexArray(vertexArrayObject);
glDrawArrays(GL_POINTS, 0, 1);
glBindVertexArray(0);
```
使用Shader Program然後綁定輸入點(VAO)，VAO的概念算是當你有Shader Program後，`glBindVertexArray`綁定的VAO就會在`glDrawArrays`的時候被傳進Shader。

_void glDrawArrays(GLenum mode, GLint first, GLsizei count)_
* 第一個代表以何種Primitive(種類)畫你所提供的材料(VAO)。
* 第二個是VAO的起始索引，以後將資料傳給Shader時，會定義格式才有索引。
* 第三個是指定要畫的VAO索引數量。

完成以上的建置後就會長得像以下的的圖。
{% img "/images/OBT2/nothingresult.png" 420 %}

什麼?你看不出來? 在Loop中加上`glPointSize(40.0f);`吧！
{% img "/images/OBT2/goodresult.png" 420 %}
將要繪製的一個像素放大四十倍後繪製，終於可以看出來了，至於原理如何，由於是在光柵化的時候做的，內建的地方就不去探討。

### Shader大整形 ###
既然已經嘗試完畢我們就來正式開始，將Shader那一大坨的東西改成從檔案裏面讀取，再加上除錯處理，新增一個Class吧！
[Shader](https://github.com/Tokenyet/OpenGL_Basic_Tutorial/blob/master/OpenGL_Basic_Tutorial%20-%201/Shader.cpp) Class的程式碼在這裡可以參考，由於程式碼主要的地方沒變，只有架構改變，就不討論OO的地方。

有了之後就可以將之前的Shader程式碼通通砍掉然後創建一個Shader Class來幫助我們輕鬆建立一個Shader Program，還有Debug的功能！之後只要將程式碼改成下方這樣就可以輕鬆使用。
``` cpp
Shader shader("shader/basic.vert", "shader/basic.frag");
...
shader.UseProgram(); // in loop
```
至於那兩個檔案其實並不一定要叫`xxx.vert`或`xxx.frag`，不過在OpenGL的開發者中，大部分都這樣命名，而且有Highlight的插件，所以讀者可以考慮習慣看看。
這是[basic.vert](https://github.com/Tokenyet/OpenGL_Basic_Tutorial/blob/master/OpenGL_Basic_Tutorial%20-%201/shader/basic.vert)跟[basic.frag](https://github.com/Tokenyet/OpenGL_Basic_Tutorial/blob/master/OpenGL_Basic_Tutorial%20-%201/shader/basic.frag)的程式碼。

接下來，正式要畫一個三角形，不過我們先用不正式的畫法，到下篇文章再慢慢推進Shader(GPU)與CPU的互動。

將 basic.vert 修改成以下。

``` cpp
#version 450 core

void main(void)
{
	const vec4 vertices[3] = vec4[3](vec4(0.25,-0.25,0.5,1.0),
					vec4(-0.25,-0.25,0.5,1.0),
					vec4(0.25,0.25,0.5,1.0));
	gl_Position = vertices[gl_VertexID];
}
```

裡面內建的vecX是OpenGL提供你的一個型態，就是所謂的向量，這在shader中這語法稱為glsl，很容易進行數學矩陣與向量的相乘。此外這裡有個新的東西是`gl_VertexID`，這個ID指的是，你在外面繪製命令的時候，是繪製第幾個Vertex的編號。

``` cpp
shader.UseProgram();
glBindVertexArray(vertexArrayObject);
glDrawArrays(GL_TRIANGLES, 0, 3);
glBindVertexArray(0);
```
將loop內改成繪製三角形後，後面改成3個點，當然VAO是空的，只是強迫根據Shader的內容畫三次，每次`gl_VertexID`會根據繪製的索引而不同。

接下來畫面應該會長這樣子。
{% img "/images/OBT2/finalresult.png" 420 %}

附上最後的[Code](https://github.com/Tokenyet/OpenGL_Basic_Tutorial/blob/master/OpenGL_Basic_Tutorial%20-%201/main.cpp)。

小結:
在寫的時候，不知道怎樣算清楚怎樣不清楚，這並不是我最初的學習，有學過一段時間，現在是搭配看原文書加上自己的經驗與網路的參考來撰寫文章，滿擔心只是寫出一堆沒人看得懂的東西 :(