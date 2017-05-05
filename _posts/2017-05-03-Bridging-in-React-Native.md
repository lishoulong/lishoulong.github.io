---
layout:     post
title:      "Bridging in React Native"
subtitle:   "An in-depth look into React Native's core"
date:       2017-05-04 12:00:00
author:     "Fred"
tags:
    - rn
    - native
---

> 这篇文章转载自(https://tadeuzagallo.com/blog/react-native-bridge/)


<div>
    <blockquote>如果您已经了解了rn（react-native）的基础，并且想了解js和native是如何交互的内部机制，那么欢迎看这篇文章。</blockquote>

    <br><b>Main Threads</b>

    <br>再开始之前，需要了解rn中有3个主线程：
    * shadow quene: layout发生的地方
    * main thread： UIKiK工作的地方
    * JavaScript thread： JS代码运行的线程
    <blockquote>"shadow quene" 实际上如名字所示是GCD Queen而不是一个线程</blockquote>

    <br><b>Native Modules</b>
    <br>如何你还不知道如何创建原生模块，那么建议读读<a data-hash="8ffb556cbebb0cfe22aa194ff89b635d" href="http://facebook.github.io/react-native/docs/native-modules-ios.html#content" class="member_mention" data-editable="true" data-title="官方文档" data-tip="p$b$8ffb556cbebb0cfe22aa194ff89b635d"> 官方文档</a>。
    <br>下面是一个Person原生模块的例子，既接收来自js的调用，也调用js。

          @interface Person : NSObject <RCTBridgeModule>
          @end

          @implementation Logger

          RCT_EXPORT_MODULE()

          RCT_EXPORT_METHOD(greet:(NSString *)name)
          {
            NSLog(@"Hi, %@!", name);
            [_bridge.eventDispatcher sendAppEventWithName:@"greeted"
                                                     body:@{ @"name": name }];
          }

          @end

    <br>我们将着重分析 RCT_EXPORT_MODULE 和 RCT_EXPORT_METHOD，看看他们扩展层什么，他们的角色，以及他们是如何工作的。

    <br><b>RCT_EXPORT_MODULE([js_name])</b>
    <br>正如名字暗示的，它导出你的模块，但是在这个环境中export真正的含义是什么呢？它意味着让桥梁注意到你注册的模块。

    它的定义很简单：

          #define RCT_EXPORT_MODULE(js_name) \
            RCT_EXTERN void RCTRegisterModule(Class); \
            + (NSString \*)moduleName { return @#js_name; } \
            + (void)load { RCTRegisterModule(self); }

    <br>它究竟做了什么了呢：

    <ul>
      <li>首先定义RCT_EXPORT_MODULE作为extern函数，意味着函数的执行在编译时是不可见的，在link的时候是可见的，然后</li>
      <li>定义了moduleName方法，返回可选的参数js_name，在js中模块的名字就是这个名字，最后</li>
      <li>定义一个load方法（当应用载入内存的时候，将会对每个class调用load方法）调用上面定义的RCTRegisterModule函数，让桥能够真正的注意到这个模块</li>
    </ul>

    <br><b>RCT_EXPORT_METHOD(method)</b>

    <br>这个概念就更有意思了，它没有添加任何东西到你实际的方法上，它实际上创建了一个新方法，并且定义了指定的这个方法。

    <br>这个新的方法就长成下面这样：

          + (NSArray *)__rct_export__120
          {
            return @[ @"", @"log:(NSString *)message" ];
          }

    <br>它是由前缀（__rct_export）和可选的 js_name （这里是空的）以及定义的行号（例如： 12），还有__COUNTER__，这几部分拼接成的。
    <br>这个方法的目的仅仅是返回包含可选的 js_name 和方法签名的数组，这个名字的hack仅仅是避免命名冲突。

    <br><b>Runtime</b>

    <br>上面这些全部的设置仅仅是给桥梁提供信息，所以桥能够找到导出的全部模块和相应的方法，然而这些都发生在加载的时候，现在让我们看看在运行时都发生了什么。

    <br>下面是桥的初始化依赖图：

    ![](/img/in-post/briding-in-react/bridgeGraph.png)

    <br><b>Initialise Modules</b>
    <br>RCTRegisterModule函数做的全部事情就是把class添加到一个数组中，所以稍后桥的实例创建成功的时候，让桥能够找到它。桥遍历模块数组，为每个模块创建一个实例，并且为桥建立一个引用，同时让模块也能引用到桥，这样就建立了一个双向的联系，并且检查模块是否指定了要在那个queue运行，如果没有指定的化，我们就为其建立一个独立与其他所有模块的单独的queue。

          NSMutableDictionary *modulesByName; // = ...
          for (Class moduleClass in RCTGetModuleClasses()) {
          // ...
          module = [moduleClass new];
          if ([module respondsToSelector:@selector(setBridge:)]) {
          module.bridge = self;
          }
          modulesByName[moduleName] = module;
          // ...
          }

    <br><b>Configure Modules</b>
    <br>一旦我们在后台后台线程中有了模块，我们列出每个模块对应的所有方法，并且调用名字以__rct_export__开头的方法，所以我们得到了代表方法签名的字符串。所以我们就得到了参数的实际类型，也就是，在运行时我们仅仅能够知道一个参数是一个id，这样我们能知道，在这种情况下，它实际上是NSString *（iOS中的字符串类型）类型的。

          unsigned int methodCount;
          Method *methods = class_copyMethodList(moduleClass, &methodCount);
          for (unsigned int i = 0; i < methodCount; i++) {
            Method method = methods[i];
            SEL selector = method_getName(method);
            if ([NSStringFromSelector(selector) hasPrefix:@"__rct_export__"]) {
              IMP imp = method_getImplementation(method);
              NSArray *entries = ((NSArray *(*)(id, SEL))imp)(_moduleClass, selector);
              //...
              [moduleMethods addObject:/* Object representing the method */];
            }
          }

    <br><b>Setup JavaScript Executor</b>
    <br>JavaScript执行器有个-setUp方法，这个方法允许其在后台线程中做类似于初始化JavaScriptCore这样的昂贵的任务。因为只有活跃的执行器才能接收setUp方法，导致也能省去一些工作。

          JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);
          _context = [[RCTJavaScriptContext alloc] initWithJSContext:ctx];

    <br><b>Inject JSON Configuration</b>
    <br>JSON Configuration仅仅包含我们的模块，下面是代码：

        {
          "remoteModuleConfig": {
            "Logger": {
              "constants": { /* If we had exported constants... */ },
              "moduleID": 1,
              "methods": {
                "requestPermissions": {
                  "type": "remote",
                  "methodID": 1
                }
              }
            }
          }
        }

    这个对象作为全局变量存储在JavaScript VM中，所以当桥的js侧初始化的时候，就能获取相关信息创建模块。

    <br><b>Load JavaScript Code</b>
    <br>这个方法很有新意，从任何容器中载入源码。通常开发过程是从包文件中下载源代码，或者在产品模式则从磁盘加载。

    <br><b>Execute JavaScript Code</b>
    <br>一旦所有事情都准备就绪，我们在JavaScriptCore VM中加载应用源代码，通过拷贝，粘贴再执行。
    首次执行的时候，它注册所有的CommonJS模块，然后获取入口文件。

        JSValueRef jsError = NULL;
        JSStringRef execJSString = JSStringCreateWithCFString((__bridge CFStringRef)script);
        JSStringRef jsURL = JSStringCreateWithCFString((__bridge CFStringRef)sourceURL.absoluteString);
        JSValueRef result = JSEvaluateScript(strongSelf->_context.ctx, execJSString, NULL, jsURL, 0, &jsError);
        JSStringRelease(jsURL);
        JSStringRelease(execJSString);

    <br><b>Modules in JavaScript</b>
    <br>JavaScript通过rn的NativeModules对象可以获取到，通过上面的JSON configuration生成的模块。例如：

        var { NativeModules } = require('react-native');
        var { Person } = NativeModules;

        Person.greet('Tadeu');

    它工作的方式是，当你带着模块名字，方法名字以及所有相关参数调用方法的时候，会进入一个队列。在JavaScript执行的尾声，这个队列就会通过执行这次调用返回到native端。

    <br><b>Call cycle</b>
    <br>那么，当我们在js端通过上面的代码调用一个模块的时候，如下是将会发生的：

    ![](/img/in-post/briding-in-react/callcycle.png)

    <br>调用必须起始于native端，进入js端，在执行过程中，当调用NativeModules的方法的时候，它会把必须在native端执行的调用推入队列中。这样当js结束的时候，native端遍历所有的必须在native端执行的调用，并且当执行它的时候，经过桥（既是通过native模块调用enqueueJSCall:args:得到的_bridge 实例）的回调和调用就又用作回调进入js端。

    <br><b>Argument types</b>
    <br>对于从native到js的调用容易，参数以NSArray的形式传递，这个NSArray我们编码成JSON格式，但是对于来自于js的调用，我们需要指定native类型，为此，我们显示的检查原生类型（例如ints，floats，chars等），但是如上所述，对于任何对象，运行时（runtime）并没有给我们提供足够的来自于方法签名的信息，况且我们把参数类型保存为字符串。
    <br>我们利用正则表达式来从方法签名中抽取出类型，然后用RCTConvert实用class明确转换对象，这个class默认的对于每个支持的类型提供一个方法，而且会尝试把JSON类型的输入转化为想要的类型。
    <br>我们用objc_msgSend动态调用方法，但是遇到struct类型的，由于在arm64上没有 objc_msgSend_stret的版本，所以我们就落在了NSInvocation。
    <br>一旦我们把所有的参数都转化好以后，我们用另一个NSInvocation来调用目标模块和方法。
    <br>下面是例子：

        // If you had the following method in a given module, e.g. `MyModule`
        RCT_EXPORT_METHOD(methodWithArray:(NSArray *) size:(CGRect)size) {}

        // And called it from JS, like:
        require('NativeModules').MyModule.method(['a', 1], {
        x: 0,
        y: 0,
        width: 200,
        height: 100
        });

        // The JS queue sent to native would then look like the following:
        // ** Remember that it's a queue of calls, so all the fields
        // are arrays **
        @[
        @[ @0 ], // module IDs
        @[ @1 ], // method IDs
        @[       // arguments
        @[
          @[@"a", @1],
          @{ @"x": @0, @"y": @0, @"width": @200, @"height": @100 }
        ]
        ]
        ];

        // This would convert into the following calls (pseudo code)
        NSInvocation call
        call[args][0] = GetModuleForId(@0)
        call[args][1] = GetMethodForId(@1)
        call[args][2] = obj_msgSend(RCTConvert, NSArray, @[@"a", @1])
        call[args][3] = NSInvocation(RCTConvert, CGRect, @{ @"x": @0, ... })
        call()

    <br><b>Threading</b>
    <br>如上所述，每个模块默认会有自己的GCD quene，当然了除非是通过实施-methodQueue方法，或者利用有效队列来同步方法队列，来明确指定想要运行的队列。例外是View Managers * （继承自RCTViewManager），它默认走了Shadow Quene，以及特殊目标RCTJSThread，因为它是一个队列而不是线程，所以它仅仅是一个占位。
    <br>当前的线程规则是这样的：
    <ul>
      <li>-init 和 -setBridge： 确保在主线程被调用</li>
      <li>所有导出的方法确定的在目标队列被调用</li>
      <li>如果实施了RCTInvalidating协议，invalidate也确保在目标队列中调用</li>
      <li>对于-dealloc来说，没有确定的队列来执行</li>
    </ul>
    <br>当接收到一大批来自于js的调用时，这些调用会根据目标队列来分组，并且会并行的分发：

        // group `calls` by `queue` in `buckets`
        for (id queue in buckets) {
          dispatch_block_t block = ^{
            NSOrderedSet *calls = [buckets objectForKey:queue];
            for (NSNumber *indexObj in calls) {
              // Actually call
            }
          };
          if (queue == RCTJSThread) {
            [_javaScriptExecutor executeBlockOnJavaScriptQueue:block];
          } else if (queue) {
            dispatch_async(queue, block);
          }
        }

    <br><b>The end</b>
</div>
