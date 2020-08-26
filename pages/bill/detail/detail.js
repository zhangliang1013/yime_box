import ruquest from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    obj: {} //订单详情
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  onShow() {
    this.setData({
      couponPrice: Number(wx.getStorageSync('couponPrice'))   //优惠金额
    })
    this.getOrderDetail() //获取订单详情
  },
  getOrderDetail() {
    ruquest({
      url: '/api/ym/Order/getOrderDetails',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        order_id: this.data.id,
        token: wx.getStorageSync('token')
      }
    }).then(res => {
      console.log(res, '详情')
      if (res.data.code == 200) {
        this.setData({
          obj: res.data.data,
          total: Number(res.data.data.total)
        })
      } else {
        Function.layer(res.data.msg)
      }
    })
  },
  gopay(e) {  //点击立即支付
    var coupon_id = wx.getStorageSync('couponId') || ''; //优惠券id
    var orderid = e.currentTarget.dataset.order;
    ruquest({
      url: '/api/ym/order/pay',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        // paytype: 'wechat',
        order_id: orderid,
        token: wx.getStorageSync('token'),
        coupon_code_id: coupon_id
      }
    }).then(res => {
      console.log(res, '支付')
      if (res.statusCode == 200) {
        // 这里调用支付接口
        wx.requestPayment({  //调用支付接口
          'timeStamp': res.data.timeStamp.toString(),
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          success: () => {
            wx.setStorageSync('coupon_id', '') //清空优惠券id
            wx.setStorageSync('couponPrice', '') //清空优惠券减免金额
            this.getOrderDetail() //获取订单详情
          },
        })
      } else if (res.data.code == 400) {
        Function.layer(res.data.msg)
        this.getOrderDetail() //获取订单详情
        return false;
      } else {
        Function.layer(res.data.msg)
        this.getOrderDetail() //获取订单详情
      }
    })
  }
})