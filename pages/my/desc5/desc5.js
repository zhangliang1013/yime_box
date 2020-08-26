import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_shan : false , //是否显示删除按钮
    dangList : []
  },
  onLoad: function (options) {
  },
  danganList(){
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
         url : '/api/ym.perfect/getPerfectList',
         data: {
           token : token,
           page : 1
         },
         header : {
           token : token
         }
       }).then(res =>{
         console.log(res,'个人档案')
        if(res.data.code == 200){
           this.setData({
           dangList : res.data.data
           })

           if(res.data.data.length == 0){  //没数据到添加页面
            wx.showModal({
              title: '提示',
              content: '您暂无个人档案，是否前往添加！',
              success (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/my/desc/desc'  
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
           }
        }else{
          Function.layer('获取档案失败,请联系工作人员！')
          wx.navigateBack({
            delta: 1
          })
        }
       })
    }
  },
  hand_dele(){ //点击下面删除
  this.setData({
   is_shan : true
   })
  },
  hand_shan(e){ //点击单个档案删除
    console.log(e)
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
  wx.showModal({
    title: '提示',
    content: '您确定要删除该档案吗？',
    success : res=> {
      if (res.confirm) {
        // console.log('用户点击确定')
        request({
          url : '/api/ym.perfect/deletePerfect',
          data: {
            token : token,
            perfect_id : e.currentTarget.dataset.index
          },
          header : {
            token : token
          }
        }).then(res =>{
          console.log(res,'shanchu')
          if(res.data.code == 200){
            wx.showToast({
              title: '该档案已经删除成功！',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
               this.setData({
                is_shan : false
               })
               this.danganList();
            }, 1000);
          }else{
            wx.showModal({
              title: '提示',
              content: '删除失败，请稍后重试！',
              success : res=> {
                if (res.confirm) {
                  this.setData({
                    is_shan : false
                   })
                } else if (res.cancel) {
                  this.setData({
                    is_shan : false
                   })
                }
              }
            })
          }
        })
      } else if (res.cancel) {
       this.setData({
        is_shan : false
       })
      }
    }
  })
}
  },
  handDateil(e){ //查看档案详情
    wx.navigateTo({
      url: '/pages/my/desc4/desc4?id='+ e.currentTarget.dataset.id
    })
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
    this.danganList()  //个人档案列表
  }
})