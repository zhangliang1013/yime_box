import request from '../../utils/request.js'
var Function = require("../../utils/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    obleb: [],//针对方案列表
    pages: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getback();
  },
  getback() {  //获取方案列表
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
          }
        }
      })
    } else {
      request({
        url: '/api/ym/Order/getTreatmentList',
        data: {
          token: token,
          page: this.data.pages,
          pagesize: 10
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '针对方案')
        if (res.data.code == 200) {
          if (this.data.obleb.length == 0) {
            this.setData({
              obleb: res.data.data
            })
          } else {
            this.setData({
              obleb: [...this.data.obleb, ...res.data.data]
            })
          }
        } else {
          Function.layer(res.data.msg)
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pages: 1,
      obleb: []
    })
    this.getback();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  },
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    setTimeout(() => {
      this.setData({
        pages: this.data.pages + 1
      })
      this.getback();
      if (this.data.obleb.length % 10 != 0) {
        Function.layer('已加载全部方案！')
        return false
      }
      wx.hideLoading()
    }, 1000)
  }
})