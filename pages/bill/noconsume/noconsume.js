import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    activlen: [{
      name: '待消费'
    }, {
      name: '治疗中'
    }, {
      name: '已完成'
    }, {
      name: '已取消/过号'
    }],
    activeindex: 0,
    statused: 1, //订单状态
    orderObj: [], //订单列表
    array_fuwu: ['刮痧（10min 清热解毒、凉血定惊 ）10元','拔罐（10min 消肿止痛、祛风散寒）10元'],
    pagesize: 10,
    yes_coupon : true  //选择优惠券
  },
  onLoad: function (options) {
    this.setData({
      id: options.id//店铺id
    })
    let that = this;
    if (options.state == 3) {
      that.setData({
        activeindex: 2,
        statused: 3
      })
    }
    if (options.state == 1) {
      that.setData({
        activeindex: 0,
        statused: 1
      })
    }
  },
  _getOrder() { //获取订单列表
    request({
      url: '/api/ym/Order/getList',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        shop_id: this.data.id,
        type: this.data.statused,
        page: 1,
        pagesize : this.data.pagesize
      }
    }).then(res => {
      console.log(res, '订单')
      if (res.data.code == 200) {
          this.setData({
            orderObj: res.data.data
          })
      } else if(res.data.code == 401) {
        wx.showModal({
          title: '提示',
          content: '获取列表失败，请先授权登录！',
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
         Function.layer(res.data.msg);
         setTimeout(()=>{
          wx.switchTab({
            url: '/pages/shouye/index/index'
          })
         },1500)
      }
    })
  },
  godetail(e) { //订单详情页  
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  getIndex(e) {  //点击tap栏获取id
    var activeindex = parseInt(e.currentTarget.dataset.index);
    if (activeindex == this.data.activeindex) {
      return;
    }
    this.setData({
      activeindex,
      statused: activeindex + 1,
      pagesize : 10
    })
    this._getOrder()
  },

  onShow: function () {
    this._getOrder(); //获取订单列表
    this.getFuwuList() //获取附加项目
    this.setData({
      couponPrice: Number(wx.getStorageSync('couponPrice')) //优惠金额
    })
  },
  handle_quxiao(){  //点击取消使用优惠卷
    wx.showModal({
      title: '温馨提示',
      content: '确定取消使用优惠卷吗！',
      success :res=> {
        if (res.confirm) {
          wx.setStorageSync('couponId', '') //清空优惠券id
          wx.setStorageSync('couponPrice', '') //清空优惠券减免金额

          this.setData({
            couponPrice: Number(wx.getStorageSync('couponPrice')), //优惠金额
             yes_coupon : false
          })
        } 
      }
    })
  },
  gopay(e) { //订单点击去支付
    var orderid = e.currentTarget.dataset.orderid;
    var coupon_id = wx.getStorageSync('couponId') || ''; //优惠券id
    request({
      url: '/api/ym/order/pay',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        paytype: 'wechat',
        order_id: orderid,
        token: wx.getStorageSync('token'),
        coupon_code_id: coupon_id
      }
    }).then(res => {
      console.log(res)
      if (res.statusCode == 200) {
        // 这里调用支付接口
        wx.requestPayment({  //调用支付接口
          'timeStamp': res.data.timeStamp.toString(),
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          success: () => {
            wx.setStorageSync('couponId', '') //清空优惠券id
            wx.setStorageSync('couponPrice', '') //清空优惠券减免金额
            this._getOrder();   //获取订单列表
          },
        })
      } else if (res.data.code == 400) {
        Function.layer(res.data.msg)
        this._getOrder();   //获取订单详情
        return false;
      } else {
        Function.layer(res.data.msg)
        this._getOrder();   //获取订单列表
      }
    })
  },
  gopay1(e) { //订单点击去支付
    var orderid = e.currentTarget.dataset.orderid;
    var coupon_id = e.currentTarget.dataset.coupon
    request({
      url: '/api/ym/order/pay',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        paytype: 'wechat',
        order_id: orderid,
        token: wx.getStorageSync('token'),
        coupon_code_id: coupon_id
      }
    }).then(res => {
      console.log(res)
      if (res.statusCode == 200) {
        // 这里调用支付接口
        wx.requestPayment({  //调用支付接口
          'timeStamp': res.data.timeStamp.toString(),
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          success: () => {
            wx.setStorageSync('couponId', '') //清空优惠券id
            wx.setStorageSync('couponPrice', '') //清空优惠券减免金额
            this._getOrder();   //获取订单列表
          },
        })
      } else if (res.data.code == 400) {
        Function.layer(res.data.msg)
        this._getOrder();   //获取订单详情
        return false;
      } else {
        Function.layer(res.data.msg)
        this._getOrder();   //获取订单列表
      }
    })
  },
  getFuwuList(){ //查看服务列表
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
     

    } else {
      request({
        url: '/api/ym/order/getAccessorialServiceList',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '服务列表')
        if (res.data.code == 200) {
          this.setData({
            fuwuList : res.data.data
          })
        } else {
          Function.layer('获取店铺附加服务列表，请稍后重试！')
        }
      })
    }
  },
  bindPickerChange(e){ //点击选择附加服务
   let order_id = Number(e.currentTarget.dataset.index)
  this.setData({
    service_id : this.data.fuwuList[e.detail.value].id //项目id
  })

  var token = wx.getStorageSync('token') || '';
  if (token == '') {
    wx.showModal({
      title: '提示',
      content: '为了保证您的信息安全，请先授权登录！',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  } else {
    request({
      url: '/api/ym.order/getAccessorialService',
      data: {
        token: token,
        order_id : order_id,
        service_id : this.data.service_id
      },
      header: {
        token: token
      }
    }).then(res => {
      console.log(res, '附加项目')
      if (res.data.code == 200) {
        wx.showToast({
          title: '已添加成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          this._getOrder() //重新加载订单
        },500)
      } else {
        Function.layer('附加项目失败，请稍后重试或咨询工作人员！')
      }
    })
  }
  },

  onPullDownRefresh: function () { //下拉事件
    let that = this;
    that.setData({
      orderObj: []
    })
    setTimeout(()=> {
      that._getOrder()
      wx.stopPullDownRefresh()
    }, 1200)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    setTimeout(() => {
      this.setData({
        pagesize: this.data.pagesize + 10
      })
      this._getOrder();
      if (this.data.orderObj.length % 10 != 0) {
        Function.layer('已加载全部订单！')
        return false
      }
      wx.hideLoading()
    }, 1000)
  }
})