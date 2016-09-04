title: "OpenGL 藍寶入門教學 1: Setting up Environment"
date: 2016-07-05 19:14:47
categories: [OpenGL]
tags: [OpenGL, OpenGL教學, OpenGL入門教學, OpenGL Tutorial, GLFW, GLEW, OpenGL安裝, Visual Studio]
---
## 環境準備 ##
開始之前還是要先講一下，讀者可以選擇各種不同的 Framework 與 Library ，像是SDL,FREEGLUT,GLFW之類的，不過不管選擇哪一種，主要的OpenGL流程都是一樣的，只是有些不同的Code或Lib必須要在官方網站自行去看，本篇要講的是GLFW+GLEW在Visual Stuido 2015中的環境建置，如果不是來建置環境的讀者可以跳過本篇，或是對GLFW與GLEW有興趣再往下閱讀。

## GLFW ##
[GLFW](http://www.glfw.org/)主要是將在不同平台( Linux, Windows, Mac ) 間常用的一些使用者需求給獨立出來，這些使用者需求像是Keyboard的資訊、Mouse資訊、視窗建置....等等。將這些不同的使用者需求都統整成一個API就是其中一個GLFW在做的事，此外另一個工作是將OpenGL繪製的東西從buffer顯示到螢幕上的工作，還有一些零零總總的細節操作，最重要的是用了GLFW其實已包含OpenGL的Header，當建置好後，直接可以撰寫OpenGL的Code。


首先先到[GLFW官方下載](http://www.glfw.org/download.html)中找一個名為「32-bit Windows binaries」的元件 ( 注意! 64-bit Windows binaries的建議不要使用，Dowen我在建置的時候會遇到非常多問題)，抓下來後接下來就照著以下的圖片設置。

將GLFW放到任何認為合適的地方，之後再點選VS的專案->屬性，再點選VC++目錄，然後我們主要要變動的有以下兩個，Include目錄與程式庫目錄。
{% img "/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/VSProperty.png" 600 %}
設定好Include與Library。
<!--more-->
{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/glfw_include.png" style="width: 420px">
	</div>
	<div class="container-inside-div">
		<img src="/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/glfw_lib.png" style="width: 420px">
	</div>
</div>
{% endraw %}

再來到連結器(Linker) -> 輸入(Input) 去增加lib檔，要新增的有`opengl32`與`glfw3.lib`。
{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/input.png" style="width: 420px">
	</div>
	<div class="container-inside-div">
		<img src="/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/glfw_input_lib.png" style="width: 350px">
	</div>
</div>
{% endraw %}



## GLEW ##
[GLEW](http://glew.sourceforge.net/)提供了Modern OpenGL中的各種函式，如果沒有使用GLEW或其他函式庫的人，在撰寫Modern OpenGL的時候就要寫類似這樣的Code。
``` cpp
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
在這邊取得的p代表的就是glGenBuffers的function，這段在寫Code上很常使用，Modern OpenGL使用了這樣的機制的優點是利於任何時候或是任何廠商在自己的顯卡驅動中加入新的function，缺點是我們在寫的時候就要每次去向記憶體提取function。所幸GLEW幫我們解決了這樣的問題，讓我們在使用最新的OpenGL時，免去不斷向記憶體取得新函式的手續。

在設定上就像GLFW一樣，要設定三個地方。
{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/glew_include.png" style="width: 420px">
	</div>
	<div class="container-inside-div">
		<img src="/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/glew_lib.png" style="width: 420px">
	</div>
</div>
{% endraw %}

{% img "/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/glew_input.png" 420 %}


這樣一切的環境就準備好了。


## 基礎視窗環境建置 ##
先將[基礎的程式碼](https://github.com/Tokenyet/OpenGL_Basic_Tutorial/blob/master/OpenGL_Basic_Tutorial/main.cpp)貼到自己的環境中，直接測試看看，完成沒問題後，以下將一步一步講解每一Part。


``` cpp
// GLEW ( help you using functions without retreiving functions )
#define GLEW_STATIC
#include <GL\glew.h>
// GLFW ( make you a windows that support opengl operation to work fine with your platform )
#include <GLFW\glfw3.h>
```
這裡的GLEW_STATIC剛好對應之前的libaray `glew32s.lib`，之所以要用STATIC是因為這樣直接省去需要額外加入dll的部分，dll的部分GLEW把它分開到bin的資料夾內，當然如果讀者想使用動態的方式也無不可。
* Static Linking: 優點是將整個資訊全部塞進自己的binary檔。
* Dynamic Linking: 優點是binary小，檔案各自分開乾淨。


``` cpp
// Init and Check GLFW working properly
int glfwInitCheck = glfwInit();
if (glfwInitCheck == GLFW_FALSE)
{
	std::cout << "glfw initilization failed." << std::endl;
	return -1;
}
```
這裡確定你glfw是否能夠初始化正確。


``` cpp
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
GLFWwindow* window = glfwCreateWindow(640, 480, "OpenGL Tutorial", NULL, NULL);
if (window == nullptr) // window creation failed
{
	return -1;
}
glfwMakeContextCurrent(window); 
```

`glfwWindowHint`代表的是對`glfwCreateWindow`所創造出的視窗來做事前設定，而`GLFW_OPENGL_PROFILE`設定成`GLFW_OPENGL_CORE_PROFILE`的意義是，如果我們在使用到OpenGL的function中有用到一些3.3版本之前而且新OpenGL不支援的語法的時候，就會強制跳出錯誤，這樣可以避免誤用一些過時的function。


``` cpp
// Set GLFW callback functions
glfwSetErrorCallback(error_callback);
glfwSetKeyCallback(window, key_callback);

// Get error from GLFW for debuging
void error_callback(int error, const char* description);
// Get keywords from GLFW windows
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods);
```
這邊結尾為`callback`的就是我們偵測這些使用者事件的時候會觸發的function，這裡用到的技巧當然就是callback，就是將你寫的function丟進去，然後當事件觸發的時候就通知你這個function做事，然後這些可以callback的function定義都是要自行去GLFW的document查詢，像是這裡用的就是錯誤回饋`glfwSetErrorCallback`跟針對視窗的keyboard回饋`glfwSetKeyCallback`。



``` cpp
// According to source code, this make you to access successfully full extension from some latest driver without error.
glewExperimental = GL_TRUE;
// Initialize GLEW to setup the OpenGL Function pointers
if (glewInit() != GLEW_OK)
{
	std::cout << "Failed to initialize GLEW" << std::endl;
	return -1;
}
```
開始調用GLEW的初始化，這樣你才可以使用一些modern的function，此外如果不成功仍然會報錯，不過GLEW在剛開始還沒用到任何modern的時候，譬如本篇文章，你還不會有任何感受。對了這邊有個值得注意的是`glewExperimental`設定為`GL_TRUE`所代表的是，除了他內建定義的那些extension之外，你仍然可以使用上方提過的那個冗長語法，來取得最新的extension function，因為GLEW並不一定會更新的如此及時，所以這個打開來就是解開一些限制。


``` cpp
// Define the viewport dimensions (if you will change the winodw size, put these in loop)
int width, height;
glfwGetFramebufferSize(window, &width, &height);
glViewport(0, 0, width, height);
```
`glfwGetFramebufferSize`是用來取得視窗的長寬，當然寫在loop前面的意思是說，我定義的長寬並不會Resize，所以不需要放在loop中，而`glViewport`則是輸出至螢幕的設定，就是將你的畫面輸出到螢幕的時候，應該乘上多少的倍率，因為畫面輸出前都會保持長寬都是1.0的一張1.0x1.0的小圖，而輸出時的倍率與起始位置就是從(0,0)然後長為width，寬為height，然後裡面在算出倍率，之後圖片再輸出的時候就會自動從起始點然後以算出的倍率做縮放，之後顯示在視窗中，當然如果你定義的不符合你的視窗大小，就會有畫過多或過少的問題。


``` cpp
// Looping Here until user trigger closing window event.
while (!glfwWindowShouldClose(window))
{
	// Clear the colorbuffer
	glClearColor(0.5f, 0.5f, 0.3f, 1.0f);
	glClear(GL_COLOR_BUFFER_BIT);

	glfwSwapBuffers(window); // show on windows
	glfwPollEvents(); // check any event(ex. mousedown, keyup...)
}
```
`glfwWindowShouldClose`則是偵測視窗是否收到觸發關閉視窗事件的function，像是使用者點擊右上角的X或是按下esc之類的，而`glClearColor`代表每次清除視窗的時候要用什麼樣的顏色，這裡像是Unity一般畫面有個藍綠色一樣，或是你玩遊戲掉入虛空是黑色那樣都是這個顏色，而`GL_COLOR_BUFFER_BIT`是顯示到螢幕前的那個buffer，如果不清除就會顯示上個frame(畫面)的顏色。`glfwSwapBuffers`則是將buffer顯示到螢幕上。`glfwPollEvents`則是主動去詢問滑鼠事件或鍵盤事件之類的使用者事件，其實有另一個函式是Wait用的，不過那樣是要等你有動作才會執行，不符合一直刷新螢幕的loop
，所以幾乎沒人用它。


``` cpp
glfwDestroyWindow(window);
glfwTerminate();
```
而最後的就是glfw不使用的釋放資源方式，通常不需要特別注意這個部分，就跟init一樣，會建置就好。

最後的結果如下圖:
{% img "/images/OpenGL-Beginner-Tutorial-1-Setting_Up_Enviroment/result.png" 420 %}