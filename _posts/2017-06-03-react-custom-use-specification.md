---
layout:     post
title:      "react团队使用规范"
subtitle:   "那些年踩过的react坑"
date:       2017-06-03 12:00:00
author:     "Fred"
catalog:    true
tags:
    - react
---

# 原则简述
*  一个文件只包含一个组件，然而是允许存在多个无状态，纯组件的。
*  全部使用jsx语法。
*  只有在非jsx文件中初始化应用，才允许使用React.createElement。

# Class vs React.createClass vs stateless
如果有内部的状态，或者是用到了refs，则优先使用class extends React.Component；

    // bad
    const Listing = React.createClass({
        // ...
        render() {
            return <div>{this.state.hello}</div>;
        }
    });

    // good
    class Listing extends React.Component {
        // ...
        render() {
            return <div>{this.state.hello}</div>;
        }
    }

如果没有状态或者refs，那么优先使用普通函数（不是箭头函数）。

    // bad
    class Listing extends React.Component {
      render() {
        return <div>{this.props.hello}</div>;
      }
    }

    // bad (relying on function name inference is discouraged)
    const Listing = ({ hello }) => (
      <div>{hello}</div>
    );

    // good
    function Listing({ hello }) {
      return <div>{hello}</div>;
    }

# Mixins
*  不要使用mixins。
> 为什么？ Mixins引进隐含的依赖，引起命名冲突，以及一些列相关问题。多数需要mixins的地方，都可以通过组件，高阶组件等更好的解决。

# Naming
*  文件名：利用所有首字母大写的形式。
*  引用名字：React组件利用所有首字母大写的形式，实例的话，用驼峰形式。

    // bad
    import reservationCard from './ReservationCard';

    // good
    import ReservationCard from './ReservationCard';

    // bad
    const ReservationItem = <ReservationCard />;

    // good
    const reservationItem = <ReservationCard />;

*  组件名字：利用文件名字作为组件名字。例如，ReservationCard.js引用名字就应该是ReservationCard。然而，对于一个目录的根组件，用index.js作为文件名字，用目录名字作为组件名字：

    // bad
    import Footer from './Footer/Footer';

    // bad
    import Footer from './Footer/index';

    // good
    import Footer from './Footer';

# 括号
*  当jsx标签占据多于一行的话，就用圆括号把标签阔起来。

    // bad
    render() {
      return <MyComponent className="long body" foo="bar">
               <MyChild />
             </MyComponent>;
    }

    // good
    render() {
      return (
        <MyComponent className="long body" foo="bar">
          <MyChild />
        </MyComponent>
      );
    }

    // good, when single line
    render() {
      const body = <div>hello</div>;
      return <MyComponent>{body}</MyComponent>;
    }

# 标签
*  如果没有子元素的话，就用自闭合标签。

    // bad
    <Foo className="stuff"></Foo>

    // good
    <Foo className="stuff" />

*  如果组件有多个属性，另起一行关闭标签。

    // bad
    <Foo
      bar="bar"
      baz="baz" />

    // good
    <Foo
      bar="bar"
      baz="baz"
    />

# 方法
*  利用箭头函数闭合本地变量。

        function ItemList(props) {
          return (
            <ul>
              {props.items.map((item, index) => (
                <Item
                  key={item.key}
                  onClick={() => doSomethingWith(item.name, index)}
                />
              ))}
            </ul>
          );
        }
*  在constructor中绑定函数具柄。

        // bad
        class extends React.Component {
          onClickDiv() {
            // do stuff
          }

          render() {
            return <div onClick={this.onClickDiv.bind(this)} />;
          }
        }

        // good
        class extends React.Component {
          constructor(props) {
            super(props);

            this.onClickDiv = this.onClickDiv.bind(this);
          }

          onClickDiv() {
            // do stuff
          }

          render() {
            return <div onClick={this.onClickDiv} />;
          }
        }

*  react组件内部方法，名字不要带下划线前缀

        // bad
        React.createClass({
          _onClickSubmit() {
            // do stuff
          },

          // other stuff
        });

        // good
        class extends React.Component {
          onClickSubmit() {
            // do stuff
          }

          // other stuff
        }

*  render方法中务必return一个值

        // bad
        render() {
          (<div />);
        }

        // good
        render() {
          return (<div />);
        }
