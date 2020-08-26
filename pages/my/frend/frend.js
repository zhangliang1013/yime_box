import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({

  data: {
    head_img:'', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      head_img :  wx.getStorageSync('members').avatar
    })
  },
  feedback(){  //进来获取信息
    let that = this;
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '提示',
        content: '你还未授权登录是否前往授权',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
      return;
    }
    request({
      url :'/api/ym.share/getShareDiscountCoupon',
      data : {
        token : wx.getStorageSync('token')
      },
      header : {
        token : wx.getStorageSync('token')
      }
    }).then(res => {
      // console.log(res)
      if(res.data.code == 200){
        this.setData({
          incentive : res.data.data.incentive
        })
      }else{
        Function.layer(res.data.msg)
      }
    })
  },
  onShow:function(){
    this.feedback()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) { 
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '好友送券', 
      // path: '/pages/my/frend2/frend2?top_id=' + that.data.id    // 相对的路径
      path : '/pages/shouye/index/index'  //直接跳转首页
    }
  }
})