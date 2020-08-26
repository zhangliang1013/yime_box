import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    yanmi_du:{},   //取号成功的信息
    numberSuc:true,  //取号信息提示
    plove:{}   ,
    array_fuwu: ['刮痧（10min 清热解毒、凉血定惊 ）10元','拔罐（10min 消肿止痛、祛风散寒）10元'],
    order_id : '',
    fuwuList : []
  },
  getFuwuList(){ //查看服务列表
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
        url: '/api/ym/order/getAccessorialServiceList',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '服务列表')
        if (res.data.code == 200) {
          this.setData({
            fuwuList : res.data.data
          })
        } else {
          Function.layer('获取店铺附加服务列表，请稍后重试！')
        }
      })
    }
  },
  bindPickerChange(e){ //点击选择附加服务
  this.setData({
    service_id : this.data.fuwuList[e.detail.value].id //项目id
  })
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
      url: '/api/ym.order/getAccessorialService',
      data: {
        token: token,
        order_id : this.data.order_id,
        service_id : this.data.service_id
      },
      header: {
        token: token
      }
    }).then(res => {
      console.log(res, '附加项目')
      if (res.data.code == 200) {
        wx.showToast({
          title: '已添加成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/bill/noconsume/noconsume?id=' + this.data.id + '&state=1'
          })
        },1500)
      } else {
        Function.layer('附加项目失败，请稍后重试或咨询工作人员！')
      }
    })
  }
  },
  onLoad: function(options) {
    this.getFuwuList()//获取附加项目
    this.setData({
      yanmi_du : JSON.parse(options.data),
      price : options.price,
      title : options.title,
      id : options.id , //店铺id
      order_id : options.order_id
    })
  },
  showNum:function(){ //点击我知道了
    let that=this; 
    that.setData({
      numberSuc:false
    })
  },
  showModal() { //点击查看排队
    wx.switchTab({
      url: '/pages/bill/noconsume/noconsume?id=' + this.data.id + '&state=1'
    })
  },
  openmap(){  //打开地图
    let that = this;
    wx.openLocation({
      latitude: that.data.lat,
      longitude: that.data.log,
      name:that.data.plove.goods_name,
      success:function(res){
      }
    })
  }
})