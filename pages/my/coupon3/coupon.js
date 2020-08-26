var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  data: {
    conlist: [], //优惠券列表
    pagesize : 10
  },
  onLoad: function (options) {
    // 验证是否授权
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '提示',
        content: '你还未授权是否前往授权',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          }
        },
      })
    } else {
      this._coupon() //加载优惠券列表
    }
  },
  _coupon() {  //自己的优惠券列表
    request({
      url: '/api/ym/Order/getCouponList',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        token: wx.getStorageSync('token'),
        page: 1,
        pagesize : this.data.pagesize
      }
    }).then(res => {
      console.log(res, '优惠券')
      if (res.data.code == 200) {
        this.setData({
          conlist: res.data.data
        })
      }else{
        Function.layer(res.data.msg)
      }
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      conlist: [],
      pagesize :10
    })
    this._coupon();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  },
  onReachBottom() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.setData({
      pagesize : this.data.pagesize + 10
    })
    setTimeout(() => {
      this._coupon()
      wx.hideLoading()
    }, 1000)
    if(this.data.conlist.length % 10 != 0 ){
      Function.layer('已加载全部历史优惠卷！')
    }
  }
})
