import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    id:'',  //店铺id
    detaile:{},
    zhe_one : false,
    zhe_two: false,
    zhe_three : false
  },
  onLoad: function (options) {
    this.setData({id:options.id});  //门店id
    this._getDetail();
  },
  handle_one(){
   this.setData({
     zhe_one : false
   })
  },
  handle_one1(e){
   this.setData({
     content_id : e.currentTarget.dataset.content,
     name_ : e.currentTarget.dataset.name,
     zhe_one : true
   })
  },
  _getDetail(){   //获取门店详情
    let that =this;
    request({
      url :'/api/ym/Shop/get',
      data : {
        shop_id : Number(that.data.id)
      }
    }).then(res =>{
      console.log(res,'店铺详情')
      if(res.data.code == 200){
        this.setData({
          detaile : res.data.data
        })
      }else{
        Function.layer(res.data.msg);
      }
    })
  },
// 点击跳转项目
handle_router(e){
 if(this.data.detaile.status != 1){
  wx.showModal({
    title: '提示',
    content: '该店铺暂时未营业,请选择其他店铺',
    success (res) {
      if (res.confirm) {
        // console.log('用户点击确定')
        wx.switchTab({
          url: '/pages/shouye/index/index'
        })
      } 
    }
  })
 }else{
  wx.showModal({
    title: '温馨提示',
    content: '怀孕、体内有金属异物(包括钢板、钢钉等)、骨折及术后、出血性疾病、高热、皮肤感觉异常、恶性肿瘤、活动型肺结核、传染性疾病、严重心脑血管疾病、装有心脏起博器者不宜体验。\n 点击确定表示无上述不宜体验情况，并取号理疗。',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/shouye/selectPerson/selectPerson?goods_id=' + e.currentTarget.dataset.goods_id + '&comp_id=' + e.currentTarget.dataset.comp_id + '&title=' +
          e.currentTarget.dataset.title  + '&price=' + e.currentTarget.dataset.price
        })
      } 
    }
  })
 }
},
  penmap(e) {  //调用地图
    let that = this;
    wx.openLocation({
      latitude: Number(that.data.detaile.latitude),
      longitude: Number(that.data.detaile.longitude),
      scale: 18,
      name: that.data.detaile.address,
      success: function () { }
    })
  },
})
