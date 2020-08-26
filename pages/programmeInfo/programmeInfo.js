var Function = require("../../utils/function.js");
import request from '../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail : {} //详情
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){  //订单id
      this.setData({
        id: options.id
      })
      this.plan_detail(options.id);
    }
  },
  //获取针对方案详情
  plan_detail: function (id){
    request({
      url : '/api/ym/Order/getTreatment',
      data : {
        order_id : id,
        token : wx.getStorageSync('token')
      },
      header: {
        token : wx.getStorageSync('token')
      },
    }).then(res => {
      console.log(res)
      if(res.data.code = 200 ){
        this.setData({
          detail : res.data.data
        })
      }else{
        Function.layer(res.data.msg)
      }
    })
  },
  handle_zhen(){ //点击同意转诊
    request({
      url : '/api/ym/Order/updateReferral',
      header: {
        token : wx.getStorageSync('token')
      },
      data : {
        order_id : this.data.detail.id,
        token : wx.getStorageSync('token')
      }
    }).then(res=>{
      // console.log(res,'同意转诊')
      if(res.data.code == 200){
        wx.showToast({
          title: '同意转诊成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=> {
          wx.navigateBack({
            delta: 1
          })  
        },1500)
      }else {
       Function.layer(res.data.msg)
        setTimeout(()=> {
          wx.navigateBack({
            delta: 1
          })
        })
      }
    })
  }
})