import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    state: 0  //开通状态
  },
  onLoad: function (options) {
    this.setData({
      group_id: Number(options.group_id)
    })
  },
 //开通支付
  getPayInfo() {
    if(this.data.group_id == 2){
    Function.layer('您已开通过bang权益！')
    return false;
    }
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }
        }
      })
    } else {
      request({
        url: '/api/ym.bang/buyBang',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '开通bang权益')
        if (res.statusCode == 200) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            success: ()=> {
             Function.layer('恭喜您已成功开通bang权益！')
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/my/mine/mine'
              })
            },1000)
            },
            fail: ()=> {
            // Function.layer('开通bang权益失败，请稍后重试获取联系工作人员！')
            }
          })
        } else {
          Function.layer('开通bang权益失败，请稍后重试获联系工作人员！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }
        }
      })
    } else {
      request({
        url: '/api/ym.bang/getBang',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '到期时间')
        if (res.data.code == 200) {
          this.setData({
            dao_date : res.data.data.end_time,
            status : res.data.data.status
          })
        } else {
          Function.layer('获取bang权益到期时间失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  }
})