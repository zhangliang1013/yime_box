import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    phone: '', //手机号
    cose: '',  //验证码
    time: 60, //倒计时
    ishi: true//是否可以点击
  },
  onLoad: function (options) {
    this.setData({
      windowWidth: app.globalData.windowWidth,
    })
  },

  getphone(e) {  //手机号
    this.setData({
      phone: e.detail.value
    })
  },
  getmima(e) {   //验证码
    this.setData({
      cose: e.detail.value
    })
  },

  _common() {  //发送验证码
    let that = this;
    let data = {
      mobile: that.data.phone,
      event : 'bindingmobile'
    }
    // 发送验证码
    request({
      url: '/api/sms/send',
      data: data
    }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          duration: 1000,
          icon: 'none'
        })
      } else if(res.data.msg == '发送频繁'){
        Function.layer('发送短信频繁，请稍后重试！')
      }
      else {
        Function.layer(res.data.msg)
      }
    })
  },

  bindphobe() {  //点击获取验证码
    var that = this;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.phone))) {
      wx.showToast({
        title: '请正确填写手机号',
        duration: 1000,
        icon: "none"
      })
      return;
    }
    that.setData({ ishi: false });//不可以点击获取验证码
    that._common(); //获取验证码函数
    var time_ed = setInterval(() => { //验证码倒计时处理
      var time = that.data.time;
      if (time == 0) {
        clearInterval(time_ed)
        that.setData({ time: 60, ishi: true })
      } else {
        time--;
        that.setData({ time })
      }
    }, 1000)
  },

  bindOfcose() { //确定绑定
    if (this.data.phone == "") {
      wx.showToast({
        title: '请正确填写手机号',
        duration: 1000,
        icon: "none"
      })
      return;
    }
    this._perfect()
  },
  _perfect() {  //绑定手机
    let that = this;
    let data = {
      mobile: String(that.data.phone),
      captcha: String(that.data.cose),
      event : 'bindingmobile'
    }
    let token = wx.getStorageSync('members').token || '';
      request({
        url: '/api/user/bindingMobileLogin',
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          // wx.setStorageSync('phoneNumber', that.data.phone); //绑定手机号存在本地
          wx.setStorageSync('token', res.data.data.userinfo.token);
          wx.setStorageSync('members', res.data.data.userinfo);
          wx.showToast({
            title: '登录成功',
            duration: 1000,
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        } else if(res.data.code == 305) {
         Function.layer(res.data.msg);
         setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        }else{
          Function.layer(res.data.msg)
           setTimeout(()=>{
            wx.switchTab({
              url: '/pages/shouye/index/index'
            })
           },1500)
        }
      })
  }
})

