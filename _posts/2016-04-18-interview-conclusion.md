---
layout: post
title: interview conclusion
---

<br>最近面试遇到一个关于object.create方法的实现，当时回答想到的方法是通过直接new一个参数，当时面试官提到没法保证参数是构造函数。回来看了一下underscore源码发现了一种实现方法。

        var baseCreate = function(prototype) {
           var Ctor = function(){};   //define a null function,used its prototype
             propertity with the prototype argument.
           if (!_.isObject(prototype)) return {};
           if (nativeCreate) return nativeCreate(prototype);  
           // nativeCreate construct to the object.create function.
           Ctor.prototype = prototype;  //this is the important.
           var result = new Ctor;   //new a construct function.
           Ctor.prototype = null;   //clear the occupation.
           return result;
         };

<br>
