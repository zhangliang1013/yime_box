import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    bd: '',
    bd1: '',
    c: ['白天居多', '晚上居多', '时间不定'], //第三步选项
    d: ['曾有重大疾病或手术史', '无'], //第三步选项
    index1: 100,
    index2: 100,
    bd2: '',
    bd3: '',
    zfad: false, //领取红包的弹窗
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      bd: options.bd,
      bd1: options.bd1
    })
  },
  seone(e) {
    this.setData({
      index1: parseInt(e.currentTarget.dataset.index),
      bd2: e.currentTarget.dataset.item
    })
  },
  setwo(e) {
    this.setData({
      index2: parseInt(e.currentTarget.dataset.index),
      bd3: e.currentTarget.dataset.item
    })
  },

  overd(e) {
    this.setData({
      zfad: true
    })
  },

  getrcoe() {  //点击完成
    if(this.data.bd2 == ''){
      Function.layer('请选择疼痛时间！')
      return false;
    }
    if(this.data.bd3 == ''){
      Function.layer('请选择是否有既往史！')
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
              url: '/pages/auth/auth',
            })
          }
        }
      })
    } else {
      request({
        url: '/api/ym.perfect/createPerfect',
        method: 'post',
        data: {
          token: token,
          part: this.data.bd,
          mode: this.data.bd1,
          duration: this.data.bd2,
          past: this.data.bd3
        },
        header: {
          token: token
        }
      }).then(res => {
         console.log(res,'个人档案')
        if (res.data.code == 200 || res.statusCode == 304 ) {
          wx.showModal({
            title: '提示',
            content: '已经添加档案完成！',
            success: res => {
              if (res.confirm) {
                this.setData({
                  zfad: true
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {
          Function.layer('添加档案失败，请稍后重试')
          setTimeout(res => {
            wx.navigateTo({
              url: '/pages/my/desc/desc'
            })
          }, 1500)
        }
      })
    }
  },
  gphone() {    //点击领取红包
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
        url: '/api/ym.perfect/createPerfectAward',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        if (res.data.code == 400) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                    url: '/pages/my/desc5/desc5'
                  })
              }
            }
          })
        } else if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '领取优惠券成功！',
            success(res){
              if (res.confirm) {  
                wx.redirectTo({
                    url: '/pages/my/desc5/desc5'
                  })
              }
            }
          })
        }else{
          Function.layer(res.data.msg)
        }
      })
    }
  }
})