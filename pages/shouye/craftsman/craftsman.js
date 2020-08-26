import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    goods_id: '', //店铺id
    comp_id: "", //项目id
    price: '',
    id: '',  //理疗师id
    detail: {},
  },
  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
  },
  forMoreInfoTap2: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      goods_id: options.goods_id,
      comp_id: options.comp_id,
      id: options.id,
      price: options.price  //价格
    })
    this._getteachDetail()
  },
  _getteachDetail() { //获取理疗师详情
    request({
      url: '/api/ym/Doctor/getInfo',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        doctor_id: this.data.id
      }
    }).then(res => {
      console.log(res, '理疗员详情')
      if (res.data.code == 200) {
        this.setData({
          detail: res.data.data
        })
      } else {
        Function.layer('获取理疗师详情失败，请重试或联系工作人员！')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1200)
      }
    })
  },
  quhaoa() {   //取号
    if (this.data.detail.status == 2) {
      Function.layer('该理疗师休息中，请更换其他理疗师！')
      return false;
    }
    if (this.data.detail.status == 3) {
      Function.layer('该理疗师午休中，请稍后取号！');
      return false;
    }
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '提示',
        content: '你还未授权手机是否前往授权',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      // 调用取号
      request({
        url: '/api/ym/Order/getChooseQueue',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          shop_id: this.data.goods_id,
          doctor_id: this.data.id,
          services_id: this.data.comp_id,
          token: wx.getStorageSync('token')
        }
      }).then(res => {
        console.log(res, '取号成功')
        if (res.data.code == 401) {
          wx.showModal({
            title: '提示',
            content: '请登录后再操作！',
            success(res) {
              if (res.confirm) {  //跳转授权手机号
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              }
            }
          })
        } else if (res.data.code == 412) {
          wx.showModal({
            title: '提示',
            content: '请先授权手机号！',
            success(res) {
              if (res.confirm) {  //跳转授权手机号
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              }
            }
          })
        } else if (res.data.code == 200) { //取号成功操作
          var quhao_data = JSON.stringify(res.data.data);
          wx.showToast({
            title: '取号成功！',
            icon: 'success',
            duration: 1500
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '/pages/shouye/success/success?price=' + this.data.price + '&data=' + quhao_data + '&id=' + this.data.goods_id + '&title=' + this.data.detail.name + '&order_id=' + res.data.data.id
            })
          },1000)
        } else if (res.data.code == 302) {
          wx.showModal({
            title: '提示',
            content: '你存在未支付订单,请完成服务后再操作！',
            success: res => {
              if (res.confirm) {
                // console.log('用户点击确定')
                wx.switchTab({
                  url: '/pages/bill/noconsume/noconsume?id=' + this.data.goods_id + '&state=1', //跳未支付订单
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          Function.layer(res.data.msg);
        }
      })
    }
  }
})
