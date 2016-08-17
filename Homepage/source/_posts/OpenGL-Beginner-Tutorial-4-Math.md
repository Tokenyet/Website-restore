title: "OpenGL 入門教學 4: 數學"
date: 2016-08-11 16:44:20
categories: [OpenGL]
tags: [OpenGL, OpenGL教學, OpenGL入門教學, OpenGL Tutorial, OpenGL介紹, OpenGL基礎, 向量, 歐拉角, 折射, 反射, Reflect, Refract, 世界座標, 物體座標, local space, view space, clip space, ndc, projection, 透視投影, 正交投影, GLM, bezier curve, cubic bezier curve, canera, lookat, 矩陣, 攝影機, 座標系統, Euler Angle, Rotation, translate, scale, matrix, vector, 透視除法, perspective, orthographic, perspective division, 內積, 外積, 直線, 內插, Intepolation]
---
## 開始前介紹 ##
這一章節主要是介紹一些數學的基礎，如果發現哪個部分不熟的話，最好能親自磨練一下，因為以後常常需要的時候，如果不懂箇中原理，那麼在偵錯或是實作上，會遇到一些麻煩。當然領悟過後能寫起來是最推薦的方式，以後忘了的時候瞟一眼就行了。初學者如果看不懂本篇的話，可以暫且跳過無妨，當有用到再回頭看，因為現在的文章是搭配官方藍寶書的章節推進，而藍寶書比較適合中階以上閱讀者，所以本篇對初學者來說應該很吃力。
接下來會介紹的內容基本上有:
* 向量
* 反射與折射
* 矩陣
* 相關座標系統
* 攝影機
* 透視投影與正交投影
* 直線與曲線
* GLM

<!--more-->
## 向量 ##
這邊應該大家都有學過，在此只是把我自己領略的概念描述出來，如果不懂的話，請參閱其他數學專業網站。

### 何謂向量 ###
向量的定義是一個方向附帶著一個量的數值，而為什麼需要一個有數值的方向呢？因為想將向量運用到各種不同的地方，這樣就可以不需要同樣的原點與終點來重現這樣的動作。我們假設一個二維的座標平面，上面有一個點 $p_1$ 還有一個點 $p_2$ ，用 $ p_2 - p_1 $  所得到的就是從 $ p_1 $ 指向 $ p_2 $ 的向量，如果想不通就想成 $p_2$ 與原點 $ o $ 的關係是 $ p_2 - o $，也就是從原點指向 $ p_2 $ 的向量。

### 基本性質 ###
向量的加減性質跳過。

### 長度 ###
如果向量是 $ (1,2,3) $ 長度的定義是 $ \sqrt{1^2 + 2^2 + 3^2} $，向量已經是兩點相減的結果，所以只要將各個分量平方後開根號就是長度。

### 單位向量 ###
若向量是 $ (1,2,3) $ 則單位向量就是其向量除以長度，也就是 $ \left(\frac{1}{\sqrt{14}},\frac{2}{\sqrt{14}},\frac{3}{\sqrt{14}}\right) $
這樣的好處是，可以得到往該方向一個單位長度需要多少向量。也就是說上方的各自平方後相加長度等於一。而單位向量的概念在OpenGL中稱之為**Normalize**。

### 內積 ###
內積的定義是這樣的 $ \vec{a} \cdot \vec{b} = a_xb_x+a_yb_y+a_zb_z $
直接看看不出它的意義是什麼，他還有另一個特性是 $ \vec{a} \cdot \vec{b} =  \left| \vec{a} \right| \left| \vec{b} \right| \cos{\theta} $
在圖學中內積常常用來求的是角度，也就是說根據上方的另一個性質，將長度移到左方然後算出內積的值，就可以得到 $ value = \cos{\theta} $ 的情況，也就是可以知道角度是多少，這是內積常常運用在圖學中的部分。至於上方的兩定義由來就不探討。

### 外積 ###
外積的定義是 $ \vec{V}_1 \times \vec{V}_2  = \vec{V}_3$
{% math %}
\begin{bmatrix} 
V_3.x \\
V_3.y \\
V_3.z \\
\end{bmatrix}
= 
\begin{bmatrix} 
V_1.y \cdot V_2.z - V_1.z \cdot V_2.y \\
V_1.z \cdot V_2.x - V_1.x \cdot V_2.z \\ 
V_1.x \cdot V_2.y - V_1.y \cdot V_2.x \\
\end{bmatrix}
{% endmath %}
得到的 $ \vec{V}_3 $ 就是垂直於  $ \vec{V}_1 , \vec{V}_2 $的向量，依照[弗萊明右手定則](https://zh.wikipedia.org/wiki/右手定則)就可以知道該垂直向量應該往哪裡垂直，且別擔心，不管怎麼比都會在定則內的。在圖學中，會用到的就是外積算出來垂直於表面的特性，也就是Normal Vector，這個光影特效中時常使用的向量。


## 反射與折射 ##
### 反射 ###
反射有個特性，就是入射角等於反射角，然後依照圖片所示，我們要算出反射角的方法有兩種。一種是不用將入射角反轉，直接位移兩個垂直平面的分量。另一種是將入射角反轉，移動兩個水平分量，而這裡介紹的是移動兩個垂直分量的方法。
結果公式為:
{% math %}
R_{reflect} = R_{in} - (2N \cdot R_{in} )N
{% endmath %}
解釋 : 反射分量 = 入射分量 - 兩個垂直表面的分量。

正式理解，我們直觀來看入射角 {% math %} R_{in} {% endmath %} 應該要減去兩個垂直於法向量 {% math %} N {% endmath %} 的 {% math %} R_{in} {% endmath %} 垂直分量。直觀來看就是 {% math %} R_{in} {% endmath %} 加上兩個 {% math %} \left| -R_{in} \right| \cos{\theta} \times \frac{N}{\left|N\right|} {% endmath %}，而 {% math %} -R_{in} {% endmath %} 代表反的入射角，因為要跟垂直分量算夾角，必須要兩向量都從頭個原點出發才行。那為何是 {% math %} \left| -R_{in} \right| {% endmath %} 呢?因為透過三角形的畢氏定理，就可以換算成在該垂直分量上的長度多少，之後再轉回向量，也就是要乘上 {% math %} N {% endmath %} 的單位向量 {% math %} \frac{N}{\left|N\right|} {% endmath %}，就可以得知在該方向上的分量是多少，這裡運用到投影向量的技巧，需要自行去熟悉一下。

來認真的推看看:
原式:
{% math %} R_{in} + 2 \times \left| -R_{in} \right| \cos{\theta} \times \frac{N}{\left|N\right|} {% endmath %}

化簡多餘的部分(對了N固定是單位向量，也就是長度為1):
{% math %} R_{in} + 2 \times \left| -R_{in} \right| \cos{\theta} \times N {% endmath %}

由於 {% math %} -R_{in} \cdot N = \left| -R_{in} \right| \left| N \right|  \cos{\theta} {% endmath %}

又可以是 {% math %} -R_{in} \cdot N = \left| -R_{in} \right| \cos{\theta} {% endmath %}

因此化簡為:
{% math %}
R_{in} + 2 \times -R_{in} \cdot N * N
{% endmath %}

負號提出來:
{% math %}
R_{in} - 2 \times R_{in} \cdot N * N
{% endmath %}

最後將上方的原式拿來比較:
{% math %}
R_{reflect} = R_{in} - (2N \cdot R_{in} )N = R_{in} - 2 \times R_{in} \cdot N \times N
{% endmath %}

得證相等，與理解的無誤。
### 折射 ###
折射的部分，Dowen也尚未理解，公式牽涉較深物理，理論是說，入射方介質 $ \eta $  小於折射方介質$ \eta $ ，那折射方就會偏向法向量，反之就會偏離，不是物理學者，我想知道概念足矣。
{% math %}
\begin{gather}
k = 1 - \eta^2(1 - (N \cdot R)^2) \\
R_{refract} = 
\begin{cases} 
0.0 & \text{if $k < 0.0 $} \\[2ex]
\eta R - (\eta (N \cdot R) + \sqrt{k})N & \text{if $k \ge 0.0$}
\end{cases}
\end{gather}
{% endmath %}


## 矩陣 ##
說到矩陣，以前完全想不透為何經過矩陣轉換，得到的東西是一個有意義的東西。某日深研後，發現矩陣是由方程式的演變而來的，聽起來很理所當然，不過當題目做多了，反思一下卻忘了本源是什麼，就有點慌慌的。接下來就用方程式與矩陣一起說明，不直接用矩陣說明的方式來教學。至於矩陣的乘法，在這裡就不贅述，矩陣只是一種方程式變相的工具使用而已，如果有疑慮請詳閱專業數學相關網站。

### 位移 ###
假設一物體位於三維空間中 {% math %} p_{old} (x, y, z) {% endmath %} 點上，那要移動至 {% math %} p_{new} (x + 2 ,y + 3 ,z-5) {% endmath %} 的點在方程式上該如何表示呢?
{% math %}
p_{old} (x_{old}, y_{old}, z_{old}) , \\
p_{new} (x_{new}, y_{new}, z_{new}) , \\
x_{new} = x_{old} + 2 \\
y_{new} = y_{old} + 3 \\
z_{new} = z_{old} - 5
{% endmath %}
位移在方程式上算是比較特殊的轉法，一般我們矩陣是3x1(新座標) = 3x3 * 3x1(原座標)。但是可以發現相乘後，只會縮放各個x, y, z的座標後相加。
{% math %}
\begin{bmatrix}
a_1 & b_1 & c_1 \\
a_2 & b_2 & c_2 \\
a_3 & b_3 & c_3 \\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
\end{bmatrix}
= 
\begin{bmatrix}
a_1 \cdot x_{old} + b_1 \cdot y_{old} + c_1 \cdot z_{old}\\
a_2 \cdot x_{old} + b_2 \cdot y_{old} + c_2 \cdot z_{old}\\
a_3 \cdot x_{old} + b_3 \cdot y_{old} + c_3 \cdot z_{old}\\
\end{bmatrix}
{% endmath %}
在這裡加上一個四維座標空間的概念，圖學中常常使用到，但實際上仍是三維的一個輔助法。
{% math %}
\begin{bmatrix}
a_1 & b_1 & c_1 & w_1 \\
a_2 & b_2 & c_2 & w_2 \\
a_3 & b_3 & c_3 & w_3 \\
a_4 & b_4 & c_4 & w_4 \\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
w_{old}\\
\end{bmatrix}
= 
\begin{bmatrix}
a_1 \cdot x_{old} + b_1 \cdot y_{old} + c_1 \cdot z_{old} + w_1 \cdot w_{old} \\
a_2 \cdot x_{old} + b_2 \cdot y_{old} + c_2 \cdot z_{old} + w_2 \cdot w_{old} \\
a_3 \cdot x_{old} + b_3 \cdot y_{old} + c_3 \cdot z_{old} + w_3 \cdot w_{old} \\
a_4 \cdot x_{old} + b_4 \cdot y_{old} + c_4 \cdot z_{old} + w_4 \cdot w_{old} \\
\end{bmatrix}
{% endmath %}
擴充成四維空間後，這樣看起來沒什麼意義。但是當在不必要的地方填入0，還有必要的地方填入1後，就會變以下這樣。
{% math %}
\begin{bmatrix}
1 & 0 & 0 & w_1 \\
0 & 1 & 0 & w_2 \\
0 & 0 & 1 & w_3 \\
0 & 0 & 0 & 1 \\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
1\\
\end{bmatrix}
= 
\begin{bmatrix}
1 \cdot x_{old} + 0 \cdot y_{old} + 0 \cdot z_{old} + w_1 \cdot 1 \\
0 \cdot x_{old} + 1 \cdot y_{old} + 0 \cdot z_{old} + w_2 \cdot 1 \\
0 \cdot x_{old} + 0 \cdot y_{old} + 1 \cdot z_{old} + w_3 \cdot 1 \\
0 \cdot x_{old} + 0 \cdot y_{old} + 0 \cdot z_{old} + 1 \cdot 1 \\
\end{bmatrix}
=
\begin{bmatrix}
x_{old} + w_1\\
y_{old} + w_2\\
z_{old} + w_3\\
1\\
\end{bmatrix}
{% endmath %}
這樣子就變成一個位移專用的矩陣，仍然不會用到我們擴充的第四維，但是又可以輔助三維空間的位移。

{% math %}
\begin{bmatrix}
1 & 0 & 0 & 2 \\
0 & 1 & 0 & 3 \\
0 & 0 & 1 & -5 \\
0 & 0 & 0 & 1 \\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
1\\
\end{bmatrix}
= 
\begin{bmatrix}
1 \cdot x_{old} + 0 \cdot y_{old} + 0 \cdot z_{old} + 2 \cdot 1 \\
0 \cdot x_{old} + 1 \cdot y_{old} + 0 \cdot z_{old} + 3 \cdot 1 \\
0 \cdot x_{old} + 0 \cdot y_{old} + 1 \cdot z_{old} - 5 \cdot 1 \\
0 \cdot x_{old} + 0 \cdot y_{old} + 0 \cdot z_{old} + 1 \cdot 1 \\
\end{bmatrix}
=
\begin{bmatrix}
x_{old} + 2\\
y_{old} + 3\\
z_{old} - 5\\
1\\
\end{bmatrix}
{% endmath %}
以上就是位移矩陣的由來。在定位一個物體在世界座標中哪個位置時常使用。

### 旋轉 ###
旋轉矩陣我在[這篇](/2015/08/19/座標轉換筆記/)文章中有寫過，因此把結果提出來，讓我們知道方程式與矩陣的關係。
原本的方程式如下:
{% math %}
x_{new} = x_{old} \cos \theta - y_{old} \sin \theta \\
y_{new} = x_{old} \sin \theta + y_{old} \cos \theta \\
{% endmath %}
換成矩陣後:
{% math %}
\begin{bmatrix}
\cos{\theta} & -\sin{\theta} \\
\sin{\theta} & \cos{\theta}  \\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
\end{bmatrix}
= 
\begin{bmatrix}
x_{old} \cos{\theta} - y_{old} \sin{\theta} \\
x_{old} \sin{\theta} + y_{old} \cos{\theta} \\
\end{bmatrix}
{% endmath %}

如果要放到3D世界來使用，有兩點要思考。
1. 這樣的旋轉在3D世界中是屬於依照X還是Y還是Z呢? Ans: Z
2. 要位移怎麼辦?只能是XYZ軸嗎?
這篇文章介紹每個大概，只介紹依照XYZ軸的旋轉，如果是依照[任意軸][2]，或更勝之是[四元數][3]，這些較適合以後開文章討論，或是請讀者至參考連結去閱讀，如果有問題可以提出來討論，Dowen在寫這篇文章的時候都已閱讀完畢。

{% blockquote %}
####歐拉角####
以旋轉矩陣來進行旋轉的集合統稱為歐拉角，順序有先XYZ, ZYX ,YZX, XZY...各種組合。如果是以**世界座標**的XYZ旋轉，不會產生問題。但是如果以**物體座標**的話，就會產生意想不到的問題。怎麼說呢? 拿起手機，螢幕對著自己，當作Z軸指向自己，上方當作Y軸，右方當作X軸。 那如果以ZXY的矩陣來旋轉會產生什麼問題呢?首先以Z轉任意角度，X轉**90度**，之後Y的選轉軸，與Z就重合了。有人會想物體的Z也在變阿? 實際上，電腦藉由矩陣運算的時候，轉完Z之後，轉了X後，Z已經不會有任何改變，因為那是之前轉完的。而X轉了90度後，Y剛好與原Z軸重合，導致Y與Z軸只能轉一樣的方向。 這就是所謂的[萬向鎖\(Gimbal Lock\)](https://www.youtube.com/watch?v=zc8b2Jo7mno)
{% endblockquote %}

先擴充成以Z軸的三維旋轉
{% math %}
\begin{bmatrix}
\cos{\theta} & -\sin{\theta} & 0\\
\sin{\theta} & \cos{\theta}  & 0\\
0 		     & 0             & 1\\
\end{bmatrix}
{% endmath %}

以上讀者可以以之前的方式自行證明。接下來要擴充成四維空間，原因是之前說過的，為了位移的技巧。
{% math %}
\begin{bmatrix}
\cos{\theta} & -\sin{\theta} & 0 & 0\\
\sin{\theta} & \cos{\theta}  & 0 & 0\\
0 		     & 0             & 1 & 0\\
0 		     & 0             & 0 & 1\\
\end{bmatrix}
{% endmath %}
順便列出剩下兩個以x與y的旋轉。

以Y軸旋轉
{% math %}
\begin{bmatrix}
\cos{\beta}  & 0 & \sin{\beta} & 0\\
0            & 1 & 0           & 0\\
-\sin{\beta} & 0 & \cos{\beta} & 0\\
0 		     & 0 & 0           & 1\\
\end{bmatrix}
{% endmath %}

以X軸旋轉
{% math %}
\begin{bmatrix}
1 & 0             & 0            & 0\\
0 & \cos{\alpha}  & -sin{\alpha} & 0\\
0 & \sin{\alpha}  & cos{\alpha}  & 0\\
0 & 0             & 0            & 1\\
\end{bmatrix}
{% endmath %}

順便一提，如果自己推出的矩陣與上不符，不一定是錯的，只是在圖學中，上方是符合右手定則，逆時針旋轉，以Z軸旋轉來說，就是Z不變, X軸朝向Y軸移動形成看起來逆時針的旋轉。(圖學中Z軸永遠指向螢幕外，也就是指向自己)

### 縮放 ###
縮放其實很簡單，不論你原本的點是在負向的部分還是正向，經由縮放後，會靠近0，或者遠離0，矩陣如下。
{% math %}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
1\\
\end{bmatrix}
\begin{bmatrix}
S_x & 0 & 0   & 0\\
0 & S_y & 0   & 0\\
0 & 0	& S_z & 0\\
0 & 0   & 0   & 1\\
\end{bmatrix}
=
\begin{bmatrix}
S_x x_{old}\\
S_y y_{old}\\
S_z z_{old}\\
1\\
\end{bmatrix}
{% endmath %}


## 相關座標空間 ##
使用OpenGL需要接觸到許多三維座標空間，看到以下列出這麼多，也不需要太慌張，其實都是一點一點演變而來的，這一連串的座標空間都息息相關。
### 笛卡爾座標 ###
這是我們最常使用到的座標系統，直角坐標系統，也稱為笛卡爾座標系統，這個就不多做說明。

{% img "/images/OBT4/Cartesian.png" 420 %}

### 齊次座標 ###
先來看下面這張圖。
{% raw %}
<div class="container-outside-div">
		<img src="http://image5.tuku.cn/wallpaper/Landscape%20Wallpapers/10666_1280x800.jpg" style="width: 420px">
		<p>圖片引用自<a href="http://www.tuku.cn">圖庫網</a></p>
</div>
{% endraw %}
鐵軌旁邊兩條平行的軌道，理應是一直線不會交合的，但是現實世界中，他們越遠就會越相近。而距今約兩百年前的天文學家 奧古斯特·費迪南德·莫比烏斯（August Ferdinand Möbius) 發展了齊次座標的概念，使用齊次概念的座標系統，都要在其維度多增加一維。 (而剛好的，增加一維又可以讓位移矩陣發揮作用，這不知道是不是一種數學的巧合呢?)

而齊次與笛卡爾的關係如下:
二維:
$ (x,y,w) = \left( \frac{x}{w},\frac{y}{w} \right)  $ 
三維: (投影矩陣部分詳細說明, 先看二維就好)
$ (x,y,z,w) = \left( \frac{x}{w},\frac{y}{w},\frac{z}{w} \right)  $ 
舉例如下:
$ (2,3,5)_h = \left(\frac{2}{5},\frac{3}{5}\right)_c $
$ (4,6,10)_h = \left(\frac{4}{10},\frac{6}{10}\right)_c = \left(\frac{2}{5},\frac{3}{5}\right)_c $
$ (2a,3a,5a)_h = \left(\frac{2}{5},\frac{3}{5}\right)_c $

利用齊次的概念讓兩條平行線有交集:
{% math %}
\begin{cases}
Ax + By + C = 0 \\
Ax + By + D = 0
\end{cases}
{% endmath %}
在上方的笛卡爾空間中，這兩條線除非 $ C = D $ ，否則不可能有交集。
而利用齊次的概念就是將 $ w $ 放進來，把 $ x $ 取代為 $ \frac{x}{w} $，$ y $ 取代為 $ \frac{y}{w} $
而w 的範圍是 $ 1 \ge w > 0$ ，其意義是遠近的意思。 越遠$w$值越小。
{% math %}
\begin{cases}
A \frac{x}{w} + B \frac{y}{w} + C = 0 \\
A \frac{x}{w} + B \frac{y}{w} + D = 0
\end{cases}
{% endmath %}
如果 $ w = 1 $ 那一切都沒變，但若 $ w $趨近於0，就會發生一件事，前兩項參數的值過於巨大，導致C,D的影響完全不重要。不過換個角度看的話會更明顯，這次改成這樣。
{% math %}
\begin{cases}
Ax + By + C \times w = 0 \\
Ax + By + D \times w = 0
\end{cases}
{% endmath %}
這樣很容易就可看出越遠C,D值越小，導致最後匯聚於一點的狀況。這就是在笛卡爾空間中運用齊次座標的效果。

以圖來表示:

{% img "https://s3.amazonaws.com/grapher/exports/ec89zgtdv0.png" 420 %}

* 紅線: $r = 5x + 50$
* 藍線: $b = 5x - 50$
* 綠色: $g = 5x - 50 \times w$
* 紫色: $p = 5x - 50 \times w$
* $w$(深度): $w = 1 - x/100$ (只要看x = 0 ~ 100的範圍, 超過都不在實驗範圍)
上圖表示到$ x = 100$這個點的時候會聚在一起，而且是逐漸匯聚。

### 物體座標 ###
不管事人物、花瓶、球，任何物體在建置的時候都有一個**Local Space**，稱為物體座標，在這物體座標中，建置的每個點都是相對於原點。通常都會把物體的每個頂點都定義在原點附近，因為這不是真正在遊戲或場警中出現的位置，所以在這個空間建置的模型，只需要專注建模即可。

{% img "/images/OBT4/local.png" 300 %}

### 世界座標 ###
把物體放到世界座標(**World Space**)，我們利用一個矩陣稱為**Model矩陣**。這是圖學常見的MVP矩陣中的第一段，將物體定位於世界的空間中。而Model矩陣可以由上方所提出的旋轉、位移、縮放所組成，但要注意順序是有差別的，正常我們會先縮放，再旋轉、在位移，原因是如果先位移，那旋轉轉的就不是模組本身，而是將模組以旋轉的方式位移。另外先旋轉，後縮放，在位移也是等可以的，如果不是這兩種方式，那就是有其他用途。總之，經過Model矩陣後，物體就會被放到世界場景中該有的位置。

{% img "/images/OBT4/world.png" 420 %}

### 視覺座標 ###
世界座標轉到視覺座標(**View Space**)，這裡使用**View矩陣**，而這空間也可以說是攝影機空間，將所有世界座標中的物體，經過旋轉位移後，移動到攝影機的面前，也就是世界的長相都取決於攝影機的位置，拍攝角度。跟現實不同的是，現實是攝影機移動拍攝世界，圖學中是世界移動到攝影機面前，或是移出攝影機外。

{% img "/images/OBT4/view.png" 420 %}

右下角那個攝影機拍攝畫面就是視覺座標的樣子。其實這裡以圖來表示不是很正確，因為還經過了正交投影，不懂正交投影的話，就先假設圖中就是正確的，因為正交實際上做的事不多。

### 投影座標 ###
最後來到的這個座標叫做(**Clip Space**)，使用到的矩陣稱為**Projection矩陣**，原理是透過兩個平面，一個近，一個遠，然後這個範圍內的物體影像(頂點)投射到近平面上，如果是線性投射(透視投影)，就會是**仿**現實生活的畫面，但也是我們最習慣看到的畫面，如下。

{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/pers-near.png" style="width: 300px">
		<p>近物</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/pers-far.png" style="width: 300px">
		<p>遠物</p>
	</div>
</div>
{% endraw %}

而如果是經過正交投影，直接將範圍透的物體作投射，那麼就不會有遠近的感覺。不過正交投影自然有它存在的價值，像是做影子就會使用到，初學者需要多多消化理解這部分，因為正交視覺上頗為不直觀。

{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/ortho-near.png" style="width: 300px">
		<p>近物</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/ortho-far.png" style="width: 300px">
		<p>遠物</p>
	</div>
</div>
{% endraw %}


## 攝影機 ##
一台攝影機，有拍攝角度跟攝影機的座標位置。這邊就先從簡單的攝影機位置在視覺座標中，與View矩陣到底有什麼關係說起。開始前先說明，畫面是從投影矩陣過後在xyz為-1 ~ 1之間的影像，所以移動到攝影機前這個動作，可能會聯想到，那原本的攝影機在哪? 為何要移動攝影機? 其實預設是有一個假攝影機，他會將那些頂點位於-1 ~ 1之間的描繪出來，所以之前的[文章](/2016/08/06/OpenGL-Beginner-Tutorial-3-Pipeline)才可以顯示出三角形，而這裡是要給讀者知道，要自訂一台攝影機所需要的知識。

### 攝影機的位置 ###
假設一攝影機位於$(1,2,3)$的三維空間中，那若要以該攝影機為視覺出發點該如何做呢? 簡單來說，就是朝向$(-1,-2,-3)$位移就好了，這裡的疑點應該是，攝影機都在$(1,2,3)$了，為何還要移動$(-1,-2,-3)$呢?原因是假定的這台攝影機，實際上也不存在，所有的視野都只會看到位於$(-1,-1,-1)$到$(1,1,1)$這個正方體(或稱為Normalize Device Coordination)中，也因此正中心是在$(0,0,0)$，也就是說要假裝正中心在$(1,2,3)$的話，那就是這世界的每個物體都要往反方向的$(1,2,3)$移動，也就是$(-1,-2,-3)$。舉個實際的例子，當一台攝影機往右邊平移拍攝的時候，攝影機**假設**沒再動，那也就是拍攝的物體往左方移動了，讓你誤以為往右平移拍攝，上面的原理就是如此，以為攝影機從原點$(0,0,0)$跑到$(1,2,3)$，實際上是所有物體從世界座標的$(x,y,z)$變成$(x-1,y-2,z-3)$，產生攝影機在動的錯覺。對了，不管哪個矩陣都是對每個物體的世界座標做相乘，而不是對攝影機這個抽象物體。
而攝影機關於位置的位移矩陣如下:
{% math %}
\begin{bmatrix}
1 & 0 & 0 & -Camera_x \\
0 & 1 & 0 & -Camera_y \\
0 & 0 & 1 & -Camera_z \\
0 & 0 & 0 & 1 \\
\end{bmatrix}
{% endmath %}

### 攝影機的拍攝角度 ###
攝影機的拍攝角度，基本上是由三個向量所定義而成的，攝影機的前方{% math %}\vec{C}_f{% endmath %}，攝影機的上方{% math %}\vec{C}_u{% endmath %}，攝影機的右方{% math %}\vec{C}_r{% endmath %}，有了這三個方向的向量，就可以知道，要怎麼旋轉，不過與其說是旋轉，不如說是**座標轉換**，將原本軸是$(1,0,0)$,$(0,1,0)$,$(0,0,1)$的三個互相垂直的向量，轉換成以{% math %}\vec{C}_r{% endmath %}, {% math %}\vec{C}_u{% endmath %}, {% math %}\vec{C}_f{% endmath %}為xyz軸的空間。
首先要先了解原座標空間在矩陣上是如何表示。
{% math %}
\begin{bmatrix}
1 & 0 & 0 & 0\\
0 & 1 & 0 & 0\\
0 & 0 & 1 & 0\\
0 & 0 & 0 & 1\\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
1\\
\end{bmatrix}
=
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
1\\
\end{bmatrix}
{% endmath %}
上方斜對角為一的稱為單位矩陣，撇去名詞，就是一個塞了XYZ三軸單位向量的矩陣，且多了一個不會用到的擴充四維。那麼在攝影機座標空間中是如何看待原座標空間中的點呢? 關係如下:
{% math %}
\begin{bmatrix}
C_r.x & C_r.y & C_r.z & 0\\
C_u.x & C_u.y & C_u.z & 0\\
C_f.x & C_f.y & C_f.z & 0\\
0     & 0     & 0     & 1\\
\end{bmatrix}
\begin{bmatrix}
x_{old}\\
y_{old}\\
z_{old}\\
1\\
\end{bmatrix}
=
\begin{bmatrix}
C_r.x \cdot x_{old} + C_r.y \cdot y_{old} + C_r.z \cdot z_{old} \\
C_u.x \cdot x_{old} + C_u.y \cdot y_{old} + C_u.z \cdot z_{old} \\
C_f.x \cdot x_{old} + C_f.y \cdot y_{old} + C_f.z \cdot z_{old} \\
1 																\\
\end{bmatrix}
{% endmath %}
而換算矩陣就是{% math %}\vec{C}_r{% endmath %}, {% math %}\vec{C}_u{% endmath %}, {% math %}\vec{C}_f{% endmath %}所構成的。也就是說如果此時你要在X軸移動一單位，需要$(C_r.x, C_r.y, C_r.z)$個單位才能在畫面上向右移動一格，忘了提到，這裡所使用到的攝影機向量都是單位向量。

而如果要使用攝影機的話，文末提供的GLM有一個名為`LookAt(cameraPositon, target, cameraUp)`，這個原理就是上方所講的，只是這裡的三個參數，就可以產生出三個向量，像是{% math %}\vec{C}_f{% endmath %} 只要利用 target - cameraPositon之後Normalize就可以達成，而{% math %}\vec{C}_u{% endmath %}就是cameraUp，最後的{% math %}\vec{C}_r{% endmath %}只要利用{% math %}\vec{C}_u \times \vec{C}_f {% endmath %}就可以得到最後的向量了，這裡外積的順序是yz相乘得x，如果是zy就會是-x，若無法理解請拿原本的$(0,1,0) \times (0,0,1)$來做測試。

而要操縱攝影機則要了解攝影機旋轉的概念，主要有三種旋轉方式。一個是Pitch，抬頭與低頭的概念。一個是Yaw，左轉與右轉的概念。一個是Roll，趴睡的時候，你的頭就會轉這種以鼻子為軸的方式旋轉。而概念圖如下:

{% img "/images/OBT4/Camera.png" 420 %}

在座標系統上的概念如下:
{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/pitch.gif" style="width: 50%">
		<p>Pitch</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/yaw.gif" style="width: 50%">
		<p>Yaw</p>
	</div>
</div>
{% endraw %}

Pitch(抬頭)，即是向量往Y軸移動，若假設向量長度為r，那XYZ三者與Pitch夾角$\theta$關係如下:
{% math %}
\begin{align}
y& = r\sin{\theta}\\
x& = r\cos{\theta} \cdot \cos{plane}\\
z& = r\cos{\theta} \cdot \sin{plane}\\
\end{align}
{% endmath %}
其中 plane 代表的是原本X,Z在平面上的分量，而且是常數。不過如果加入Yaw(回頭)的話，就可以改變這個情況，如上圖所示，Yaw代表的是X朝向Z的旋轉關係，所以只要把 plane 改為 $ \alpha $ 就可以完成Pitch與Yaw的攝影機。
{% math %}
\begin{align}
y& = r\sin{\theta}\\
x& = r\cos{\theta} \cdot \cos{\alpha}\\
z& = r\cos{\theta} \cdot \sin{\alpha}\\
\end{align}
{% endmath %}
至於Roll這個旋轉，較少出現在攝影機的移動中，不管遊戲還是編輯器中，所使用的攝影機多半是Pitch與Yaw的組合，也因此這裡不會有萬向鎖的問題。不過這裡要注意的是這裡的Yaw跟Pitch與歐拉角中的旋轉不相等，因為本文中的Pitch一次就動到了xyz三點的值，算是一種對任意軸的旋轉，而之前所介紹的旋轉公式是對固定軸，


## 透視投影與正交投影 ##
{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/pers-near.png" style="width: 300px">
		<p>透視投影 近物</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/pers-far.png" style="width: 300px">
		<p>透視投影 遠物</p>
	</div>
</div>
{% endraw %}
{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/ortho-near.png" style="width: 300px">
		<p>正交投影 近物</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/ortho-far.png" style="width: 300px">
		<p>正交投影 遠物</p>
	</div>
</div>
{% endraw %}
回顧一下之前看到的兩張圖，透視投影接近現實，越遠的物體就會越小。正交投影屬於理想向量世界，不管物體遠近，都會顯示他原本定義的大小。而不管透視或正交假想上都有一個遠盤(far plane)，跟一個近盤(near plane)，在兩盤之間的物體就會出現在畫面上，超出兩盤的都無法看見。

{% img "/images/OBT4/persproj.png" 300 %}

而這個階段的目的是為了將View階段的{% math %}x_{view},y_{view},z_{view},1{% endmath %}，轉換到Projection階段的{% math %}x_{clip},y_{clip},z_{clip},w_{clip}{% endmath %}，順道一提，clip space也可以稱為projection space。概念公式如下:
{% math %}
\begin{pmatrix}
x_{ndc} \\
y_{ndc} \\
z_{ndc} \\
1       \\
\end{pmatrix}
=
\begin{pmatrix}
\frac{x_{clip}}{w_{clip}} \\
\frac{y_{clip}}{w_{clip}} \\
\frac{z_{clip}}{w_{clip}} \\
\frac{w_{clip}}{w_{clip}} \\
\end{pmatrix}
{% endmath %}
算出Clip space後，交給OpenGL會自動用透視除法(perspective devision)，來轉成NDC空間的座標，而上方除以$w$的概念就是透視除法，也是齊次座標中所使用到的概念，因為{% math %}w_{clip}{% endmath %}，其實是view space的{% math %}z_{view}{% endmath %}。

###透視投影###
先從困難的透視投影講起，之後正交就簡單了，在這個階段主要有四個步驟，當然化為程式都是一個數學式，不過要理解透視投影的每個步驟就要一步一步分開詳細探討。

#### 第一步:X的線性投影 ####

{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/persUp.png" style="width: 300px">
		<p>從上方看透視投影區</p>
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/persSide.png" style="width: 300px">
		<p>從側邊看透視投影區</p>
	</div>
</div>
{% endraw %}

上圖中，e代表的是View Space中的座標，p代表projection座標，要注意的是，這並不是clip space，就是說這個階段是投影座標。
這個階段要產出的線性轉換如下:
{% math %}
\begin{align}
x_p& : x_e = -n : ze \\
x_p& = -n\frac{x_e}{z_e} = \frac{n x_e}{-z_e} \\
y_p& : y_e = -n : ze \\
y_p& = -n\frac{y_e}{z_e} = \frac{n y_e}{-z_e} \\
\end{align}
{% endmath %}

#### 第二步:壓縮至-1 ~ 1 ####
為何要壓縮至-1 ~ 1呢?這不是clip space到NDC空間才要由OpenGL轉換的嗎? 沒錯，不過投影階段直接就運算到最終的空間NDC，最後用了齊次座標的技巧，才讓NDC變回clip空間，接下來可以這技巧是如何變的，不過為什麼不直接給NDC給OpenGL，要換成clip space，個人臆測是因為OpenGL對深度有一個叫做Depth test或Stencil test的部分會用到。

首先將投影座標與Normalize後座標(NDC)的關係找出來:

{% raw %}
<div class="container-outside-div">
	<div class="container-inside-div">
		<img src="/images/OBT4/perswidthnormal.png" style="width: 300px">
	</div>
	<div class="container-inside-div">
		<img src="/images/OBT4/pershightnormal.gif" style="width: 300px">
	</div>
</div>
{% endraw %}

上方轉換成數學關係式如下:
{% math %}
\begin{align}
x_n& = a x_p + b\\
x_p& = r, x_n = 1 \\
1& = ar + b\\
x_p& = l, x_n = -1\\
-1& = al + b\\
a& = \frac{1-(-1)}{r-l} ,
b = \frac{l+r}{l-r} \\
x_n& = \frac{2}{r-l}x_p + \frac{l+r}{l-r}\\
\end{align}
{% endmath %}

側視圖的公式大同小異:
{% math %}
\begin{align}
y_n& = a y_p + c\\
y_p& = t, y_n = 1 \\
1& = ar + c\\
t_p& = l, t_n = -1\\
-1& = ab + c\\
a& = \frac{1-(-1)}{t-b} ,
c = \frac{b+t}{b-t} \\
y_n& = \frac{2}{t-b}x_p + \frac{b+t}{b-t}\\
\end{align}
{% endmath %}

#### 第三步:第一步代入第二步 ####
到這個步驟是view -> proj -> ndc -> clip，第一步找出view -> proj的關係，第二步找出proj -> ndc的關係，這裡當然就是要找出ndc -> clip的關係，以view表示，畢竟要將view轉到clip。那就直接進入數學式吧。
{% math %}
\bbox[5px,border:2px solid black] 
{
\begin{equation}
\begin{split}
x_n =& \frac{2}{r-l}x_p + \frac{l+r}{l-r} & x_p = \frac{n x_e}{-z_e}\\
	=& \frac{2}{r-l}x_p - \frac{l+r}{r-l}
	= \frac{2 \cdot \frac{n x_e}{-z_e} }{r-l} - \frac{l+r}{r-l}\\
	=& \frac{2 n x_e}{(r-l)(-z_e)} - \frac{l+r}{r-l}
	= \frac{\frac{2n}{r-l} \cdot x_e}{-z_e} - \frac{l+r}{r-l}\\
	=& \frac{\frac{2n}{r-l} \cdot x_e}{-z_e} + \frac{\frac{l+r}{r-l} \cdot z_e}{-z_e}
	= \frac{ \frac{2n}{r-l}\cdot x_e + \frac{l+r}{r-l} \cdot z_e }{-z_e}\\
	=& \frac{x_c}{-z_e} & x_c = \frac{2n}{r-l}\cdot x_e + \frac{l+r}{r-l} \cdot z_e \\
\end{split}
\end{equation}
}
{% endmath %}
根據以上的NDC與View之間的關係，得到一個新的Clip座標{% math %}x_c{% endmath %}，有發現為什麼$-z$會被留在那嗎? 那就是將齊次座標的概念留下，不過只看一個還看不出來，當每個座標都需要$-z$的輔助後，就會理解這樣的用意。不過還是要強調，這個步驟是將NDC的概念退回Clip的步驟，比較不是偏數學的概念，算是程式技巧才有Clip Space的存在。而y的方面就如同上方，讀者可以自行推導，直接進入下一步。

#### 第四步:建立矩陣與填補矩陣未知部分 ####
{% math %}
\begin{bmatrix} 
x_c \\
y_c \\
z_c \\
w_c \\
\end{bmatrix}
= 
\begin{bmatrix} 
\frac{2n}{r-l} & 0			    & -\frac{r+l}{r-l} & 0\\
0 			   & \frac{2n}{t-b} & \frac{t+b}{t-b} & 0\\ 
0			   & 0			    & A 			  & B\\
0			   & 0 			    & -1 			  & 0\\
\\
\end{bmatrix}
\begin{bmatrix}
x_e\\
y_e\\
z_e\\
w_e\\
\end{bmatrix}
{% endmath %}
首先前兩行(row)，就是我們第三步所推導的，而第四行只有一個$-1$，是因為已經決定讓{% math %} -z_e {% endmath %}，當作最後要做透視除法的參數，也許可以等第三行推完之後，參考本節一開始所說的概念公式，來理解這段。而第三行前兩個值是$0$，因為透視投影主要是將投影空間中依照深度距離不同位置的$x$,$y$，投影到近盤上，既然其他人都依賴{% math %} z_e {% endmath %}，{% math %} z_e {% endmath %}也就不會依賴回去。因此只剩下兩個未知參數需要處理，而View Space中{% math %} w_e {% endmath %}是$1$，因此B成為輔助參數，讓{% math %} z_c {% endmath %}與{% math %} z_e {% endmath %}建立線性關係，就變成以下的形式。
{% math %}
z_c = Az_e + B
{% endmath %}
而要轉換回可以逆推導的情形，必須轉回NDC，因為clip space本身並沒有實質意義，這部分對剛接觸的人會有很多困惑，因為前面都是正向工程，到這裡要推{% math %} z_c {% endmath %}卻要用逆向工程，返回{% math %} z_n {% endmath %}，在回到{% math %} z_c {% endmath %}。
{% math %}
z_n = \frac{z_c}{w_c} = \frac{Az_e + B}{-z_e} = \frac{A z_e + B}{-z_e}
{% endmath %}
其實這段Dowen嘗試過正向推導，不過由於沒有{% math %} z_p {% endmath %}與{% math %} z_e {% endmath %}的何關係式，所以推不出來。
{% math %}
\begin{align}
z_n& = \frac{A z_e + B}{-z_e}\\
z_n& = -1, z_e = -n \\
-n& = -An + B\\
z_n& = l, z_e = -f\\
-f& = -Af + B\\
a& = -\frac{f+n}{f-n} ,
b = -\frac{2fn}{f-n} \\
z_n& = \frac{ -\frac{f+n}{f-n}z_e-\frac{2fn}{f-n} }{-z_e}\\
\end{align}
{% endmath %}

回到矩陣的形式如下:
{% math %}
\begin{bmatrix} 
x_c \\
y_c \\
z_c \\
w_c \\
\end{bmatrix}
= 
\begin{bmatrix} 
\frac{2n}{r-l} & 0			    & -\frac{r+l}{r-l} & 0\\
0 			   & \frac{2n}{t-b} & \frac{t+b}{t-b} & 0\\ 
0			   & 0			    & -\frac{f+n}{f-n}& -\frac{2fn}{f-n}\\
0			   & 0 			    & -1 			  & 0\\
\\
\end{bmatrix}
\begin{bmatrix}
x_e\\
y_e\\
z_e\\
w_e\\
\end{bmatrix}
{% endmath %}

以上是最終矩陣，將View轉成Clip空間，而通常不會使用以上的矩陣。我們通常使用的是正方形近盤，所以將$t = r = -l = -b$，矩陣會變換如下:
{% math %}
\begin{bmatrix} 
\frac{n}{r} & 0			    & 0 & 0\\
0 			   & \frac{n}{r} & 0 & 0\\ 
0			   & 0			    & -\frac{f+n}{f-n}& -\frac{2fn}{f-n}\\
0			   & 0 			    & -1 			  & 0\\
\\
\end{bmatrix}
\begin{bmatrix}
x_e\\
y_e\\
z_e\\
w_e\\
\end{bmatrix}
{% endmath %}
接下來檢視一下OpenGL會用到的GLM函式`glm::perspective(fov, aspect, near, far)`。其矩陣原理如下:

{% math %}
\begin{bmatrix} 
X_{spec} & 0			    & 0 & 0\\
0 			   & Y_{spec} & 0 & 0\\ 
0			   & 0			    & -\frac{f+n}{f-n}& -\frac{2fn}{f-n}\\
0			   & 0 			    & -1 			  & 0\\
\\
\end{bmatrix}
{% endmath %}
{% math %}
\begin{align}
Y_{spec}& = \cot({fov/2}) \\
X_{spec}& = \frac{Y_{spec}}{aspect}
\end{align}
{% endmath %}

* fov: field of view，視野的意思，通常視野是$45°$，根據自定義而有所不同，至於為何是$cot$，看一下上上個矩陣，對邊分之鄰邊，而且視野只有一半。
* aspect: 視窗的比例，若視窗是500x500 這裡只要給1.0即可，若是800x600這裡就要給定800/600，在畫面就會顯示正常，原因是整個畫面要顯示-1 ~ 1的正方體，那x的部分就得多壓縮一點。

### 正交投影 ###

{% img "/images/OBT4/ortho.png" 300 %}

正交投影，直接將點平行投影到投影近盤上，所以不會有{% math %} x_p {% endmath %}與{% math %} x_e {% endmath %}不同的問題，直接做線性轉換至NDC。
{% math %}
\begin{align}
x_n& = \frac{2}{r-l}x_e - \frac{r+l}{r-l}\\
y_n& = \frac{2}{t-b}y_e - \frac{t+b}{t-b}\\
z_n& = \frac{-2}{f-n}z_e - \frac{f+n}{f-n}\\
\end{align}
{% endmath %}
由於{% math %} x_e {% endmath %}與 {% math %} x_n {% endmath %} 沒有像透視投影跟深度有關，所以矩正很簡單的如下:
{% math %}
\begin{bmatrix} 
\frac{2}{r-l} & 0			    & -\frac{r+l}{r-l} & 0\\
0 			   & \frac{2}{t-b} & -\frac{t+b}{t-b} & 0\\ 
0			   & 0			    & -\frac{2}{f-n}& -\frac{f+n}{f-n}\\
0			   & 0 			    & -1 			  & 0\\
\\
\end{bmatrix}
{% endmath %}


## 直線與曲線 ##

### 直線 ###
直線，最常想到的第一個公式是 $ y = ax + b $ ，但是利用向量表示，在電腦繪圖中反而會比較適合做Intepolation。向量表示如下:
{% math %}
\begin{align}
P& = A + t\vec{D}  \\
\vec{D}& = (B - A) \\
P& = A + t(B-A)    \\
\end{align}        
{% endmath %}
上方的公式意義是表示A要往B移動，如果t = 1，表示點P已經從A移動到B。小於1的任何數值都代表還在路途中，這樣的表示法比原本的表示法的移動模式要直觀許多。

{% img "/images/OBT4/line.png" 420 %}

{% blockquote %}
####Intepolation(內插)####
根據現有的資訊進行階段式前進，除了有關線的公式，利用向量步步前進的概念外，OpenGL在顏色上也有這樣的機制。Fragment Shader階段時，若使用者定義三個點各自的顏色，未給定其他像素的意義，OpenGL就會進行顏色的內插。假設有AB兩點，一者紅，一者藍，OpenGL就會自動用內插的方式進行顏色計算，概念如此: {% math %} Color_new = Color_A + t(Color_B - Color_A) = (1-t)Color_A + tColor_B $ {% endmath %}。而GLSL語法裡面進行這樣計算的是一個叫`mix(a, b, t)`的內建函式，專門用來處理以上的動作。
{% endblockquote %}


### 曲線 ###
最簡單的直線是利用兩條直線的方式混和移動而成，概念圖如下:

{% img "/images/OBT4/bicurve.png" 420 %}

{% math %}
\begin{align}
D& = A + t(B-A)	   \\
E& = B + t(C-B)	   \\
P& = D + t(E-D)	   \\
P& = A + t(B-A) + t( B+t(C-B) - (A+t(B-A)) )	   \\
P& = A + t(B-A) + Bt+t^2(C-B) - At - t^2(B-A))     \\
P& = A + t(B-A + B-A) + t^2(C-B-B-A)   		       \\
P& = A + 2t(B-A) + t^2(C-2B-A)   		           \\
\end{align}        
{% endmath %}
透過兩條線瞬間產生出來的點，在將這兩點做直線移動就是以上的概念，當初Dowen看了許久，到[這網站](http://pomax.github.io/bezierinfo/)才了解到為何可以這樣混合公式的最初契機。這邊小題外話，有時候數學無法理解，是因為很多網站都沒提到其細部概念，也就是最初觀察到此現象的由來或契機，只說這樣是對的，然後用一堆複雜的數學佐證，所以才導致學習有礙。

剛剛其實就是有名的貝茲曲線，而這裡是介紹三次貝茲曲線，如果看懂的話，不論幾次也能自己推導了。

{% img "/images/OBT4/cubiccurve.png" 420 %}

{% math %}
\begin{align}
E& = A + t(B-A)	   \\
F& = B + t(C-B)	   \\
G& = C + t(D-C)	   \\
H& = E + t(F-E)	   \\
I& = F + t(G-F)	   \\
P& = H + t(I-H)	   \\
\end{align}        
{% endmath %}

二次懂，三次問題就不大。這裡就提一個貝茲曲線上的專有名詞**Control Point**，像是上方二次貝茲的控制點就是ABC，三次是ABCD，藉由更改這些點的位置，就可以改變曲線角度，理解控制點，就可以微調算出想要的曲線角度了。


## GLM ##
[GLM(OpenGL Mathematics)](http://glm.g-truc.net/0.9.7/index.html)，是一個專門為OpenGL設計的數學函式庫，特別的是，它只需要將標頭檔加入，不需要引入lib，或是dll之類的組態檔，就可以引入環境中，所以不會有環境建置的困擾，首先只需要將[標頭檔資料夾](https://github.com/g-truc/glm/releases)放到適當的位置，之後加入Include，就完成基本的載入。

{% img "/images/OBT4/includeglm.png" 420 %}

之後加入泛用的程式標頭。
``` cpp
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
```

測試一下矩陣乘法，理解一下概念。
``` cpp
glm::mat4 helloMatrix = glm::mat4(glm::vec4(1.0), glm::vec4(2.0), glm::vec4(3.0), glm::vec4(4.0));
int mlenght = 16;
glm::vec4 helloVector = glm::vec4(1.0f, 0.0f, 1.0f, 0.0f);
int vlenght = helloVector.length();
float *matrix = glm::value_ptr(helloMatrix);
float *vector = glm::value_ptr(helloVector);
glm::vec4 vresult = helloMatrix * helloVector;
float *result = glm::value_ptr(vresult);

std::cout << "Matrix:" << std::endl;
for (int i = 0; i < mlenght; i++)
{
	std::cout << matrix[i] << ",";
	if((i+1)%4 == 0)
		std::cout << std::endl;
}
std::cout << std::endl;
std::cout << "Vector:" << std::endl;
for (int i = 0; i < vlenght; i++)
{
	std::cout << vector[i] << ",";
	if (i % 4 == 0 && i != 0)
		std::cout << std::endl;
}
std::cout << std::endl;
std::cout << "Result:" << std::endl;
for (int i = 0; i < vlenght; i++)
{
	std::cout << result[i] << ",";
	if (i % 4 == 0 && i != 0)
		std::cout << std::endl;
}
```
這會產生的結果如下:

{% img "/images/OBT4/glmresult.png" 420 %}

有發現結果不是正常的矩陣運算嗎?因為OpenGL在定義矩陣的時候都是先定義Column，再來才是Row，用數學來檢視一下結果的原因吧。
{% math %}
\begin{bmatrix}
1&1&1&1 \\
2&2&2&2 \\
3&3&3&3 \\
4&4&4&4 \\
\end{bmatrix}
\begin{bmatrix}
1       \\
0		\\
1		\\
0	    \\
\end{bmatrix}
=
\begin{bmatrix}
2       \\
4		\\
6		\\
8	    \\
\end{bmatrix}
{% endmath %}
上面如果是想要的結果，但實際上定義的向量是這樣被矩陣擺放的:
{% math %}
\begin{bmatrix}
1&2&3&4 \\
1&2&3&4 \\
1&2&3&4 \\
1&2&3&4 \\
\end{bmatrix}
\begin{bmatrix}
1       \\
0		\\
1		\\
0	    \\
\end{bmatrix}
=
\begin{bmatrix}
4       \\
4		\\
4		\\
4	    \\
\end{bmatrix}
{% endmath %}
因此，如果要修正的話必須要改成如下形式:
``` cpp
//glm::mat4 helloMatrix = glm::mat4(glm::vec4(1.0), glm::vec4(2.0), glm::vec4(3.0), glm::vec4(4.0));
glm::mat4 helloMatrix = glm::mat4(glm::vec4(1.0,2.0,3.0,4.0), glm::vec4(1.0, 2.0, 3.0, 4.0), 
``` 
這樣結果就修改完成了。

{% img "/images/OBT4/glmcorrectresult.png" 420 %}

而`glm::value_ptr`這個函式，原始的定義是根據傳入GLM的參數，根據其最原始型態傳回該參數的指標。而本範例是傳入GLM矩陣、向量，使其傳回浮點數指標，或說是一段float陣列。


## 其他 ##
#### [四元數][3] ####
#### [不同的曲線](https://www.youtube.com/watch?v=LFFPbBe7aAs) ####
#### [攝影機加入Roll旋轉](http://in2gpu.com/2016/03/14/opengl-fps-camera-quaternion/) ####


## 結語 ##
在研究OpenGL上面會碰到很多數學，但是如果找對適當的文章或是解釋，就能打通那任督二脈。而Dowen就是那種需要自己尋找能理解的文章的人。因為有些網站，或是學校的教學方式，就是教學者自己沒咀嚼好，就抽象地教給學習者，所以導致教者不知學者所礙，中間有代溝。Dowen寫的教學文主要是想解決這樣的代溝，所以努力地做圖跟以自己曾經的困惑，自問自答的方式來幫助有同樣困惑的讀者。不過比較差的是以藍寶書的章節為出文的篇幅，如果以後有足夠的經驗與時間，也許會重新製作一份真正的初心者教學吧!

[1]: http://www.martinkeefe.com/math/mathjax2 "math"
[2]: http://inside.mines.edu/fs_home/gmurray/ArbitraryAxisRotation/ "AARotation"
[3]: http://www.3dgep.com/understanding-quaternions/ "四元數"
[4]: https://www.youtube.com/watch?v=zc8b2Jo7mno "Gimbal Lock"