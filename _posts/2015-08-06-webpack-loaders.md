---
layout: post
title: webpack loaders
---

<h1>{{ page.title }}</h1>

06 Aug 2015 - Beijing

<br>some ways of configuring loaders。
<br>可以参考https://forum.shakacode.com/t/understanding-the-webpack-module-bundler/336

        module: {
            preLoaders: [   //执行顺序在loaders之前。
              { test: /\.ts$/, loader: 'tslint-loader', exclude: [ /node_modules/ ] },  
              //TypeScript的loader，angular官方用的就是typescript，
              //这里用tslint－loader预处理，下面loaders中有awesome-typescript-loader。
              { test: /\.js$/, loader: "source-map-loader", exclude: [ /node_modules\/rxjs/ ] }
            ],
            loaders: [
              {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory'],  
                //把react的jsx文件编译为js文件，缓存目录。
                include: PATHS.app  
                //编译这个路径下的所有jsx文件，这里PATHS.app是路径变量。
              },
              {
               test: /\.js$|\.jsx$/,
               loader: 'babel',
               //loader里的query既可以放在query键值中，也可以直接放在babel？后，以&分隔。
                query: {    
                  "presets": ["es2015", "react", "stage-0","react-hmre"],
                  //其中es2015表示支持es6转化为es2015。
                  "plugins":["transform-decorators-legacy"]
                },
                include: path.join(__dirname, '../src'),
                exclude: /node_modules/      //表示node_modules目录下的jsx文件不需要转化。
              },
              {
                test: /\.less$/,
                loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___
                [hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap'
              },
              {
                test: /\.scss$/,
                loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___
                [hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
                //注意“！”用来分隔各个loaders，查询参数的格式等同于，http get后的“? & =”,
                //尤其在上面这种链式loaders中有用，链式执行loaders的顺序是从右至左，先引入scss
                //文件，用sass loader处理，sourceMap表示编译后也能查看源文件，需要chrome开
                //启sourcemap选项，输出文件格式不是压缩的。处理后的结果传递给antoprefixer－loader
                //，但是只支持主流浏览器的最近的两个版本。再通过css－loader处理，文件名字hash处理。
                //最后经过style－loader。
              },
              {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
                include: PATHS.app
              },
              { test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [ /\.(spec|e2e)\.ts$/     ]
                //这里排除了.spec,.e2e等测试文件的编译。
              },
              { test: /\.json$/, loader: "json-loader" },
              {
                test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap' )
              },
              {
                test: /\.(jpe?g|png|gif)$/i,
                loaders: [
                  'url?limit=10000&name=images/[hash:8].[name].[ext]',
                  'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
              },
              {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
              },
              { test: /\.html$/, loader: 'raw'}
            ],

          }
