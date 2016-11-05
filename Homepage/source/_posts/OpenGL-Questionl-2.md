title: "OpenGL之沒有蠢問題 2 - BindAttribute"
date: 2016-09-24 15:26:28
categories: [OpenGL]
tags: [OpenGL問題, glVertexAttribPointer, glVertexAttribPointer fails]
---
## 閒談 ##
最近Dowen正在將模組動畫引入到遊戲引擎中，期間遇到的一個超級隱藏Bug就是`glBindAttribLocation`。引入模組動畫最重要的就是傳入該頂點會使用到的**骨架索引**與**骨架權重**，而Dowen這次綁定的位置，離原本定義的Position、Normal、TexCoord稍微遠一點，大概是5、6的位置，所以才發現到原本綁定的方式是錯的。總之，要說的是Shader發生錯誤真的是一丁點資訊都沒有啊，還認為裝了Nsight可以Debug Shader，除了不太會使用外，只指出了Dowen在圖片載入的地方有些誤用而已。

<!--more-->

## glBindAttribLocation ##
`glBindAttribLocation`是一個幫Shader Code綁定沒定義的輸入頂點屬性位置的函式，至於問為什麼要手動定義這個問題，Dowen還無法確切地回答，不過就使用經驗來說，是為了能讓各個Shader統一頂點屬性，在寫VAO用`glVertexAttribPointer`載入上會比較容易，還有在寫新Shader上，也不用在意每個頂點屬性的位置，但是仍要注意屬性名稱寫對，就可以輕鬆的在程式上操控每個頂點屬性的輸入。

接下來就是蠢問題示範:

``` cpp
enum VertexAttributeLocationRule
{
	position = 0,
	texCoord = 1,
	normal = 2,
	boneID = 5,
	boneWeight = 6,
};

BasicRenderModel Loader::LoadRenderModel(float position[], int pdataLength, int indices[], int indexLength, float texCoords[], int texCoordLength, float normals[], int normalLength, int boneID[], float boneWeight[], int boneLength)
{
	GLuint vaoID = CreateVAO();
	BindVAO(vaoID);
	BindVertexAttribute(VertexAttributeLocationRule::position, 3, position, pdataLength);
	BindVertexAttribute(VertexAttributeLocationRule::texCoord, 2, texCoords, texCoordLength);
	BindVertexAttribute(VertexAttributeLocationRule::normal, 3, normals, normalLength);
	int boneDimension = (int)((float)boneLength / (float)pdataLength * 3);

	GLuint vboID;
	glGenBuffers(1, &vboID);
	vbos.push_back(vboID);
	glBindBuffer(GL_ARRAY_BUFFER, vboID);
	glBufferData(GL_ARRAY_BUFFER, boneLength * sizeof(GLint), boneID, GL_STATIC_DRAW);
	glVertexAttribIPointer(VertexAttributeLocationRule::boneID, boneDimension, GL_INT, boneDimension * sizeof(GLint), (GLvoid*)0);
	glEnableVertexAttribArray(VertexAttributeLocationRule::boneID);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	BindVertexAttribute(VertexAttributeLocationRule::boneWeight, boneDimension, boneWeight, boneLength);
	BindIndices(indices, indexLength);
	UnbindVAO();
	return BasicRenderModel(vaoID, indexLength);
}

GLuint ShaderProgram::LoadShader(const char *vertex_path, const char *fragment_path,
	const char *tcs_path = nullptr, const char *tes_path = nullptr, const char *geo_path = nullptr) 
{
	// 準備頂點著色器  // 創造頂點著色器
	GLuint vertShader = CreateBasicShader(0, vertex_path);
	// 準備像素著色器  // 創造像素著色器
	GLuint fragShader = CreateBasicShader(1, fragment_path);
	GLuint tcsShader = -1, tesShader = -1, geoShader = -1;
	if(tcs_path != nullptr)
		tcsShader = CreateBasicShader(2, tcs_path);
	if (tes_path != nullptr)
		tesShader = CreateBasicShader(3, tes_path);
	if (geo_path != nullptr)
		geoShader = CreateBasicShader(4, geo_path);

	/*********************建立程式綁定著色器**********************/
	//std::cout << "Linking program" << std::endl;
	Debug::Log("Linking program");
	// 建立著色器程式 // 創造著色器程式
	//GLuint program = glCreateProgram();
	this->program = glCreateProgram();
	// 將需要的著色器載入到著色器程式中
	glAttachShader(program, vertShader);
	glAttachShader(program, fragShader);
	tcsShader == -1 ? tcsShader = -1: glAttachShader(program, tcsShader);
	tesShader == -1 ? tesShader = -1 : glAttachShader(program, tesShader);
	geoShader == -1 ? geoShader = -1 : glAttachShader(program, geoShader);
	// 載入完後連結到著色器
	glLinkProgram(program);
	GLuint tester1 = glGetAttribLocation(program, "boneID");
	GLuint tester2 = glGetAttribLocation(program, "boneWeight");
	// 確認著色器程式是否成功連結
	DebugProgram(program);

	// Bind Attributes
	BindAttributes();

	// 刪除不用的著色器
	glDeleteShader(vertShader);
	glDeleteShader(fragShader);

	return program;
}


void ModelShader::BindAttributes()
{
	StaticShader::BindAttributes();
	BindAttribute(VertexAttributeLocationRule::boneID, "boneID");
	BindAttribute(VertexAttributeLocationRule::boneWeight, "boneWeight");
}

void ShaderProgram::BindAttribute(int attributeLoc, const char* attributeName)
{
	glBindAttribLocation(this->GetProgram(), attributeLoc, attributeName);
}

```

以上問題已經過簡化，原本`BindAttributes()`是寫在每個繼承中的Contructor，後來的新寫法是依照Template Pattern重新寫在`Init()`的函式中。額外提一下，這期間遇到的問題是，Template Pattern在C++中，無法在Contructor調用純虛擬函式，因此只好把每個Shader的初始化分成Contructor與Init兩段。

回到正題，上方的Code，會導致boneID與boneWeight的綁定初始為3、4，這是為什麼呢?因為position、normal、texCoord已佔領0、1、2，剩下的補位3、4就是boneID與boneWeight。因為`BindAttributes`或說`BindAttribute`，又或說`glBindAttribLocation`被呼叫的時機點是`glLinkProgram`之後，再來看一下`glBindAttribLocation`的文件說明。

{% blockquote @opengl.org https://www.opengl.org/sdk/docs/man/html/glBindAttribLocation.xhtml %}
#### glBindAttribLocation ####
glBindAttribLocation can be called **before any vertex shader objects are bound to the specified program object**. It is also permissible to bind a generic attribute index to an attribute variable name that is never used in a vertex shader.
{% endblockquote %}

了解狀況後，將呼叫`glBindAttribLocation`移動到`glLinkProgram`之前即可。

``` cpp
GLuint ShaderProgram::LoadShader(const char *vertex_path, const char *fragment_path,
	const char *tcs_path = nullptr, const char *tes_path = nullptr, const char *geo_path = nullptr) 
{
	// 準備頂點著色器  // 創造頂點著色器
	GLuint vertShader = CreateBasicShader(0, vertex_path);
	// 準備像素著色器  // 創造像素著色器
	GLuint fragShader = CreateBasicShader(1, fragment_path);
	GLuint tcsShader = -1, tesShader = -1, geoShader = -1;
	if(tcs_path != nullptr)
		tcsShader = CreateBasicShader(2, tcs_path);
	if (tes_path != nullptr)
		tesShader = CreateBasicShader(3, tes_path);
	if (geo_path != nullptr)
		geoShader = CreateBasicShader(4, geo_path);

	/*********************建立程式綁定著色器**********************/
	//std::cout << "Linking program" << std::endl;
	Debug::Log("Linking program");
	// 建立著色器程式 // 創造著色器程式
	//GLuint program = glCreateProgram();
	this->program = glCreateProgram();
	// 將需要的著色器載入到著色器程式中
	glAttachShader(program, vertShader);
	glAttachShader(program, fragShader);
	tcsShader == -1 ? tcsShader = -1: glAttachShader(program, tcsShader);
	tesShader == -1 ? tesShader = -1 : glAttachShader(program, tesShader);
	geoShader == -1 ? geoShader = -1 : glAttachShader(program, geoShader);
	// Bind Attributes
	BindAttributes();
	// 載入完後連結到著色器
	glLinkProgram(program);
	GLuint tester1 = glGetAttribLocation(program, "boneID");
	GLuint tester2 = glGetAttribLocation(program, "boneWeight");
	// 確認著色器程式是否成功連結
	DebugProgram(program);
	// 刪除不用的著色器
	glDeleteShader(vertShader);
	glDeleteShader(fragShader);

	return program;
}
```

## 小結 ##
該怎麼說，OpenGL function使用有誤真的很難檢測，因為不會有任何警告或錯誤，果然還是得依靠經驗與長年累月的Debug。雖然如此，但是還是滿喜歡從底層搞起，方可看見3D世界中的各種原理，也可以由自身經驗判斷不同遊戲引擎好壞，算是滿開心的一件事。

