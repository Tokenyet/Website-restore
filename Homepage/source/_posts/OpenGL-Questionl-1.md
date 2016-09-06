title: "OpenGL之沒有蠢問題 1 - Uniform"
date: 2016-09-04 23:10:18
categories: [OpenGL]
tags: [OpenGL問題, glGetUniformLocation, glGetUniformLocation fails, glGetUniformLocation 問題, glGetUniformLocation bug]
---
## 閒談 ##
最近在正藉由開發遊戲引擎將以往學過的各種技巧逐步整合起來，像是**Phong**，**Normal Mapping**，**gBuffer**，**Assimp**，**Instancing**，**Parallax Mapping**...等。然後參閱網路上神人的概念，左吸收右吐納總算是有點雛形，但其中遇到最Impress的問題是`glGetUniformLocation`，就由它來做蠢問題系列的第一集主角吧！

<!--more-->

## glGetUniformLocation ##
`glGetUniformLocation`是碰到Shader即會用到的function，但是Shader爆炸了，卻找不到問題，首先就會面對的也是`glGetUniformLocation`。

先展示一下Dowen有問題的Shader與Code:

Shader:
```cpp shader
#version 330 core
struct Material 
{
    sampler2D diffuse0;
    sampler2D specular0;
    float shininess;
};  

struct Light 
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};


in vec2 TexCoords;
in vec3 FragPos;
in vec3 Normal;
out vec4 color;

uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
	vec3 lightPos = light.position;
    // Ambient
    vec3 ambient = light.ambient * vec3(texture(material.diffuse0, TexCoords));
	
	// Diffuse
	vec3 norm = normalize(Normal);
	vec3 lightDir = normalize(lightPos - FragPos);  
	float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse0, TexCoords));

	    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec * vec3(texture(material.specular0, TexCoords));
    //color = vec4(1.0f, 0.5f, 0.2f, 1.0f);

	//color = vec4(ambient + diffuse + specular, 1.0f);  
	color = vec4(specular, 1.0f);  
} 
```

CPP原始碼的部分:
```cpp code
void StaticShader::SetDiffuseTexture(GLuint texture)
{
	glActiveTexture(GL_TEXTURE0 + diffuseCount);
	glBindTexture(GL_TEXTURE_2D, texture);
	std::string diffuse = "material.diffuse" + std::to_string(diffuseCount);
	int loc = GetUniformLocation(diffuse.c_str());
	if (loc == -1) Debug::Log("Diffuse texture Setting Fail.");
	glUniform1i(loc, diffuseCount);
	diffuseCount++;
}
```

好了，看起來完美地有做debug處理，所以自製的Debug在Visual Studio下方的輸出視窗中印出了這樣的訊息。

```
Diffuse texture Setting Fail.
Light Ambient Setting Fail.
Light Diffuse Setting Fail.
```

原因是`glGetUniformLocation`回傳$-1$，意思是找不到該Uniform位置。然後我Double Check，Triple Check，....Check，複製貼上確保命名問題正確等手法，還是出現同樣地訊息。

```
Diffuse texture Setting Fail.
Light Ambient Setting Fail.
Light Diffuse Setting Fail.
```

之後想找更深入的Debug方法，於是就找上了列出所有Attribute與Uniform的偵錯技巧，[原文][1]。


``` cpp
function ListAttributes() 
{
	GLint i;
	GLint count;

	GLint size; // size of the variable
	GLenum type; // type of the variable (float, vec3 or mat4, etc)

	const GLsizei bufSize = 16; // maximum name length
	GLchar name[bufSize]; // variable name in GLSL
	GLsizei length; // name length

	glGetProgramiv(program, GL_ACTIVE_ATTRIBUTES, &count);
	printf("Active Attributes: %d\n", count);

	for (i = 0; i < count; i++)
	{
	glGetActiveAttrib(program, (GLuint)i, bufSize, &length, &size, &type, name);

	printf("Attribute #%d Type: %u Name: %s\n", i, type, name);
	}
}
```

列出來的訊息如下:

```
Active Attributes: 3
Attribute #0 Type :35665Name : normal
Attribute #1 Type :35665Name : position
Attribute #2 Type :35664Name : texCoord
Active Uniforms: 8
Uniform #0 Type :35665Name : light.position
Uniform #1 Type :35665Name : light.specular
Uniform #2 Type :5126Name : material.shinin
Uniform #3 Type :35678Name : material.specul
Uniform #4 Type :35676Name : model
Uniform #5 Type :35676Name : projection
Uniform #6 Type :35676Name : view
Uniform #7 Type :35665Name : viewPos
```

果然少了**原本**應該要出現的那幾項，因此Dowen就開始反覆的重建專案，清除，重建，重開整個project，想說這招也許能成功，一個非常祈禱式的Debug(?)。

最後終於找到了一篇理念型文章，告知了我一些重要的概念，[原文][2]在此，整篇的大致概念是這樣的。`glGetUniformLocation`是一個取得**Active Uniform**，**Active Uniform**，**Active Uniform**的一個function。又什麼是**Active Uniform**呢? 假設手上有Vertex Shader跟Fragment Shader，將兩者合為一個Program之後，OpenGL會非常貼心地，幫我們把那些不會被用到的變數給移除，就如之前貼的Shader來講好了。

``` cpp
vec3 viewDir = normalize(viewPos - FragPos);
vec3 reflectDir = reflect(-lightDir, norm);  
float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
vec3 specular = light.specular * spec * vec3(texture(material.specular0, TexCoords));

//color = vec4(ambient + diffuse + specular, 1.0f);  
color = vec4(specular, 1.0f);  
```

```
Diffuse texture Setting Fail.
Light Ambient Setting Fail.
Light Diffuse Setting Fail.
```

由於輸出的`color`是藉由`specular`的值，然後`specular`是源自於`material.specular0`，跟`material.diffuse0`完全無關，所以`diffuse0`就被從Shader Code中移除，而`light.ambient`跟`light.diffuse`也是同`material.diffuse0`一樣，被斷定為無用之人，因此被踢出了菁因工會，哦不是，我是說Shader Program。

在理解到這個精粹(?)後，Dowen將註解解開(本來是想單獨檢視`specular`所以才這樣註解)，然後將目前的輸出註解掉。天堂的門就打開了！

{% img "/images/OQ1/complete.png" 420 %}

## 小結 ##
希望對剛使用OpenGL，然後Debug一整天的人有幫助，像Dowen解了有五小時之多啊！


[1]: http://stackoverflow.com/questions/440144/in-opengl-is-there-a-way-to-get-a-list-of-all-uniforms-attribs-used-by-a-shade "get all uniform and attributes"

[2]: http://stackoverflow.com/questions/20751157/glsl-vertex-shader-glgetuniformlocation-fails "glGetUniformLocation fails"