---
layout: post
title: react+redux+api,how to add a reducer
---

<h1>{{ page.title }}</h1>

12 March 2016 - Beijing

<br>The process of adding a reducer in the react.
<br>1.First define the action，including the defination of the action types in the type file, returning the promise;

        export const getArticleCount = () =>{
          return (dispatch,getState) => {
            const options = getState().options.toJS()
            return dispatch({
              type: types.ARTICLE_COUNT,
              promise: api.getArticleCount(options)
            })
          }
        }

<br>2.then define the API function,should be accord to backend controler name;  

        getArticleCount:function(options){
            return ArticleResource('get', 'getFrontArticleCount', null, {params:options})
          },

<br>3.the returning data should through the promiseMiddleware,the name is json;

        export default function promiseMiddleware() {
          return next => action => {
            const { promise, type, ...rest } = action
            if (!promise) return next(action)
            const SUCCESS = type + '_SUCCESS'
            const REQUEST = type + '_REQUEST'
            const FAILURE = type + '_FAILURE'
            next({ ...rest, type: REQUEST })
            return promise
              .then(response => ({json: response.data, status: response.statusText}))
              .then(({json,status}) => {
                if(status !== 'OK'){
                  const error = json
                  next({ ...rest, error, type: FAILURE })
                  return false
                }
                next({ ...rest, json, type: SUCCESS })
                return true
              })
              .catch(error => {
                next({ ...rest, error, type: FAILURE })
                return false
              })
          }
        }

<br>4.then in the reducer file, define the according export const，

        export const articlecount = createReducer(initialState,{
          [ARTICLE_COUNT_SUCCESS]:  (state,action) => state.merge(fromJS(action.json)),
          [ARTICLE_COUNT_FAILURE]: (state) => state
        })

<br>5.the most important one is that in the index.js,you should add the reducer into the rootReducer,so that it can be export.

        const rootReducer = combineReducers({
          articleDetail,
          articlecount,
          routing: routerReducer,
          form: formReducer
        })

<br>6.The next one should be how to use the state as props in the component:

        const mapStateToProps = state =>{
          return {
            articleCount: state.articlecount.toJS()
          }
        }
        @connect(mapStateToProps,mapDispatchToProps)
        export default class Home extends Component {
          constructor(props){
            super(props)
          }
          static propTypes = {
            articleCount: PropTypes.object.isRequired
          }
          static fetchData(params){
            return [Actions.getArticleList(),Actions.getTagList(),Actions.getArticleCount()]
          }
          componentDidMount() {
            const { actions,tagList,articleList } = this.props
            Actions.getArticleCount()
            if(tagList.length < 1){
              actions.getTagList()
            }
            if(articleList.items.length < 1){
              actions.getArticleList()
            }
          }
          handleChange(e,option,isAdd=false){
            e.preventDefault()
            const { actions } = this.props
            actions.changeOptions(option)
            actions.getArticleList(option)
            actions.getArticleCount(option)
          }
          render() {
            const { globalVal,tagList,articleList,options,articleCount } = this.props
            return (
               /……./
            )
          }
