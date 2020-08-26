// pages/desc/desc.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lenove:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ lenove:JSON.parse(options.lenove)})
  },

})