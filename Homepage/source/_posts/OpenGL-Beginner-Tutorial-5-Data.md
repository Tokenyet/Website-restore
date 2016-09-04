title: "OpenGL 藍寶入門教學 5: 資料型態"
date: 2016-08-25 16:30:29
categories: [OpenGL]
tags: [OpenGL, OpenGL教學, OpenGL入門教學, OpenGL Tutorial, OpenGL Extension, OpenGL intro]
---
## 開始前介紹 ###
本篇將會大略的提及OpenGL中Buffer,Unifrom還有一點點Shader Storage Block的部分，而關於Atomic或同步問題，就先略過。如果對Shader中GPU與CPU不熟，可能會對本篇閱讀有礙。畢竟藍寶書竟然將Shader的部分放在後頭，Shader連結部分都還不熟，就先切入細節Buffer,Uniform的部分。

<!--more-->
## Buffer ##
對於Buffer的使用第三篇與第二篇，足夠初學者使用，因此這部分將章節所使用到的Buffer函式列出來逐步講解。
* `glCreateBuffers(GLsizei n, GLuint* buffer)` : 與OpenGL要buffer的編號，與glGenBuffers功能相同。
* `glBindBuffer(GLenum target, GLuint buffer)` : 將某編號buffer綁訂在要求的target容器上。
* `glBufferStorage(GLenum target, GLsizeiptr size, const void* data, GLbitfield flags)` : 將指定容器的空間與資料填入,並告訴OpenGL後續用途，這樣才會配置最佳存取空間。
* `glNameBufferStorage(GLuint buffer, GLsizeiptr size, const void* data, GLbitfield flags)` : 與 `glBufferStorage`相同，只是指定的是buffer編號。
* `glBufferSubData(GLenum target, GLintptr offset, GLsizeptr size, const GLvoid* data)` : 根據offset與size的定義，將資料放在指定記憶體位置處。
* `glNameBufferSubData(GLuint buffer, GLintptr offset, GLsizeptr size, const GLvoid* data)` : 同`glBufferSubData`。
* `glMapBuffer(GLenum target, GLenum usage)` : 從指定容器取出Pointer，可直接進行記憶體配置，不須像`glBufferStorage`或`glBufferData`需要多一個copy。
* `glMapNamedBuffer(GLuint buffer, GLenum usage)` : 同`glMapBuffer(GLenum target, GLenum usage)`。
* `glMapBufferRange(GLenum target, GLintptr offset, GLsizeiptr length, GLenum usage)` : 指定要修改的記憶體區域，回傳Pointer可直接進行記憶體配置 。
* `glMapNamedBufferRange(GLuint buffer, GLintptr offset, GLsizeiptr length, GLenum usage)` : 同`glMapBufferRange`。
* `glClearBufferSubData(GLenum target, GLenum internalformat, GLintptr offset, GLsizeiptr size, GLenum format, GLenum type, const void* data)` : 用來清除buffer特定區域的值，然後可用data取代。
* `glClearNamedBufferSubData(GLuint buffer, GLenum internalformat, GLintptr offset, GLsizeiptr size, GLenum format, GLenum type, const void* data)` : 同`glClearBufferSubData`。
* `glCopyBufferSubData(GLenum readtarget, GLenum writetarget, GLintptr readoffset, GLintptr writeoffset, GLsizeiptr size)` : 將Buffer資料複製到指定Buffer中。
* `glCopyNamedBufferSubData(GLenum readtarget, GLenum writetarget, GLintptr readoffset, GLintptr writeoffset, GLsizeiptr size)` : 同`glCopyBufferSubData`。
* `glVertexArrayAttribBinding(GLuint vaobj, GLuint attribindex, GLuint bindingindex)` : 從binding區域中取出buffer，之後對應到vao使用的shader中的位置。
* `glVertexArrayVertexBuffer(GLuint vaobj, GLuint bindingindex, GLuint buffer, GLintptr offset, GLsizei stride)` : 將buffer的指定記憶體區域綁定到binding區域。

{% blockquote %}
####Binding區域####
Binding區域是一個OpenGL定義的一個待綁區，可以想像成一串陣列，可根據指定vbo buffer或是簡稱buffer，將有資料的buffer放到指定綁定索引後，不同的vao即可以方便使用同個buffer。
{% endblockquote %}

* `glVertexArrayAttribFormat(GLuint vaobj, GLuint attribindex, GLuint size, GLenum type, GLboolean normalized, GLuint relativeoffset)` : 定義第幾個location讀取buffer資料時，要以什麼方式進行讀取，如同第三篇所用到的`glVertexAttribPointer`。
* `glEnableVertexArrayAttrib(GLuint vao, GLuint index )` : 啟動第幾個位置，不啟動Vertex Shader無法接收。
* `glDisableVertexArrayAttrib(GLuint vao, GLuint index )` : 關閉VS的接收。


## Uniforms ##
Unifrom與VertexAttribute的差別對初學者來說應該差異不大，因為都能夠傳送資料進入Shader。不過這裡可以先給一個概念，VertexAttribute強調的是Vertex，也就是根據每個頂點，而有所變動。而Unifrom的中文意思是制式，不變的，利用Unifrom通常只會在一個繪製才能變動一次值，畢竟跑Shader的時候，Uniform的值已經進入GPU。

而Unifrom有兩種形式，一種稱為**Default Block Uniforms**，另一種稱為** Uniform Block**。


### Default Block Unifroms ###
Uniform的使用，最傳統的方式如下:

``` glsl
uniform float time;
uniform int selection;
uniform vec4 backgroundColor;
uniform mat4 mvp;
```

而進階一點可以定義每個uniform的位置，如果沒定義，如上方的形式，就會預設自動配一個，因此通常沒必要定義。

``` glsl
layout (location = 87) uniform vec4 specificStuff;
```

而如果沒有定義location的一般用法，要傳值的話需要使用`glGetUnifromLocation(program, name)`，傳入編譯好的program與想要傳值的變數名稱，就可以取得其location。

#### 實際情形模擬 ####
假設實際位置如下:

``` glsl
layout (location = 0) uniform float time;
layout (location = 1) uniform int selection;
layout (location = 2) uniform vec4 backgroundColor;
layout (location = 3) uniform mat4 mvp;
```

那麼再傳值的時候就要用適當的`glUnifromXY`，X代表數字Y代表型態，如下:

``` cpp
glUseProgram(program);
glUniform1f(0, (GLfloat)systemTime);
glUniform1i(1, 2);
glUniform4f(2, 1.0f, 0.0f, 1.0f, 0.0f, 1.0f);
glUniformMatrix4fv(3, 1, GL_FALSE, glm::value_ptr(mvp));
```

### Uniform Blocks ###
有時候不同Shader會傳入相同的值(如光影中幾乎需要攝影機的位置)，這時候Uniform Block就派上用場了，在OpenGL程式中，定義一個**Uniform Buffer Object**，然後傳入每個需要用到此Uniform的Shader中，直接從記憶體傳入GPU就可以免去每個Shader程式都需要用`glUniform`來傳遞。

``` glsl
layout (location = 0) in vec4 position;
layout(std140) uniform CommonParameter
{
	int invisible;
	float time;
	float strange[3];
	vec3 camera;
	mat4 mvp;
	int another;
} common;

void main()
{
	... // some shader code
}
```

上面就是Unifrom Block最常用的方式，而`std140`代表的是標準格式，代表每個型態的格式大小規範。而定義的模式是，一筆資料的邊界必須是16 bytes對齊，float代表16 bytes，vec1~2代表8 bytes, vec3~4代表16 bytes，mat則是4個16byte。概念如下:

``` glsl
layout(std140) uniform CommonParameter
{
                          //base_aligment-aligment_offset
	int invisible;        //  4-0
	float time;           // 16-16
	float strange[3];     // 16-32
	                      // 16-48
	                      // 16-64
	vec3 camera;          // 16-80
	mat4 mvp;             // 16-96
	                      // 16-112
	                      // 16-128
	                      // 16-144
	int another;          //  4-160
} common;
```

#### 初始化UBO ####
``` cpp
GLuint ubo;
glGenBuffers(1, &ubo);
glBindBuffer(GL_UNIFORM_BUFFER, ubo);
glBufferData(GL_UNIFORM_BUFFER, 160, NULL, GL_STATIC_DRAW);
glBindBuffer(GL_UNIFORM_BUFFER, 0);
glBindBufferBase(GL_UNIFORM_BUFFER, 0, ubo); // binding point to 0
```

#### 填入內容 ####
通常會在loop的階段使用，除非永遠是Const，那`glBufferSubData`就可以在迴圈外使用。
``` cpp
GLuint invisible = getInvis();
GLfloat time = geTime();
glm::mat4 mvp = getMvp();
GLfloat strange[3] = getSomeStrange();
glm::vec3 cameraPos = getCamPos();
GLuint another = getValue();
glBindBuffer(GL_UNIFORM_BUFFER, ubo);
int offset = 0;
glBufferSubData(GL_UNIFORM_BUFFER, offset, sizeof(GLuint), glm::value_ptr(invisible));
offset += sizeof(GLuint);
glBufferSubData(GL_UNIFORM_BUFFER, offset, sizeof(GLfloat), glm::value_ptr(time));
offset += sizeof(GLfloat);
glBufferSubData(GL_UNIFORM_BUFFER, offset, 3 * sizeof(GLfloat), glm::value_ptr(strange));
offset += 3 * sizeof(GLfloat);
glBufferSubData(GL_UNIFORM_BUFFER, offset, sizeof(glm::vec3), glm::value_ptr(cameraPos));
offset += sizeof(glm::vec3);
glBufferSubData(GL_UNIFORM_BUFFER, offset, sizeof(glm::mat4), glm::value_ptr(mvp));
offset += sizeof(glm::mat4);
glBufferSubData(GL_UNIFORM_BUFFER, offset, sizeof(GLuint), glm::value_ptr(another));
glBindBuffer(GL_UNIFORM_BUFFER, 0);  
```

#### Shader綁定UBO ####
這段不用再迴圈內，事先定義好要取得的BindingPoint，Buffer不管怎麼變，Shader都取的到。

``` cpp
GLuint shaderUsedUBO1 = glGetUnifromBlockLocationIndex(program1, "CommonParameter");
GLuint shaderUsedUBO2 = glGetUnifromBlockLocationIndex(program2, "CommonParameter");
GLuint shaderUsedUBO2 = glGetUnifromBlockLocationIndex(program3, "CommonParameter");

glGetUnifromBlockBinding(program1, shaderUsedUBO1, 0);
glGetUnifromBlockBinding(program2, shaderUsedUBO2, 0);
glGetUnifromBlockBinding(program3, shaderUsedUBO3, 0);
```

## Shader Storage Block ##
與UBO很相似，但不同的地方在於這裡可以讓Shader進行修改裡面的內容，而且這會影響到OpenGL程式端的Buffer內容。定義如下:

``` glsl
layout (binding=0, std430) buffer stblock
{
    vec4 data;
    int test;
    vec3 color;
}
```
主要是把uniform改為buffer，而這裡的`std430`代表一個更嚴格的格式，在此不多做說明，用`std140`即可。


## 其他 ##
Shader Storage Block還有一個Atomic的應用，主要關於平行處理中的一些細節問題。還有一個特別的Atomic Counter是一些進階技巧，Dowen也未曾碰過。

## 小結 ##
在書中的第五章剩餘還有Texture的部分，是有關於材質貼圖的部分，算是一個極為重要的一Part，但是需要介紹到一個新的圖片載入函式庫，可能會使篇幅變得如同第四篇一樣巨大，因此本篇就先到此結尾。