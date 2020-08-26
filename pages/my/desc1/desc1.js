var Function = require("../../../utils/function.js");
Page({
  data: {
    bd1:'',
    bd:'', //第一选项
    b:['有时候痛有时候不通','持续性疼痛，但强度不通','一直感觉痛，强度不变'], //第二步的选项
    activeindex:100
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       bd:options.bd, 
     })
  },
  selit(e) { //选择下拉
    console.log(e)
    this.setData({
      activeindex: parseInt(e.currentTarget.dataset.index),
      bd1: e.currentTarget.dataset.item
    })
  },
  next() { 
    if(this.data.bd1 == ''){
      Function.layer('请选择疼痛方式！')
      return false;
    }
    var that = this;
    wx.redirectTo({ //跳转第二步
      url: '../desc2/desc2?bd1=' + that.data.bd1 + '&bd=' + that.data.bd
    })
  }
})