import { Access } from 'utils/access.js';
// 引入封装的request异步请求
import request from './utils/request.js'
App({
  onLaunch: function (options) {
    //封装的request请求加基准路径
    request.defaults.baseURL = "https://www.imebox.cn";
    // 查看是否授权
    var token = wx.getStorageSync('token');
    if (!token) {
      var access = new Access();
      access.login();
    }

    if (options.scene == 1047) {  //小程序码进
      var user_id = wx.getStorageSync('members').user_id;
      request({
        url: '/api/ym.share/statisticsDoctorCode',
        header: {
          token: token
        },
        data: {
          token: token,
          user_id: user_id
        }
      }).then(res => {
        // console.log(res,'11')
        if (res.data.code == 200) {
          console.log('统计成功！')
        } else {
          console.log('统计失败！')
        }
      })
    }
    if (options.query.state == 3) {
      wx.switchTab({
        url: '/' + options.path
      })
      this.globalData.state = 3
    }
    // wx.setStorageSync('topid', options.query.top_id)
    // if (options.query.top_id){ //第一次进来没执行
    //   // console.log(6666)
    //   wx.getSetting({
    //     success: function (res) {
    //       if (res.authSetting['scope.userInfo']) {
    //         var members = wx.getStorageSync('members');
    //         if (!members) {
    //           var access = new Access();
    //           wx.getUserInfo({  //获取用户信息
    //             success: function (rs) {
    //               var userinfo = rs.userInfo;
    //               access.updateUserInfo(userinfo); //授权信息保存本地
    //             }
    //           })
    //         }
    //       } else {   //未授权跳转到授权页面
    //         wx.navigateTo({
    //           url: '/pages/auth/auth'
    //         })
    //       }
    //     }
    //   })
    // }
    // 拿到用户信息
    // var members = wx.getStorageSync('members');
    // if (!members.openid) {
    //   var access = new Access();
    //   wx.getUserInfo({
    //     lang: 'zh_CN',
    //     success: function (rs) {
    //      var userinfo = rs.userInfo;
    //      access.updateUserInfo(userinfo);  //进来进行授权
    //     }
    //   })
    // }
  },
  onShow: function () {

  },
  //验证手机号码
  validatePhone: function (phoneNum) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(phoneNum)) {
      return false;
    } else {
      return true;
    }
  },
  globalData: {
    su_id: '',
    state: ''
  }
})