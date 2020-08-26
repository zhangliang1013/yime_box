import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
   tp : {}
  },
  onLoad: function(options) {
    console.log(options)
    var  token = wx.getStorageSync('token')  || '';
    if(token == ''){
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } 
        }
      })
    }else{
      request({
        url : '/api/ym.perfect/getPerfect',
        data : {
          perfect_id : options.id,
          token : token
        },
        header : {
          token : token
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.code == 200){
           this.setData({
             tp : res.data.data
           })
        }else{
          Function.layer(res.data.msg)
        }
      })
    }
  }
})