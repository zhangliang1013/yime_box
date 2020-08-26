import request from '../../../utils/request.js';
var Function = require("../../../utils/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    username: '',
    nickname: '',
    fullname: '',
    birthday: '',
    prell: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 进来加载渲染
    this.userDetail();
  },
  handleInput1(e) {  //昵称
    //  console.log(e.detail.value)
    this.setData({
      nickname: e.detail.value
    })
  },
  handleInput3(e) {
    this.setData({
      fullname: e.detail.value
    })
  },
  handleInput4(e) {
    this.setData({
      email: e.detail.value
    })
  },
  bindDateChange(e) { //生日
    //  console.log(e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },

  userDetail() {  //用户详情
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
        url: '/api/user/index',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        //  console.log(res)
        if (res.data.code == 200) {
          this.setData({
            avatar: res.data.data.avatar,
            nickname: res.data.data.nickname,
            fullname: res.data.data.fullname,
            birthday: res.data.data.birthday,
            mobile: res.data.data.mobile,
            email: res.data.data.email
          })
        }
      })
    }
  },
  handle_save() {  //点击保存更改
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
      if (this.data.nickname == '') {
        Function.layer('请输入昵称！')
        return false;
      }
      if (this.data.fullname == '') {
        Function.layer('请输入姓名！')
        return false;
      }
      if (this.data.birthday == '' || this.data.birthday == null) {
        Function.layer('请输入生日！')
        return false;
      }
      request({
        url: '/api/user/profile',
        data: {
          token: token,
          nickname: this.data.nickname,
          fullname: this.data.fullname,
          birthday: this.data.birthday,
          avatar: this.data.avatar
        },
        header: {
          token: token,
        }
      }).then(res => {
        console.log(res, '修改')
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '温馨提示,个人信息已经修改成功！',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/my/mine/mine'
                })
              }
            }
          })
        } else {
          Function.layer('修改失败，请稍后重试！')
        }
      })
    }
  },
  selctPhone(e) {  //点击上传图片
    let that = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        let tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://www.imebox.cn/api/common/upload',   //服务器地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success: res => {
            let url = JSON.parse(res.data)
            if (url.code == 200) {
              Function.layer('上传成功！')
              this.setData({
                avatar: 'http://' + url.data.url
              })
            } else {
              Function.layer('上传失败，请重试或者联系工作人员！')
            }
          }
        })
      }
    })
  }
})