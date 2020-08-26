import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    longitude:0,
    latitude: 0,
    markers:[], //地图标记点
    maparr:[],  //所有门店的位子 
    accuracy:0,
    count:0, //店铺总数
    zero:19999,
    id:'', 
    isclick:false,
    deles:{}, //选中店铺信息
    animationData:'' //动画
  },
  // 接收传过来的经纬度
  onLoad: function (options) {
    var that=this
    this.setData({ longitude: options.jingdu, latitude:options.weidu})
    this._maplist()
  },

  createMarker(marke) { //创建标记点
    let markers = [];
    for (let j = 0; j < marke.length;j++){
      let marker = {
        id:j,
        iconPath: "/images/selt-id.png",
        latitude: marke[j].latitude,
        longitude: marke[j].longitude,
        width: 52,
        height: 60,
        status:false //标记选中
      };
      markers.push(marker)
    }
    this.setData({ markers})
   },

  //  点击地图点触发事件
  markertap(e) {
    var that =this;
    var animation = wx.createAnimation({ //创建动画
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translate(0, 300).step()
    that.setData({
      animationData: animation.export()
    })
     let j = parseInt(e.markerId);
     let markers = this.data.markers;
     markers.forEach((item,index)=>{   //选中图标的显示
         if(index == j){
           if (item.status){
              return;
            }else{
             item.status = true       //选中状态  
             item.iconPath = "/images/setbank.png"//选中的图
           }  
         }else{
           item.status =false;
           item.iconPath = "/images/selt-id.png"
         }
     })
     this.setData({
       markers,          
       id: this.data.maparr[j].id, //店铺id
     })
    this.mapshow() //拿到店铺信息
  },

  _maplist(){    //请求地图的店
     let that =this;
     let data ={
      longitude: that.data.longitude,
      latitude: that.data.latitude
     };
    request({
      url : '/api/ym/Shop/getMapShopList',
      data : data 
    }).then(res => {
      console.log(res ,'地图')
      if(res.data.code == 200){
         this.setData({
          maparr:res.data.data.items, 
          count : res.data.data.total
         })
         that.createMarker(that.data.maparr)
      }else{
        Function.layer(res.data.msg);
      }
    })
  },
  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
  },
  mapshow:function(){    //选中店铺信息展示
    let that = this;
    let data = {
      shop_id:that.data.id,
      longitude: that.data.longitude,
      latitude: that.data.latitude
    };
  
    request({
      url : '/api/ym/Shop/getMapShopList',
      data : data 
    }).then(res => {
      console.log(res ,'店铺详情')
      if(res.data.code == 200){
        this.setData({
          deles : res.data.data
        })
        var animation = wx.createAnimation({
          duration: 800,
          timingFunction: "linear",
          delay: 0
        })
        that.animation = animation
        animation.translate(0,0).step()
        that.setData({
          animationData: animation.export()
        })
      }else{
        Function.layer(res.data.msg)
      }
    })
  },

  gogun(e){  //点击去理疗 
    let id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../detail/detail?id='+id
    })
  }
})