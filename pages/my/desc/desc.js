const app = getApp()
var Function = require("../../../utils/function.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    sta:1,
    a:['颈部','背部','腰部','大腿','小腿','脚'], // 第一步选项
    activeindex:100,
    bd:'' //第一项选中
  },
  onLoad: function (options) {
    
  },
  selit(e){
    this.setData({
      activeindex:parseInt(e.currentTarget.dataset.index),
      bd: e.currentTarget.dataset.item
    })
  },
  next(){ //点击下一步
  if(this.data.bd == ''){
    Function.layer('请选择疼痛位置！')
    return false;
  }
    var that = this;
    wx.redirectTo({ 
      url: '../desc1/desc1?bd=' + that.data.bd 
    })
  }
})