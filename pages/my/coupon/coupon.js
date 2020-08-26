var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  data: {
    conlist: [], //优惠券列表
    strl: '', //兑换码
    price: 0, //订单价钱
    pagesize: 10
  },
  onLoad: function (options) {
    if (options.price) {
      this.setData({
        price: Number(options.price) //订单的金额
      })
    }
    if (options.coupon) {
      this.setData({
        coupon_id: options.coupon  //最优优惠卷id
      })
    }
  },

  onShow: function () {
    var coupon_id = wx.getStorageSync('couponId') || '';
    if (coupon_id != '') {  //自己选的优惠卷id
      this.setData({
        coupon_id: coupon_id
      })
    }
    // 获取优惠卷列表
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

    // 已经选择的置顶
    setTimeout(() => {
      if (this.data.coupon_id && this.data.conlist.length != 0) {
        var coupon_list = this.data.conlist;
        var couponM = coupon_list.filter((v, i) => {
          return v.id == this.data.coupon_id
        })
        if (couponM.length == 0) {
          return false;
        }

        for (let i = 0; i < coupon_list.length; i++) {
          if (coupon_list[i].id == this.data.coupon_id) {
            coupon_list.splice(i, 1);
            break;
          }
        }

        coupon_list.unshift(couponM[0])
        this.setData({
          conlist: coupon_list
        })
      }
    }, 200)
  },

  handle_sao() { //扫码点击事件
    wx.scanCode({
      success(res) {
        console.log(res)
        Function.layer('抱歉，此功能暂未上线！')
      },
      fail(res) {
        console.log(res, 'shibai')
        Function.layer('抱歉，此功能暂未上线！')
      }
    })
  },
  getScene: function (scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
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
        pagesize: this.data.pagesize
      }
    }).then(res => {
      console.log(res, '优惠券')
      if (res.data.code == 200) {
        this.setData({
          conlist: res.data.data
        })
      } else {
        Function.layer(res.data.msg)
      }
    })
  },
  keyvalue(e) {  //拿到文本框的值
    this.setData({
      strl: e.detail.value
    })
  },
  lgerve() { //点击立即兑换
    let token = wx.getStorageSync('token') || '';
    if (token != '') {
      this.data.strl != "" ? this.setcoupon() : wx.showToast({
        title: '劵码不能为空',
        duration: 1000,
        icon: 'none'
      });
    } else {
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
    }
  },
  setcoupon() { //兑换
    let token = wx.getStorageSync('token') || '';
    request({
      url: '/api/ym/Order/exchangeCoupon',
      header: {
        token: token
      },
      data: {
        coupon_code: this.data.strl,
        token: token
      }
    }).then(res => {
      console.log(res)
      if (res.data.code == 400) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          success: res => {
            if (res.confirm) {
              this._coupon();
              this.setData({
                strl: ''
              })
            }
          }
        })
      } else if (res.data.code == 200) {  //兑换成功
        this.setData({
          conlist: res.data.data
        })
      } else {
        Function.layer(res.data.msg);
      }
    })
  },
  linkeTo(e) {  //优惠券详情
    let str = JSON.stringify(this.data.conlist[parseInt(e.currentTarget.dataset.index)]);
    wx.navigateTo({
      url: '../coupon2/coupon2?lenove=' + str
    })
  },
  mommeng(e) {   //点击去使用
    let index = parseInt(e.currentTarget.dataset.indexd);
    if (this.data.conlist[index].status == 2) {
      Function.layer('该优惠券已经使用,不可重复使用！')
      return false;
    }
    if (this.data.price == 0) {
      wx.switchTab({
        url: '/pages/shouye/index/index'
      })
    } else {
      if (this.data.price < Number(this.data.conlist[index].coupon.full_price)) {
        wx.showToast({
          title: '不符合满减要求',
          duration: 1000,
          icon: 'none'
        })
        return false;
      } else {
        wx.showToast({
          title: '使用成功',
          duration: 1000
        })
        setTimeout(() => {
          wx.setStorageSync('couponId', this.data.conlist[index].id);  //订单id
          wx.setStorageSync('couponPrice', Number(this.data.conlist[index].coupon.less_price));
          wx.navigateBack() //返回上个页面
        }, 1300)
      }
    }
  },
  choose_you() { //点击已经选择
    Function.layer('该优惠卷已选择，可点击其他优惠卷进行更换！');
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      conlist: [],
      pages: 1,
      pagesize: 10
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
      pagesize: this.data.pagesize + 10
    })
    setTimeout(() => {
      this._coupon()
      wx.hideLoading()
    }, 1000)
    if (this.data.conlist.length % 10 != 0) {
      Function.layer('已加载全部优惠卷！')
    }
  },
  handle_tiao() {
    wx.navigateTo({
      url: '/pages/my/coupon3/coupon'
    })
  }
})
