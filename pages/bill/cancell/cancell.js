const app = getApp()
import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    relame: [
      '等待时间太久了',
      '喜爱的治疗师不在',
      '重复排队',
      '到店无人服务',
      '沟通不顺畅',
      '服务态度不好',
      '选错了（店/人/服务）',
      '想换一个治疗师',
      '计划有变',
      '价格贵',
      '有理疗禁忌',
      '其他',

    ],
    activeindex: 0,
    reason_title: '等待时间太久了'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({ id: options.id, goods_id: options.goods_id }) //订单id
  },

  goyew() {  //点击确定
    request({
      url: '/api/ym/Order/cancelChooseQueue',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        order_id: this.data.id,
        shop_id: this.data.goods_id,
        reason: this.data.reason_title
      }
    }).then(res => {
      if (res.data.code == 200) { //取消成功
        Function.layer('该订单已经取消成功！')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        Function.layer(res.data.msg)
      }
    })
  },
  selcty(e) { //点击索引切换
    let idx = parseInt(e.currentTarget.dataset.index);
    if (idx == this.data.activeindex) { return; }
    this.setData({
      activeindex: idx,
      reason_title: e.currentTarget.dataset.item
    })
  }
})