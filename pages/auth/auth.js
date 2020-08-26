import request from '../../utils/request.js'
var Function = require("../../utils/function.js");
Page({
  data: {
    token: ''
  },
  onLoad: function (options) {
    var that = this;
  },
  onShow: function () {
    this.setData({
      token: wx.getStorageSync('token') || ''
    })
  },


  bindPhone: function (e) { //点击绑定手机号
    //绑定手机号
    var token = wx.getStorageSync('token') || '';
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      request({
        url: '/api/ym/home/getBindingMobile',
        header: {
          token: token
        },
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          errMsg: e.detail.errMsg,
          token: token
        },
        method: 'post',
      }).then(res => {
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '授权手机号码成功',
            success(res) {
              if (res.confirm) {
                setTimeout(() => {
                  wx.navigateBack();
                }, 1000)
              }
            }
          })
        } else if (res.data.code == 305) {
          Function.layer(res.data.msg)
          this.setData({
            token: ''
          })
        }
        else {
          Function.layer('绑定失败，请稍后重试！')
        }
      })  //进行授权
    } else {
      wx.showModal({
        title: '提示',
        content: '用户信息用于页面数据展示，请重新授权',
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '请重新授权',
              icon: 'loading',
              duration: 1000
            })
          }
        }
      })
    }
  },

  bindGetUserInfo: function (e) {  //点击授权登录
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.login({
        success: re => {
          if (re.code) {
            request({
              url: '/api/ym/home/wxlogin',
              data: {
                rawData: e.detail.rawData,
                code: re.code,
              },
              method: 'post'
            }).then(res => {
              if (res.data.code == 200) {
                Function.layer('授权登录成功！')
                wx.setStorageSync('members', res.data.data.userInfo);  //用户信息保存本地
                wx.setStorageSync('token', res.data.data.userInfo.token)
                setTimeout(() => {
                  wx.navigateBack();
                }, 1500)
              } else {
                Function.layer(res.data.msg);
              }
            })
          } else {
            Function.layer('登录失败，请稍后重试！');
          }
        }
      })
    } else {
      Function.layer('授权失败，请重新授权！')
    }
  }
})
