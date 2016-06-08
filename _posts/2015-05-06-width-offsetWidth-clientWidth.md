---
layout: post
title: width offsetWidth clientWidth比较
---

<h1>{{ page.title }}</h1>

06 May 2015 - Beijing


1、offsetWidth (width+padding+border)
<br>表示当前对象的宽度，style.width也是当前对象的宽度(width+padding+border)。
<br>区别：
<br>1)style.width返回值除了数字外还带有单位px；
<br>2)如对象的宽度设定值为百分比宽度,则无论页面变大还是变小，style.width都返回此百分比,而offsetWidth则返回在不同页面中对象的宽度值而不是百分比值；
<br>3)如果没有给 HTML 元素指定过 width样式，则 style.width 返回的是空字符串；
<br>2.clientWidth(不包括border)
<br>获取对象可见内容的宽度，不包括滚动条，不包括边框；
