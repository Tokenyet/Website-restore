title: Interpolation筆記
date: 2015-09-06 14:52:48
categories : [數學筆記]
tags: [線性代數,內插,Interpolation]
---
<hr />
###證明筆記,如有空再補上說明###
<hr />
**1. 線性內插(Linear Interpolation)**

$ y = ax + b , f(x) = ax + b $ 

$ y\_i = a x\_i + b $

$ y\_{i+1} = a x\_{i+1} + b $

$ y\_{i+1} - y\_i = a\_{i+1} -a x\_i $

$ y\_{i+1} - y\_i = a (x\_{i+1} -a x\_i) $

$ y\_{i+1} - y\_i/(x\_{i+1} -x\_i) = a $

$ y\_i = (y\_{i+1} - y\_i/(x\_{i+1} -x\_i))x\_i + b $

$ y\_i - ax\_i = b $

$ f(x) = (y\_{i+1} - yi/(x\_{i+1} -x\_i))x + yi -ax\_i $

$ f(x) = (y\_{i+1} - yi/(x\_{i+1} -xi))(x-xi) + yi $
