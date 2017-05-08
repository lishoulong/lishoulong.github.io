---
layout:     post
title:      "Integreted RN to existing android project"
subtitle:   "那些年踩过的坑"
date:       2017-05-08 12:00:00
author:     "Fred"
catalog:    true
tags:
    - rn
    - android
---

> 这篇文章的背景，网络上有很多关于rn的资源都过于陈旧，rn已经升级到0.44了，那些文章对rn的依赖还停留在0.2*，导致启动都不能成功，不得不说，对于初学者，找到合适的学习资源都是一个问题。下面的整个过程，是我从0开始运行成功的。
> 再者现在，多数的开源项目都是纯粹的rn项目，但是在实际的项目中，我们应用最多的场景还是在已有的原生项目中，植入rn项目，官网已经给了我们详细的步骤，<a data-hash="8ffb556cbebb0cfe22aa194ff89b635d" href="http://facebook.github.io/react-native/docs/integration-with-existing-apps.html" class="member_mention" data-editable="true" data-title="官方文档" data-tip="p$b$8ffb556cbebb0cfe22aa194ff89b635d"> 官方文档</a>，想着按照官网步骤一步一步来应该问题不大，结果还是天真了，真的是一步一个坑啊。我用的mac机器，window同样适用，开始之前确保你的PC中已经正确安装了node.js以及Python 2。下面开始正文：

## 1.新建一个Android项目

![](/img/in-post/integrate-in-android/newandroid.png)

注意Minimum SDk选择API16以上,一路next后finish。

## 2.添加JS

打开studio的Terminal窗口，输入如下命令：

> npm init
会让你输入一些初始化package.json 的配置信息，例如:

![](/img/in-post/integrate-in-android/npminit.png)

按照提示输入就行了。
这一步完成之后，在项目的根目录下就会生成package.json这个文件，在dependencies中，加入rn的依赖，"react-native": "^0.44.0"，下一步输入：

> npm install react@16.0.0-alpha.6 --save

用开安装react，然后再次输入

> npm install

用来安装React Native。大约一两分钟的样子（如果卡到这里了，看看安装时是不是忘了配置镜像），完成之后你的根目录下会多了一个node_modules的文件夹，里面存放了下载好的React 和React Native。这里有童鞋可能会质疑为什么不把react的依赖直接写入package.json中，如果这么做的化，npm run start启动的时候会报如下的错误：

![](/img/in-post/integrate-in-android/propsTypeerror.png)

下一步继续输入如下命令

> curl -o .flowconfig https://raw.githubusercontent.com/facebook/react-native/master/.flowconfig

如果PC中还没有安装curl命令在<a data-hash="8ffb556cbebb0cfe22aa194ff89b635d" href="https://curl.haxx.se/download.html" class="member_mention" data-editable="true" data-title="官方文档" data-tip="p$b$8ffb556cbebb0cfe22aa194ff89b635d"> 这里</a>下载，下载后记得配置好环境变量哦（也就是把bin目录下的curl命令加入到系统环境变量里），然后最重要的是重启一下studio，要不然还是无法使用curl命令。
重启studio后输入curl会出现:
![](/img/in-post/integrate-in-android/testcurl.png)

说明已经安装成功了。
继续上面的步骤输入：

> curl -o .flowconfig https://raw.githubusercontent.com/facebook/react-native/master/.flowconfig

用于下载.flowconfig文件。显示如下说明下载成功

![](/img/in-post/integrate-in-android/testflow.png)

接下来把如下命令粘贴到package.json 文件下 scripts标签中

> "start": "node node_modules/react-native/local-cli/cli.js start"

粘贴后的package.json文件内容如下：

![](/img/in-post/integrate-in-android/packageafterpaste.png)

下一步，在根目录下创建index.android.js文件并把如下代码粘贴到其中：

        'use strict';

        import React from 'react';
        import {
          AppRegistry,
          StyleSheet,
          Text,
          View
        } from 'react-native';

        class HelloWorld extends React.Component {
          render() {
            return (
              <View style={styles.container}>
                <Text style={styles.hello}>Hello, World</Text>
              </View>
            )
          }
        }
        var styles = StyleSheet.create({
          container: {
            flex: 1,
            justifyContent: 'center',
          },
          hello: {
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
          },
        });
        AppRegistry.registerComponent('HelloWorld', () => HelloWorld);

代码很简单，居中显示一个HelloWorld。

## 3.项目配置

修改app的build.gradle文件添加如下内容,注意下面appcompat-v7版本为25.2.0，而且我把dependencies中test相关的依赖移除掉了，避免不必要的bug。

        apply plugin: 'com.android.application'
        apply from: "../node_modules/react-native/react.gradle"

        android {
        compileSdkVersion 25
        buildToolsVersion "25.0.2"
        defaultConfig {
            applicationId "com.example.lifeifei.reactnativeinit"
            minSdkVersion 16
            targetSdkVersion 25
            versionCode 1
            versionName "1.0"
            testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
        }
        buildTypes {
            release {
                minifyEnabled false
                proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            }
        }

        configurations.all {
            resolutionStrategy.force 'com.google.code.findbugs:jsr305:1.3.9'
        }
        }

        dependencies {
          compile fileTree(dir: 'libs', include: ['*.jar'])
          compile 'com.android.support:appcompat-v7:25.2.0'
          compile 'com.facebook.react:react-native:+'
        }

项目的build.gradle中添加依赖

      allprojects {
        repositories {
            mavenLocal()
            jcenter()
            maven {
                // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
                url "$rootDir/node_modules/react-native/android"
            }
        }
      }

继续下一步，在AndroidManifest.xml中添加网络访问权限

    <uses-permission android:name="android.permission.INTERNET" />

## 3.创建Activity

以下几步不要安装官网的去做，官网的步骤太麻烦，而且很久没有更新了。

1.新建一个Activity，让其继承ReactActivity，并重写getMainComponentName(),返回我们在index.android.js中注册的HelloWorld这个组件。

        package com.example.lifeifei.reactnativeinit;

        /**
        * Created by lifeifei on 28/04/2017.
        */
        import javax.annotation.Nullable;

        import com.facebook.react.ReactActivity;

        public class ReactNativeActivity extends ReactActivity {
          @Nullable
          @Override
          protected String getMainComponentName(){
            return "HelloWorld";
          }
        }

别忘了把这个activity加入AndroidManifest.xml文件中

![](/img/in-post/integrate-in-android/manifest.png)

2.自定义一个Application，继承ReactApplication ，编写以下代码：

        public class App extends Application implements ReactApplication {

            private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    return Arrays.<ReactPackage>asList(
                            new MainReactPackage()
                    );
                }
            };
            @Override
            public ReactNativeHost getReactNativeHost() {
                return mReactNativeHost;
            }
        }

记得在AndroidManifest.xml中引用

> android:name=".App"

3.在MainActivity中通过按钮启动我们的ReactNativeActivity

        public class MainActivity extends AppCompatActivity {

            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                setContentView(R.layout.activity_main);
                findViewById(R.id.start_rn_btn).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startActivity(new Intent(MainActivity.this, ReactNativeActivity.class));
                    }
                });
            }
        }

4.app/src/main下新建assets文件夹。
运行如下命令

> react-native start

如果卡在了这一步：
![](/img/in-post/integrate-in-android/loadingdependency.png)

没关系，用资源管理器打开你工程的根目录，在此目录下重新运行一个命令行并在其中输入如下命令

> react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output app/src/main/assets/index.android.bundle --assets-dest app/src/main/res/

完成之后assets目录下会生成以下两个文件

![](/img/in-post/integrate-in-android/assets.png)

确认一下react native service处于运行状态，然后正常运行你的APP，点击start，如果出现

![](/img/in-post/integrate-in-android/runok.png)

恭喜你！你已经可以开始搞混合开发了

## The end
