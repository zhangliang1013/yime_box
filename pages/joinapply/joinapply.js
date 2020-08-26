import request from '../../utils/request.js'
var Function = require("../../utils/function.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1: '',
    value2: '',
    value3: '',
    textarea: '',
    switchChecked: false, //行业经验开关
    customItem: '全部',
    array: ['8:00-12:00', '14:00-18:00', '18:00以后', '任何时间都方便'],
    time_ : '请选择',
    arae : '请选择'
  },

  bindRegionChange(e) { //地区选择器
    console.log(e)
    this.setData({
      arae : e.detail.value[0] +  e.detail.value[1] +  e.detail.value[2]
    })
  },
  bindPickerChange(e){  //时间选择器
    // console.log(e)
    if(e.detail.value == 0){
      this.setData({
        time_: '8:00-12:00'
      })
    }else if(e.detail.value == 1){
      this.setData({
        time_: '14:00-18:00'
      })
    }else if(e.detail.value == 2){
      this.setData({
        time_: '18:00以后'
      })
    }else if(e.detail.value == 3){
      this.setData({
        time_: '任何时间都方便'
      })
    }
  },

  handle_value1(e) {
    this.setData({
      value1: e.detail.value
    })
  },
  handle_value2(e) {
    this.setData({
      value2: e.detail.value
    })
  },
  handle_value3(e) {
    this.setData({
      value3: e.detail.value
    })
  },
  handleText(e) { //监听文本域的值
    // console.log(e)
    this.setData({
      textarea: e.detail.value
    })
  },

  switch1Change(e) { //是否有经验开关
   if(e.detail.value == true){
    this.setData({
      switchChecked: true,
      jingyan : '有'
    })
   }else{
    this.setData({
      switchChecked: false,
      jingyan : '没有'
    })
   }
  },
  handle_submit(e) { //点击提交事件
    
    if(this.data.value1 == ''){
      Function.layer('请填写姓名！');
      return ;
    }
    if(this.data.value2 == ''){
      Function.layer('请填写手机号！');
      return ;
    }
    if(this.data.value3 == ''){
      Function.layer('请填写邮箱！');
      return ;
    }

    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		if(reg.test(this.data.value3)){
	
		}else{
      Function.layer('邮箱格式有误，请重新输入！'); 
      return false; 
		}

    if(!(/^1[3456789]\d{9}$/.test(this.data.value2))){ 
      Function.layer('手机号有误，请重新输入！'); 
      return false; 
    } 
    if(this.data.arae == '请选择'){
      Function.layer('请选择您的意向合作地区！');
      return ;
    }
    if(this.data.time_ == '请选择'){
      Function.layer('请选择您的方便时间段！');
      return ;
    }

    var  token = wx.getStorageSync('token')  || '';
    if(token == ''){
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } 
        }
      })
    }else{
       request({
         url : '/api/common/applyCompany',
         method : 'post',
         header : {
           token : token
         },
         data: {
           token : token,
           name : this.data.value1,
           phone : this.data.value2,
           email :  this.data.value3,
           district : this.data.arae,
           freetime : this.data.time_,
           is_experience : this.data.jingyan,
           other : this.data.textarea
         },
         header : {
           token : token
         }
       }).then(res =>{
         console.log(res,'个人信息')
         if(res.data.code == 200){
          wx.showModal({
            title: '提示',
            content: '您提交的申请加盟已接受,请等待联系！',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/my/mine/mine'
                })
              } 
            }
          })
         }else if(res.data.code == 400){
          wx.showModal({
            title: '提示',
            content: '您已经提交过加盟申请,请勿重复操作！',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/my/mine/mine'
                })
              } 
            }
          })
         }else{
          Function.layer('申请加盟失败,请稍后重试！');
         }
       })
    }
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})