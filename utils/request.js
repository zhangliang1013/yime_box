/**
 * 封装一个异步的请求工具库
 * 基于 wx.request (ajax) 来实现axios的部分功能
 * 
 * 1.调用返回一个promise （以axios举例）
 * 
 * request({
 *  ...配置
 * }).then(res => {}).catch(err => {})
 * 
 * 
 * 2.配置基准路径
 * 
 * request.defaults.baseURL = "路径"
 * 
 * 
 * 3.错误拦截
 * 
 * request.onError(res => {
 *  // 处理错误
 * })
 *
 */

/**
 * 主函数
 * 
 * @params
 * 参数 | 类型 | 默认值
 * config | Oject | {}
 */
const request = (config = {}) => {

  // 如果url开头没有http，加上基准路径
  // 字符串正则方法search https://www.runoob.com/jsref/jsref-search.html
  if (config.url.search(/^http/) === -1) {
    // 给链接添加url，加上基准路径
    config.url = request.defaults.baseURL + config.url;
  }

  // 返回一个promise
  // resolve是 .then 里面的函数，一般请求成功时候执行
  // reject 是 .catch 里面的函数，一般用于请求失败时候执行
  return new Promise((resolve, reject) => {
    // 发起请求前加一个轻提示
    // wx.showLoading({ 
    //   title: '加载中',
    // })
    // 发起请求
    wx.request({
      ...config,
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      },
      // 不管成功失败都会执行
      complete(res) {
        // 执行错误的兰截器
        request.errors(res);

        // 加载成功后 在取消提示
        // wx.hideLoading()
      }
    })
  })
}
/**
 * request的默认属性
 */
request.defaults = {
  // 基准路径
  baseURL: ""
}
/**
 * 存储错误的回调函数.默认是一个空的函数
 */
request.errors = () => { }
/**
 * request的错误拦截
 * 
 * @params
 * callback | 函数 
 */
request.onError = (callback) => {
  // 判断callback必须是一个函数
  if (typeof callback === "function") {
    // 如果是函数，保存到errors
    request.errors = callback
  }
}


// 对外暴露
export default request;