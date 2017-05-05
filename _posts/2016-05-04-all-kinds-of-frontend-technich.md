---
layout: post
title: all kinds of techniche conclusion
---

generator分享

对于generator，最为一种生成器，是第一个被引入JS中的生成器，在1980年前，generator的前身是由芝加哥大学（记着是这个大学）的一个教授和几个 学生一起研究出来的函数编程，重点是两部分，yield和next，继promise后又一个异步解决方案，生成器中的每个yield可以理解成把蛋糕切片， 各个yield组成各个断点，每次执行到yield就会中断，然后把yield后面的语句带入主进程，这时候就需要执行next让程序重新回到生成器中。相关技术链接：  

        http://mp.weixin.qq.com/s?__biz=MzAwNTAzMjcxNg==&mid=2651424702&idx=1&sn=15264a8010f38ff7b9f70beceeab615f&scene=23&srcid=0606ekAquOn0wSWr5QMT9sIk#rd

react经验分享

react逻辑： 1.页面加载直接触发的方法，componentDidmount通过调用mapdispatchtoprops中的动作来请求数据，走axios方法，同时经过promiseMiddware中间件，把请求回来的数据放到json中，同时取得用户数据。这时候action方法返回type和promise，这时候就把数据存储到reducer中，通过json.data取得请求回来的数据。然后在组件中，通过mapstatetoprops把reducer中的数据转化为props，通过props把数据传输到子组件中。 2.通过mapdispatchtoprops和bindactioncreators然组件在没有意识到store的情况下把动作引入组件，绑定到组件中，这些动作可以归类为用户交互行为动作，需要用户触发的事件，然后把事件传递到子组件中。

"spread operator": vs "object spread syntax"
首先引入一个对象合并常用的用法，Object.assign，举个栗子:"Object.assign({}, state, newData),_defaults( );".
如果感觉这种方法比较麻烦就是时候引入"object spread syntax"了，替换上面栗子"object spread syntax:return { ...state, visibilityFilter: action.filter };".其中...state表示复制对象，这时候就不需要担心合并对象覆盖的问题了。
"spread operator"，先看一个例子，"[a, b, ...iterableObj] = [1, 2, 3, 4, 5];"其中...iterableObj表示扩展整个数组除去1，2元素的剩余部分。
