title: QT中安裝OpenGL教學
date: 2015-08-26 17:40:26
categories : [OpenGL]
tags: [OpenGL,QT,Ubuntu]
---

This is a tutorial for install glew & glfw on ubuntu with qt.

Enviroment : Ubuntu14 + QT5

##Install glfw##

1. First. we need to install dependencies on ubuntu

```
sudo apt-get install xorg-dev
sudo apt-get install libglu1-mesa-dev
```

##Install glew##

1. Then download source package at [official](http://glew.sourceforge.net/)

2. Extract your package and open your terminal, then cd to what your package location which you just extracted.

3. Do following commnad to install

```
make extension
make 
sudo make install
sudo make clean
```

##Open QT project and set opengl settings##

1. Open a console project in QT

2. Add following settings in your .pro file anywhere.

```
LIBS +=-lGLEW -lglfw3 -lGL -lX11 -lXi -lXrandr -lXxf86vm -lXinerama -lXcursor -lrt -lm -pthread
```

Try a simple test.

```
#define GLEW_STATIC
#include <GL/glew.h>
#include<GLFW/glfw3.h>


int main(int argc, char *argv[])
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    return 0;
}
```

##Enjoy it##