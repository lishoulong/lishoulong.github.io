---
layout: post
title: question－aggregate
---

1.关于immutablejs：
immutable.js，当取得后台返回的数据，赋值改reducer的时候，利用map遍历items中的每个item，通过item.get('_id')==action.cid判断该把回复的数据添加到哪个item上的时候，chrome报错是，item.get() is not a function,然后我在safari尝试是没有问题的，难道immutable对于chrome兼容的不好么？
