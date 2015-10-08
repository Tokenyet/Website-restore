title: OpenCV例外狀況
date: 2015-10-08 13:12:51
categories : [OpenCV]
tags: [OpenCV,EmguCV,Exception,Visual Studio]
---

前言:
在使用EmguCV的時候，常常在自己的電腦可以，換到其他人電腦的環境後，就萬事皆悲。
而在這裡，Dowen寫下幾種解法供大家參考。這裡以EmguCv為例。


# 針對 TypeInitializer Exception 錯誤

解法1. 查看自己的環境設定是否有設定好
沒事的話環境PATH的地方建議設定x86即可
然後再試試看能不能執行。


解法2. 在Visual Studio加入參考的地方加入 `cvextern.dll, Emgu.CV.dll, Emgu.CV.UI.dll, Emgu.Util.dll`
然後再執行看看是否能運行。
建議測試的時候可以加入指令測試。


``` C#
using Emgu.CV;
using Emgu.CV.Structure;

Image<Bgra,Byte> test = new Image<Bgra,Byte>(1,1);

```

解法3. 如果最後還是搞不定請將 `emgucv-windows-universal 2.4.10.1940\bin\x86`下所有檔案
複製到你專案底下的 `Debug\bin\` 裡面(執行檔.EXE的旁邊)。


總結一下，解法3應該是最後的方法，因為如果將Dll丟進專案內會導致環境變大。
對了，為什麼只有針對 TypeInitializer Exception 呢?因為目前還沒遇到其他例外。
如往後有遇到在補上囉。