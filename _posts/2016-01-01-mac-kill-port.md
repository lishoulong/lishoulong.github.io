---
layout: post
title: webpack loaders
---

<h1>{{ page.title }}</h1>

10 Nov 2015 - Beijing

<br>最近在用mongodb的时候遇到一个问题，启动mongod 时，出现addr already in use错误。对于windows or linux来说，用如下命令：
        netstat -anp tcp | grep 3000
<br>对于OSX "El Capitan" 或者 if your netstat doesn't support -p，利用：
        lsof -i tcp:27017 | xargs kill
