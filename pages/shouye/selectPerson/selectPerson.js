import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    hideJin: false,
    mote: [] //理疗师数组
  },
  onLoad: function (options) {
    this.setData({
      goods_id: options.goods_id,    //店铺id
      comp_id: options.comp_id,      //项目id
      xiang_title: options.title,  //项目名称
      price: options.price
    })
    this._getTeach() //获取理疗师 
  },
  showModal() {
    this.setData({ hideJin: true })
  },
  hideModal() {
    this.setData({ hideJin: false })
  },
  _getTeach() {   //获取对应的理疗师
    var token = wx.getStorageSync('token');
    if (token) {
      let data = {
        shop_id: this.data.goods_id,
        services_id: this.data.comp_id,
        token: token
      };
      request({
        url: '/api/ym/Shop/getSelectDoctor',
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          this.setData({
            mote: res.data.data
          })
        } else if (res.data.code == 400) {
          Function.layer('暂无理疗师！')
        }
        else {
          Function.layer(res.data.msg)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先授权登录,再进行操作',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '登录失败，请重新登录',
              duration: 2000
            })
          }
        }
      })
    }
  },
  raginhao(e) {    //点击取号
    var eid = e.currentTarget.dataset.id;   //理疗师id
    var status = e.currentTarget.dataset.status;
    if (status == 2) {
      Function.layer('该理疗师休息中，请更换其他理疗师！')
      return false;
    }
    if (status == 3) {
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
          doctor_id: eid,
          services_id: this.data.comp_id,
          token: wx.getStorageSync('token')
        }
      }).then(res => {
        console.log(res,'取号接口')
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
            duration: 2000
          })
         
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/shouye/success/success?price=' + this.data.price + '&data=' + quhao_data + '&id=' + this.data.goods_id + '&title=' + this.data.xiang_title  + '&order_id=' + res.data.data.id
          })
        },1200)
        } else if (res.data.code == 302) {
          wx.showModal({
            title: '提示',
            content: '你存在未支付订单,请完成服务后再操作！',
            success: res => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/bill/noconsume/noconsume?id=' + this.data.goods_id + '&state=1', //跳未支付订单
                })
              }
            }
          })
        } else {
          Function.layer(res.data.msg)
        }
      })
    }
  }
})