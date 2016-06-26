---
layout: post
title: webpack plugin
---

<h1>{{ page.title }}</h1>

06 July 2015 - Beijing

<br>1.webpack-merge
<br>作用：在阐述这个plugin前先铺垫几个方法。
<br>首先，我们知道webpack的配置根据不同的环境会有不同的配置，例如test，development，production等环境，并且依赖管理文件package.json中的scripts项中，会定义一些列变量，然后通过npm run (#varable)就可以自行变量对应的命令。这时候就需要有一种方式可以在webpack的配置文件中取到package.json scripts中的变量值。通过process.env.npm_lifecycle_event就可以实现，我们把它赋值给target。

        const TARGET = process.env.npm_lifecycle_event;

<br>这时候package.json scripts:

        "scripts": {
          "deploy": "gh-pages -d build",
          "stats": "webpack --profile --json > stats.json",
          "build": "webpack",
          "start": "webpack-dev-server"
        }

<br>然后通过执行如下：

        if(TARGET === 'start' || !TARGET) {
          module.exports = merge(common, {
            // balabala
            ｝
          //任务
        ｝
        if(TARGET === 'build' || TARGET === 'stats') {
          module.exports = merge(common, {
            // balabala
            ｝
        }

<br>可以看到我在上面引入了merge和common，merge就是webpack-merge引入后定义的变量。而commom就是我们这里的重点，我们可以把test，development，production等环境公共的配置项拿出来，单独到common中，然后通过merge(common,{}),可以达到我们想要的目的。


<br>2. webpack-dev-server
<br>定义：是个小的nodejs express类型的server，应用webpack-dev-middleware 和文件联系到一起，这个server把编译状态传递给客户端。
<br>特点：
<br>(1).支持多种自动刷新页面的模式，Iframe mode和Inline mode，这两种模式都支持Hot Module Replacement，可以在有变动发生的时候，只是局部更新，不用全局刷新。值得注意的是，Inline mode的实现需要在命令行使用--inline，这样能把webpack-dev-server客户端入口加入到webpack的配置文件中。因为webpack-dev-server不能获取到webpack 配置中的文件，所以需要把“webpack-dev-server/client?http://<path>:<port>/”， 添加到webpack配置的入口文件中。
<br>例如：

        var config = require("./webpack.config.js");
        config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
        var compiler = webpack(config);
        var server = new WebpackDevServer(compiler, {...});
        server.listen(8080);

<br>(2).支持Hot Module Replacement
<br>最简单的方式是在命令行添加--hot，就可以实现把HotModuleReplacementPlugin添加到webpack配置中，相应自动添加webpack/hot/dev-server入口文件。这样当输入“http://<host>:<port>/<path>”，就会有奇迹发生，打开浏览器控制台看到如下信息：

        [HMR] Waiting for update signal from WDS...
        [WDS] Hot Module Replacement enabled.

<br>其中[HMR]开头的信息源自“webpack/hot/dev-server”模块，[WDS]开头的信息源自“webpack-dev-server client”，则需需要注意一点，那就是要指定正确的<span>output.publicPath</span>，否则热更新的chunks不能被加载。
<br>除了用--hot，还可以通过在配置文件中更改如下三点：
<br>＊在入口中添加“webpack/hot/dev-server”。
<br>＊在plugin键值中添加“new webpack.HotModuleReplacementPlugin()”。
<br>＊把“hot: true”添加到webpack-dev-server的options配置项中。
<br>下面是一个例子

        var config = require("./webpack.config.js");
        config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
        var compiler = webpack(config);
        var server = new webpackDevServer(compiler, {
          hot: true
          ...
        });
        server.listen(8080);

<br>(3).webpack-dev-server options参数
<br>--content-base<file/directory/url/port>:内容的基础路径。
<br>--quiet: 控制台中不输出任何信息。
<br>--colors:给输出添加颜色。
<br>--compress: 应用gzip压缩。
<br>--host <hostname/ip>:host名字。
<br>--port <number>: port.
<br>--inline:把webpack-dev-server runtime嵌入到bundle中。
<br>--hot:添加HotModuleReplacementPlugin，同时server切换到hot模式，注意不需要在配置中再加入一次HotModuleReplacementPlugin。
<br>--hot --inline：也在入口中添加“webpack/hot/dev-server”。
<br>--lazy:不处于观察者模式，每次请求才会编辑。（不能和--hot同时使用）
<br>--https: 在HTTPS协议时，使用webpack-dev-server。
<br>--open:再默认浏览器中打开URL（需要webpack-dev-server versions > 2.0）
<br>--history-api-fallback:支持history API fallback。
<br>(4)Combining with an existing server
Should not use the webpack-dev-server as a backend. Its only purpose is to serve static (webpacked) assets.Can run two servers side-by-side: The webpack-dev-server and your backend server.
<br>When running on a HTML-page sent by the backend server,in order to teach the webpack-generated assets to make requests to the webpack-dev-server,you need to provide a full URL in the output.publicPath option.
<br>If you need a websocket connection to your backend server, you’ll have to use iframe mode.
<br># webpack-dev-server contentBase = "http://localhost:9090/" (--content-base).
<br># open http://localhost:8080/webpack-dev-server/.

        Summary and example:

        webpack-dev-server on port 8080.
        backend server on port 9090.
        generate HTML pages with <script src="http://localhost:8080/assets/bundle.js">.
        webpack configuration with output.publicPath = "http://localhost:8080/assets/".
        when compiling files for production, use --output-public-path /assets/.
        inline mode:
        --inline.
        open http://localhost:9090.
        or iframe mode:
        webpack-dev-server contentBase = "http://localhost:9090/" (--content-base).
        open http://localhost:8080/webpack-dev-server/.

<br>(5) 通过webpack-dev-middleware and webpack-hot-middleware来实现webpack－dev－server以及hotmodule replacement。
具体dev－server文件的相关配置如下：

        var app = new Express();

        app.use(require('webpack-dev-middleware')(compiler, serverOptions));
        app.use(require('webpack-hot-middleware')(compiler));

webpack congig的相关配置如下：

        entry: {
          'main': [
            'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr'
          ]
        },
        output: {
          path: assetsPath,
          filename: '[name]-[hash].js',
          chunkFilename: '[name]-[chunkhash].js',
          publicPath: 'http://' + host + ':' + port + '/dist/'
        },
        plugins: [
          // hot reload
          new webpack.HotModuleReplacementPlugin(),
          })

<br>3.webpack plugin
<br>(1)CleanWebpackPlugin:作用是在编译文件前，把编译文件目标目录清空。
<br>用法：@params（编译文件目录）

        plugins: [
          new CleanWebpackPlugin([PATHS.build])
        ]

<br>（2）extract-text-webpack-plugin：作用是编译的时候，把css文件从压缩包中独立出来，便于解藕。
<br>用法：引入，loaders中调用extract方法，在plugins中定义。一般命令行单纯执行webpack的时候应用这个plugin。

        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        module: {
              loaders: [
                // Extract CSS during build
                {
                  test: /\.css$/,
                  loader: ExtractTextPlugin.extract('style', 'css'),
                  include: PATHS.app
                }
              ]
            }  
        plugins: [
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]   

<br>（3）webpack.DefinePlugin：
作用：例如在react或者angular中使用，可以减少react或者angular库的尺寸。其他作用包括在开发环境下，可以实现调试输出。其次是增加全局的常量。下面例子中定义了常量process.env.NODE_ENV。只有给常量值添加两个引号才起作用。

        new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'

              })

<br>（4） webpack.optimize.CommonsChunkPlugin
<br>作用：
<br>常用参数：
<br>options.name or options.names，表示commons chunk的chunk名字；如果传入的是数组，如下所以，等价于对于传入的每一个chunk名字触发多次插件。相应生成vendor.js,manifest.js文件。
<br>options.minChunks，进入commons chunk中的chunks的最小数量，在进入commons chunk之前，那些chunks需要包含module，数字必须大于等于2，小于等于chunks的数量，如果赋值infinity，仅仅创建commons chunk，但是不包涵modules。

        new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
        }),

<br>（5） webpack.optimize.UglifyJsPlugin
作用：压缩所有输出的Javascript文件，Loaders切换到压缩模式，其中常用的参数包括sourcemap（可以把错误信息定位到具体的文件），其他参数参考https://github.com/mishoo/UglifyJS2#usage。

        new webpack.optimize.UglifyJsPlugin({
                compress: {
                  warnings: false
                }
        })

<br>（6） HtmlwebpackPlugin
用法：生成Html5文件，在script tags中引入了所有webpack bundles，对于那些每次编译后生成的文件名字包含hash值的webpack bundles尤其有用，既可以利用自带的ladash template自动生成模版，也可以利用自己的loaders。
例子中我们用的是自己的ejs模版。

        plugins: [
            new HtmlwebpackPlugin({
              template: 'node_modules/html-webpack-template/index.ejs',
              title: 'Kanban app',
              appMountId: 'app',
              inject: false
            })
          ]

<br>其中options中的参数是一些配置项，控制诸如模版，title，脚本或者css文件注入的位置等。
<br>（7）npm-install-webpack-plugin
用法：通过利用webpack自动安装和保存依赖来加速开发的进程。详情可以移步：https://github.com/ericclemmons/npm-install-webpack-plugin
例子：

        plugins: [
          new NpmInstallPlugin({
            // Use --save or --save-dev
            dev: false,
            // Install missing peerDependencies
            peerDependencies: true,
          });
        ]

<br>（8）webpack.optimize.OccurenceOrderPlugin
作用：用来控制编译后的模块在app中出现的顺序。记着是有个地方必须要它才行，忘了是哪里，想起来的时候补上。
