---
layout: post
title: async in react redux
---

<h1>{{ page.title }}</h1>

08 July 2015 - Beijing

<br>最近看了很多react－redux相关的repositories,一般来说在redux中异步获取存储数据是通过，redux相关的thunk－middleware,promise-middleware等中间件，通过把异步施加到action上来实现，通过reducer把请求来的数据存储到返回的状态中，然后通过Props把数据传入container中。
<br>这里主要提到redux-async-connect:
<br>这个包的主要特点是：
<br>1.当点击某个路由时，直到和这个路由相关的所有promise都完成（包括resolve和reject），才会渲染路由所在页面的组件，这样的优点之一是极大程度提升用户体验，防止页面突然跳转（don't jump when data was loaded）。如下为具体实现：通过render把Router和ReduxAsyncConnect联系到一起。

        const component = (
          <Router render={(props) =>
                <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />
              } history={history}>
            {getRoutes(store)}
          </Router>
        );

<br>2.asyncConnect decorator，用来修饰连接到路由的组件，例如如下，可以通过this.props.lunches直接取得异步取得的数据。

        @asyncConnect({
          lunches: (params, helpers) => helpers.client.get('/lunches')
        })
        export default class Home extends Component {
          // ...
        }

<br>其中helpers.client是一个http客户端从后台获取数据的插件，一般是应用superAgent和Axios，这里我们应用前者，下面是具体应用，通过promise绑定的数据，这样我们就可以应用then来处理返回的数据。

        export default class ApiClient {
          constructor(req) {
            methods.forEach((method) =>
              this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
                const request = superagent[method](formatUrl(path));

                if (params) {
                  request.query(params);
                }

                if (__SERVER__ && req.get('cookie')) {
                  request.set('cookie', req.get('cookie'));
                }

                if (data) {
                  request.send(data);
                }

                request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
              }));
          }
          /*
           * There's a V8 bug where, when using Babel, exporting classes with only
           * constructors sometimes fails. Until it's patched, this is a solution to
           * "ApiClient is not defined" from issue #14.
           * https://github.com/erikras/react-redux-universal-hot-example/issues/14
           *
           * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
           *
           * Remove it at your own risk.
           */
          empty() {}
        }

<br>我们知道，在redux中，store,action,middleware的流程是，首先定义action（异步action的定义一般是 {type:**,promise:**}）, 然后调用store的dispatch方法触发action,redux中只允许有一个store，和一个根reducer，通过combinereducer把多个reducer合并成一个reducer，被diapatch的action目标是进入reducer，但是进入reducer之前需要经过各个中间件，这种异步的情况来说，创建一个中间件例如createMiddleware，把superAgent所在的方法作为参数传递给中间件，在中间件里对action进行过滤，筛选出定义为{type:**,promise:**}形式的action，然后把superAgent方法作为参数传递进入action的promise方法中，把得到的数据保存起来传递进入reducer中。
<br>这个superAgent方法做的事情如上，也就是处理http请求，根据运行的环境确定url是否带api/或者是config.host,config.port，然后后台根据这些url，通过路由来实现对中间件的过滤，分发对应的方法。而在createMiddleware中，根据请求返回数据的成功情况，来确定then的回调函数，如果成功就执行next({...rest, result, type: SUCCESS})，否则执行next({...rest, error, type: FAILURE})，然后数据会经过其他中间件，最后到达reducer，reducer通过action.result来取得返回的数据。
