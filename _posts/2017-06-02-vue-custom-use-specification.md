---
layout:     post
title:      "vue团队使用规范"
subtitle:   "那些年踩过的vue坑"
date:       2017-06-02 12:00:00
author:     "Fred"
catalog:    true
tags:
    - vue
    - vue-router
---

# 原则简述
*  父组件负责拉接口，子组件负责展示页面，保持数据的单向流动。
*  如果能够用组件解决问题，就尽量不要起一个新的路由。
*  注意keep-alive引起的一些坑，例如导致同类型页面跳转导致一些生命周期方法不执行。
*  可以在beforeEach hook中做一些进入路由以前需要做的事情，例如登陆。
*  尽量不用全局的事件系统，很多事件没法reason，如果很多同级别组件交互，可以考虑引入vuex。

# 基于模块开发
始终基于模块的方式来构建你的 app，每一个子模块只做一件事情。

Vue.js 的设计初衷就是帮助开发者更好的开发界面模块。一个模块是应用程序中独立的一个部分。

## 怎么做？

每一个 Vue 组件（等同于模块）首先必须专注于解决一个单一的问题，独立的、可复用的、微小的 和 可测试的。

如果你的组件做了太多的事或是变得臃肿，请将其拆分成更小的组件并保持单一的原则。一般来说，尽量保证每一个文件的代码行数不要超过 100 行。也请保证组件可独立的运行。比较好的做法是增加一个单独的 demo 示例。


# Vue 组件命名
组件的命名需遵从以下原则：

*  有意义的: 不过于具体，也不过于抽象
*  简短: 2 到 3 个单词
*  具有可读性: 以便于沟通交流
同时还需要注意：

*  必须符合自定义元素规范: 使用连字符分隔单词，切勿使用保留字。
*  app- 前缀作为命名空间: 如果非常通用的话可使用一个单词来命名，这样可以方便于其它项目里复用。

## 为什么？
*  组件是通过组件名来调用的。所以组件名必须简短、富有含义并且具有可读性。
## 怎么做？

	```
	<!-- 推荐 -->
	<app-header></app-header>
	<user-list></user-list>
	<range-slider></range-slider>

	<!-- 避免 -->
	<btn-group></btn-group> <!-- 虽然简短但是可读性差. 使用 `button-group` 替代 -->
	<ui-slider></ui-slider> <!-- ui 前缀太过于宽泛，在这里意义不明确 -->
	<slider></slider> <!-- 与自定义元素规范不兼容 -->
	```
# 组件表达式简单化

Vue.js 的表达式是 100% 的 Javascript 表达式。这使得其功能性很强大，但也带来潜在的复杂性。因此，你应该尽量保持表达式的简单化。

## 为什么？

*  复杂的行内表达式难以阅读。
*  行内表达式是不能够通用的，这可能会导致重复编码的问题。
*  IDE 基本上不能识别行内表达式语法，所以使用行内表达式 IDE 不能提供自动补全和语法校验功能。
## 怎么做？

如果你发现写了太多复杂并难以阅读的行内表达式，那么可以使用 method 或是 computed 属性来替代其功能。

	```
	<!-- 推荐 -->
	<template>
	  <h1>
	    {{ `${year}-${month}` }}
	  </h1>
	</template>
	<script type="text/javascript">
	  export default {
	    computed: {
	      month() {
	        return this.twoDigits((new Date()).getUTCMonth() + 1);
	      },
	      year() {
	        return (new Date()).getUTCFullYear();
	      }
	    },
	    methods: {
	      twoDigits(num) {
	        return ('0' + num).slice(-2);
	      }
	    },
	  };
	</script>

	<!-- 避免 -->
	<template>
	  <h1>
	    {{ `${(new Date()).getUTCFullYear()}-${('0' + ((new Date()).getUTCMonth()+1)).slice(-2)}` }}
	  </h1>
	</template>
	```

# 组件 props 原子化

虽然 Vue.js 支持传递复杂的 JavaScript 对象通过 props 属性，但是你应该尽可能的使用原始类型的数据。尽量只使用 JavaScript 原始类型（字符串、数字、布尔值）和函数。尽量避免复杂的对象。

## 为什么？

*  使得组件 API 清晰直观。
*  只使用原始类型和函数作为 props 使得组件的 API 更接近于 HTML(5) 原生元素。
*  其它开发者更好的理解每一个 prop 的含义、作用。
*  传递过于复杂的对象使得我们不能够清楚的知道哪些属性或方法被自定义组件使用，这使得代码难以重构和维护。
## 怎么做？

组件的每一个属性单独使用一个 props，并且使用函数或是原始类型的值。
	```
	<!-- 推荐 -->
	<range-slider
	  :values="[10, 20]"
	  min="0"
	  max="100"
	  step="5"
	  :on-slide="updateInputs"
	  :on-end="updateResults">
	</range-slider>

	<!-- 避免 -->
	<range-slider :config="complexConfigObject"></range-slider>
	```

# 将 this 赋值给 component 变量

在 Vue.js 组件上下文中，this指向了组件实例。因此当你切换到了不同的上下文时，要确保 this 指向一个可用的 component 变量。

换句话说，不要在编写这样的代码 const self = this; ，而是应该直接使用变量 component。

## 为什么？

*  将组件 this 赋值给变量 component可用让开发者清楚的知道任何一个被使用的地方，它代表的是组件实例。
## 怎么做？
	```
	<script type="text/javascript">
	export default {
	  methods: {
	    hello() {
	      return 'hello';
	    },
	    printHello() {
	      console.log(this.hello());
	    },
	  },
	};
	</script>

	<!-- 避免 -->
	<script type="text/javascript">
	export default {
	  methods: {
	    hello() {
	      return 'hello';
	    },
	    printHello() {
	      const self = this; // 没有必要
	      console.log(self.hello());
	    },
	  },
	};
	</script>
	```

# 组件结构化

按照一定的结构组织，使得组件便于理解。

## 为什么？

*  导出一个清晰、组织有序的组件，使得代码易于阅读和理解。同时也便于标准化。
*  按首字母排序 properties、data、computed、watches 和 methods 使得这些对象内的属性便于查找。
*  合理组织，使得组件易于阅读。（name; extends; props, data 和 computed; components; watch 和 methods; lifecycle methods 等）。
*  每个组件，把相应的vue，css文件放入同一个文件夹下。
## 怎么做？

组件结构化
	```
	<template lang="html">
	  <div class="Ranger__Wrapper">
	    <!-- ... -->
	  </div>
	</template>

	<script type="text/javascript">
	  export default {
	    // 不要忘记了 name 属性
	    name: 'RangeSlider',
	    // 组合其它组件
	    extends: {},
	    // 组件属性、变量
	    props: {
	      bar: {}, // 按字母顺序
	      foo: {},
	      fooBar: {},
	    },
	    // 变量
	    data() {},
	    computed: {},
	    // 使用其它组件
	    components: {},
	    // 方法
	    watch: {},
	    methods: {},
	    // 生命周期函数
	    beforeCreate() {},
	    mounted() {},
	  };
	</script>

	<style scoped>
	  .Ranger__Wrapper { /* ... */ }
	</style>
	```

# 组件事件命名

Vue.js 提供的处理函数和表达式都是绑定在 ViewModel 上的，组件的每一个事件都应该按照一个好的命名规范来，这样可以避免不少的开发问题，具体可见如下 为什么。

## 为什么？
*  开发者可以随意给事件命名，即使是原生事件的名字，这样会带来迷惑性。
*  过于宽松的事件命名可能与 DOM 模板不兼容。

## 怎么做？
*  事件名也使用连字符命名。
*  一个事件的名字对应组件外的一组意义操作，如：upload-success、upload-error 以及 dropzone-upload-success、dropzone-upload-error （如果需要前缀的话）。
*  事件命名应该以动词（如 client-api-load） 或是 形容词（如 drive-upload-success）结尾。

# 避免 this.$parent

Vue.js 支持组件嵌套，并且子组件可访问父组件的上下文。访问组件之外的上下文违反了基于模块开发的第一原则。因此你应该尽量避免使用 this.$parent。

## 为什么？
*  组件必须相互保持独立，Vue 组件也是。如果组件需要访问其父层的上下文就违反了该原则。
*  如果一个组件需要访问其父组件的上下文，那么该组件将不能在其它上下文中复用。

## 怎么做？
*  通过 props 将值传递给子组件。
*  通过 props 传递回调函数给子组件来达到调用父组件方法的目的。
*  通过在子组件触发事件来通知父组件。

# 使用组件名作为样式作用域空间

Vue.js 的组件是自定义元素，这非常适合用来作为样式的根作用域空间。可以将组件名作为 CSS 类的命名空间。

## 为什么？

*  给样式加上作用域空间可以避免组件样式影响外部的样式。
*  保持模块名、目录名、样式根作用域名一样，可以很好的将其关联起来，便于开发者理解。
## 怎么做？

使用组件名作为样式命名的前缀，可基于 BEM 或 OOCSS 范式。同时给 style 标签加上 scoped 属性。加上 scoped 属性编译后会给组件的 class 自动加上唯一的前缀从而避免样式的冲突。

	```
	<style scoped>
	  /* 推荐 */
	  .MyExample { }
	  .MyExample li { }
	  .MyExample__item { }

	  /* 避免 */
	  .My-Example { } /* 没有用组件名或模块名限制作用域, 不符合 BEM 规范 */
	</style>
	```

# 只在需要时创建组件

## 为什么？

Vue.js 是一个基于组件的框架。如果你不知道何时创建组件可能会导致以下问题：

*  如果组件太大, 可能很难重用和维护;
*  如果组件太小，你的项目就会（因为深层次的嵌套而）被淹没，也更难使组件间通信;
## 怎么做?

*  始终记住为你的项目需求构建你的组件，但是你也应该尝试想到它们能够从中脱颖而出（独立于项目之外）。如果它们能够在你项目之外工作，就像一个库那样，就会使得它们更加健壮和一致。
*  尽可能早地构建你的组件总是更好的，因为这样使得你可以在一个已经存在和稳定的组件上构建你的组件间通信（props & events）。
## 规则

*  首先，尽可能早地尝试构建出诸如模态框、提示框、工具条、菜单、头部等这些明显的（通用型）组件。总之，你知道的这些组件以后一定会在当前页面或者是全局范围内需要。
*  第二，在每一个新的开发项目中，对于一整个页面或者其中的一部分，在进行开发前先尝试思考一下。如果你认为它有一部分应该是一个组件，那么就创建它吧。
*  最后，如果你不确定，那就不要。避免那些“以后可能会有用”的组件污染你的项目。它们可能会永远的只是（静静地）待在那里，这一点也不聪明。注意，一旦你意识到应该这么做，最好是就把它打破，以避免与项目的其他部分构成兼容性和复杂性。
