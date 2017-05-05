---
layout: post
title: var,let and const
---

<br>let:（1）它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。
for example:

        {
          let a = 10;
          var b = 1;
        }
        a // ReferenceError: a is not defined.
        b // 1

        var a = [];
        for (var i = 0; i < 10; i++) {
          a[i] = function () {
            console.log(i);
          };
        }
        a[6]();    //10,因为var全局有效所以后一个值会覆盖前一个值。

        var a = [];
        for (let i = 0; i < 10; i++) {
          a[i] = function () {
            console.log(i);
          };
        }
        a[6]();  //6，因为每个i只在所在块内有效。那是是不是可以在有些场景下用let替代计数器呢？

<br>(2)不存在变量提升。

        console.log(foo); // 输出undefined
        console.log(bar); // 报错ReferenceError

        var foo = 2;
        let bar = 2;

<br>(3)暂时性死区

        var tmp = 123;

        if (true) {
          tmp = 'abc'; // ReferenceError,因为块级作用域内let又声明了一个局部变量tmp，
          导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错。
          let tmp;
        }

<br>纠正阮老师ES6入门书籍的错误。

        {
          let a = 'secret';
          function f() {
            return a;
          }
        }
        f(); // 报错    （但是在chrome运行后，这个是可以返回结果的，“secret”）

        let f;
        {
          let a = 'secret';
          f = function () {
            return a;
          };
        }
        f(); // "secret"    （这个反而是错的，运行后console报错，f重复定义

        ）

<br>const:const一旦初始化就不能在对其值做出更改了，有种情况比较特殊，需要注意，那就是如果初始化为对象的话，那么可以改变对象key，value中的value，因为对对象的应用还是没有改变的。例如：

        const foo = { bar: 'baz' };
        foo.bar = 'boo'

是不会报错的。
