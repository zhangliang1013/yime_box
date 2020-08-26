// 刚进来授权
class Access {
  constructor() {
  }
  // 调用登录
  login(res) {
    var token = wx.getStorageSync('token') || '';
    //  调用登录接口
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success(users) {
              wx.request({
                url: 'https://www.imebox.cn/api/ym/home/wxlogin',
                data: {
                  code: res.code,
                  rawData: users.rawData,
                  token: token
                },
                method: 'post',
                header: {
                  'content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res, '登录返回')
                  if(res.data.code == 200){
                    wx.setStorageSync('members', res.data.data.userInfo);  //用户信息保存本地
                    wx.setStorageSync('token',res.data.data.userInfo.token)
                  }else{
                    wx.setStorageSync('token','')
                    wx.showModal({
                      title: '提示',
                      content: '请先授权登录,再进行操作',
                      success (res) {
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
                }
              })
            }
          })
        }
      }
    })
  }
}
export { Access };