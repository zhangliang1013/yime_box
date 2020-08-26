const app = getApp()
import request from '../../../utils/request'
var Function = require("../../../utils/function.js");

Page({
  data: {
    evaarr: [{ 'name': '全部', type: 0 },
    { 'name': '超级满意', type: 5 }, { 'name': '满意', type: 4 }, { 'name': '不怎么样', type: 3 }
      , { 'name': '不满意', type: 2 }, { 'name': '很失望', type: 1 }],
    pagesize: 1,
    type: 0,
    activeindex: 0,
    id: '', //店铺id
    isbottom: true,
    pinarr: [], //门店评论数据
    noData: false
  },
  onLoad: function (options) {
    this.setData({ id: options.id })
    this._fulldiscuss()
  },
  //预览图片
  previewImage: function (e) {
    let that = this;
    let index = Function.getDataSet(e, 'index');
    let url = Function.getDataSet(e, 'url');  //当前
    wx.previewImage({
      current: url,                  // 当前显示图片的http链接
      urls:  that.data.pinarr[index].images// 需要预览的图片http链接列表
    })
  },
  _fulldiscuss() {   //门店评价列表
    request({
      url: '/api/ym/Discuss/getShopDiscuss',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        page: this.data.pagesize,
        shop_id: this.data.id,
        type: this.data.type,
        pagesize: 10
      }
    }).then(res => {
      if (res.data.code == 200) {
        if (res.data.data.length == 0 && this.data.pagesize == 1) {
          this.setData({
            noData: true
          })
        } else {
          if (this.data.pinarr.length == 0) {
            this.setData({
              pinarr: res.data.data
            })
          } else {
            this.setData({
              pinarr: [...this.data.pinarr, ...res.data.data]
            })
          }

        }
        console.log(res, '评论数据')
      } else {
        wx.showToast({
          title: '获取评论失败，请返回！',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },
  seleall(e) { //点击筛选
    let type = e.currentTarget.dataset.type;
    let activeindex = e.currentTarget.dataset.index;
    if (activeindex == this.data.activeindex) {
      return;
    }
    this.setData({
      activeindex, type, 
      pagesize: 1, 
      pinarr: [], 
      isbottom: true,
      noData: false
    })
    this._fulldiscuss()
  },
  onReachBottom() {   //上拉加载
    let that = this;
    wx.showLoading({ title: '正在加载', mask: true })
    setTimeout(() => {
      that.data.pagesize + 1;
      that._fulldiscuss();
      wx.hideLoading()

      if (that.data.pinarr.length % 10 != 0) {
        Function.layer('已加载全部评论！')
      }
    }, 1000)
  }
})
