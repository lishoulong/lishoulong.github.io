---
layout: post
title: angular2－总览
---

<h1>{{ page.title }}</h1>

02 June 2016 - Beijing
<br>angular1和angular2大的变动部分：
<br>广义上讲：
<br>angular1包含5部分：
<ul>
 <li>Directives</li>
 <li>Controllers</li>
 <li>Scopes</li>
 <li>Services</li>
 <li>Dependency Injection</li>
</ul>

然后angular干掉了：
<ul>
 <li>$scope (双向数据绑定，当然angular2通过'([value1])=value2'的方式也可以实现双向数据绑定)</li>
 <li>Directive Definition Objects</li>
 <li>Controllers</li>
 <li>angular.module</li>
</ul>
angular2:
<ul>
 <li>Components (可以想象成“directives”)</li>
 <li>Services;(当然相应的引进了DI，zones等。)</li>
</ul>

Checking for changes:
<br>In order to evaluate what changed, Angular provides differs. Differs will evaluate a given property of your directive to determine what changed.
<br>There are two types of built-in differs: iterable differs and key-value differs.
<br>Iterable differs
  <br>Iterable differs should be used when we have a list-like structure and we’re only interested on knowing things that were added or removed from that list.
<br>Key-value differs
  <br>Key-value differs should be used for dictionary-like structures, and it works at the key level. This differ will identify changes when a new key is added, when a key removed and when the value of a key changed.
<br>Zones确实很强大了，Zones检测的场景一般在如下几方面，
<br>1.当Dom Event触发的时候。（例如click，change等）
<br>2.当一个HTTP请求被解析的时候。
<br>3.当一个计时器被触发的时候。（例如SetTimeout或者SetInterval）
<br>但是有几个方面Zones是检测不到了，主要是如下场景
<br>1.当异步执行一个第三方库的时候。
<br>2.对于不可改变的数据（immutable data）
<br>3.Observables（是Rxjs的一部分，也是异步的解决方案，同时是处理数据的一种方案。）
<br>这时候ChangeDetectionStrategy.OnPush就可以解决这些场景。

<br>angular2核心库常用组件：
<br>@angular/common：<br>CORE_DIRECTIVES,FORM_DIRECTIVES,FormBuilder,ControlGroup,Validators,AbstractControl,Control，
 ROUTER_DIRECTIVES,ROUTER_PROVIDERS,RouteDefinition,RouterLocationStrategy,HashLocationStrategy,APP_BASE_HREF,CORE_DIRECTIVES,NGIF,

<br>@angular/core核心库常用组件：
<br>生命周期类型：<br>Oninit,OnDestroy,DoCheck,Onchanges,AfterViewInit,AfterViewChecked,AfterContentinit,AfterContentChecked,
<br>DI类型：Injectable,bind,Inject,provide,ReflectiveInjector,
<br>常用类型：Directive,Query,QueryList,ContentChildren,EventEmitter,
<br>Ref类型：ElementRef,viewContainerRef,TemplateRef,
<br>detection类型：ChangeDetectionStrategy,ChangeDetectorRef,

<br>@angular/http核心库常用组件：
<br>HTTP,Response,HTTP_PROVIDERS,BrowserXhr,Headers,RequestOptions,URLSearchParams.

<br>@angular/router-deprecated核心库常用组件：
<br>常用部分：@RouteConfig,RouterLink,RouterOutlet
<br>ROUTER_PROVIDERS,ROUTER_DIRECTIVES,RouteRegistry,Location,RouteParams,
<br>Router,ROUTER_PRIMARY_COMPONENT.
<br>尤其是：RouterOutlet对应angular1的ui-view;routerLink对应angular1的ui-sref;
<br>定义basehref的两种方式：
<br>1.bootstrap(RoutesDemoApp,[ROUTER_PROVIDERS,provide(APP_BASE_HREF,{useValue:'/'})]);
<br>2.在index.html中，<base href="/">.

<br>Dependency Injection
<br><br>Dependency Injection in Apps
<br>When writing our apps there are three steps we need to take in order to perform an injection:
<br>1. Create the service class
<br>2. Declare the dependencies on the receiving component and
<br>3. Configure the injection (i.e. register the injection with Angular)
<br>configure the injection
<br>• Inject a (singleton) instance of a class
<br>• Call any function and inject the return value of that function
<br>• Inject a value
<br>• Create an alias

<br>typescript:
<br>1.constructor中，当用public定义变量的时候，例如，

        "constructor(
            @inject('pinService') public pinService: pinService
          )"

<br>这里public的用法是，首先在这个class上定义变量pinService，把解析@inject('pinService')后的值赋给pinService，其次是下面就可以直接用this.pinService来调用这个变量了，也就是直接把变量绑定到this上。

<br>Built-in Components:
<br>1.
<br>ngIf:used when you want to display or hide an element based on a condition
<br>example:"<div *ngIf="false"></div>"
<br>2.
<br>NgSwitch:Sometimes you need to render different elements depending on a given condition.
<br>example:

        "<div class="container">
          <div *ngIf="myVar == 'A'">Var is A</div>
          <div *ngIf="myVar == 'B'">Var is B</div>
          <div *ngIf="myVar != 'A' && myVar != 'B'">Var is something else</div>
        </div>"

<br>or
        "<div class="container" [ngSwitch]="myVar">
            <div *ngSwitchWhen="'A'">Var is A</div>
            <div *ngSwitchWhen="'B'">Var is B</div>
            <div *ngSwitchDefault>Var is something else</div>
        </div>
        "
<br>3.
<br>NgStyle:With the NgStyle directive, you can set a given DOM element CSS properties from Angular expressions.
<br>example:

        "<div [ngStyle]="{color: 'white', 'background-color': 'blue'}">
        Uses fixed white text on blue background
        </div>
        <div [style.background-color]="colorinput.value" style="color: white;">
        {{ colorinput.value }} background </div>
        "

<br>4.
<br>NgClass:The first way to use this directive is by passing in an object literal. The object is expected to have the keys as the class names and the values should be a truthy/falsy value to indicate whether the class should be applied or not.
<br>example:

        ".bordered {
        border: 1px dashed black; background-color: #eee;
        }
        <div [ngClass]="{bordered: false}">
          This is never bordered</div>
          <div [ngClass]="{bordered: true}">
          This is always bordered</div>
        </div>
        "

<br>5.
<br>NgFor:The role of this directive is to repeat a given DOM element (or a collection of DOM elements), each time passing it a different value from an array.
<br>examples:

          this.cities = ['Miami', 'Sao Paulo', 'New York'];
          <h4 class="ui horizontal divider header"> Simple list of strings
          </h4>
          <div class="ui list" *ngFor="let c of cities";let num = index">
          <div class="item">{{ c }}</div></div>

<br>6.
<br>NgNonBindable:We use ngNonBindable when we want tell Angular not to compile or bind a particular section of our page.
<br>examples:

        "<div>
          <span class="bordered">'{{'content '}}'</span>
          <span class="pre" ngNonBindable>&larr; This is what'{{ 'content' }}'rendered </span>
        </div>"

<br> Angular2 Router:
<br>1.改变路由从一个url到另一个url的过程如下：
<div class="router-image"><img src="../../../images/router-change.jpeg"></div>
<br>比如从lonin route到protected route 经历如下阶段：
<br>1. LoginComponent.canReactivate if return is false, stops;
<br>2. LoginComponent.canDeactivate if return is false, stops;
<br>3. ProtectedComponent.instantiate;
<br>4. ProtectedComponent.canActivate if return is false, stops;
<br>5. LoginComponent.deactivate;
<br>6. ProtectedComponent.activate;
