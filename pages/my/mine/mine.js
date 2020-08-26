import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    is_tan: false,
    isauth: false, //判断是否去授权
    phone: '', //手机号
    getPeople: {} //我的信息
  },
  onLoad: function (options) {
    //this.userinfo();
  },
  onShow() {
    this.userinfo();
  },
  userinfo() { //详情加载
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          }else{
            wx.switchTab({
              url: '/pages/shouye/index/index'
            })
          }
        }
      })
    } else {
      this.setData({
        isauth: true
      })
      request({
        url: '/api/user/index',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        //  console.log(res,'个人信息')
        if (res.data.code == 200) {
          console.log(res, '个人信息')
          this.setData({
            phone: res.data.data.mobile,
            jifen: res.data.data.score,
            nickname: res.data.data.nickname,
            avatar: res.data.data.avatar,
            group_id : res.data.data.group_id    //bang权益
          })
        }else if(res.data.code == 401){
          wx.showModal({
            title: '提示',
            content: '获取列表失败，请授权重试！',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              } else {
                wx.switchTab({
                  url: '/pages/shouye/index/index'
                })
              }
            }
          })
        }else{
          Function.layer('获取个人信息失败，请稍后重试')
        }
      })
    }
  },
  info() {
    wx.navigateTo({ url: '/pages/my/desc/desc'})
  },
  go_order() {
    wx.switchTab({
      url: "/pages/bill/noconsume/noconsume?status=1"
    })
  },
  getauth() {      //点击去授权
    wx.navigateTo({
      url: '/pages/auth/auth'
    })
  }
})