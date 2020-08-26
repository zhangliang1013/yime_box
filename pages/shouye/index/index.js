import request from '../../../utils/request'
var Function = require("../../../utils/function.js");
Page({
  data: {
    islog: false, //进来加载
    islog_ed: false, //地理位子授权
    imgUrls: [ //轮播图
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    ],
    cityIndex: 0,  //城市索引
    active_endIndex: 0, //区域索引
    jingdu: '', //经度
    weidu: '', //纬度
    list: [],
    page: 1, //默认第一页
    city: '', //当前城市
    allCity: ['广州市', '白云区'], //城市数组
    is_search: false, //城市弹窗
    showlist: [], //店铺列表
    cityss: '广州市', //搜索默认城市
    lately_serve: false, //上次师傅信息
    lately: {}, //上次服务技师
    isShow : false//是否显示点击置顶
  },
  link: function (e) {
    let url = Function.getDataSet(e, 'url');
    Function.linkTo(url);
  },
  onLoad: function (options) { //页面进来加载

  },
  // 跳转的零度介绍页面
  handleLingdu() {
    wx.navigateTo({
      url: '../lingdu/lingdu',
    })
  },
  // 点击领取优惠券
  handBtnCoupon() {
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
        url: '/api/ym.share/firstCoupon',
        header: {
          token: token
        },
        data: {
          token: token
        }
      }).then(res => {
        if (res.data.code == 200) {
         Function.layer(res.data.msg)
          this.setData({
            coupon: 2
          })
        }else if(res.data.code == 401){
          wx.showModal({
            title: '提示',
            content: '获取列表失败，请授权重试！',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              } else {
                wx.switchTab({
                  url: '/pages/shouye/index/index'
                })
              }
            }
          })
        } else{
          Function.layer(res.data.msg)
        }
      })
    }
  },
  onShow: function () {
    this.delrocrd();
    if (wx.getStorageSync('meny')) { //获取区域 和订单
      this._getCountCity() //获取城市
      this._getgoodslist() //获取列表
    }
  },
  findShop(e) { //选取右侧城市
    let pname = parseInt(e.currentTarget.dataset.index);
    this.setData({
      cityIndex: pname     //城市索引
    })
  },
  searchShop(e) { //选取左侧区域
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      active_endIndex: index,  //区域索引
      is_search: false, //弹窗关闭
      page: 1,
      showlist: [],
      city: that.data.allCity[that.data.cityIndex].name + "-" + that.data.allCity[that.data.cityIndex]['sublevel'][that.data.active_endIndex].name,
      cityss: that.data.allCity[that.data.cityIndex].name
    })
    this._getgoodslist(1) //请求区域店铺
  },
  findAdd() { //点击前面搜索
    this.setData({
      is_search: true
    })
  },
  findMap() { //点击地图找店
    let that = this;
    if (this.data.islog_ed) {
      that.setData({
        islog: true //显示定位中
      })
      setTimeout(() => {
        that.setData({
          islog: false
        })
      }, 2500)
    } else {
      wx.navigateTo({
        url: '/pages/shouye/ditu/ditu?jingdu=' + that.data.jingdu + "&weidu=" + that.data.weidu
      })
    }
  },
  detail(e) { //点击去理疗
    let that = this;
    let id = e.currentTarget.dataset.id;
    if (!wx.getStorageSync('members')) {
      wx.showModal({
        title: '提示',
        content: '你还未授权是否前往授权',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else if (res.cancel) { }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/shouye/detail/detail?id=' + id //跳转详情页面
      })
    }
  },
  hideshade() { //点击全屏关闭城市弹窗
    this.setData({
      is_search: false
    })
  },
  _getCountCity() { //获取门店区域
    let that = this;
    let data = {
      longitude: wx.getStorageSync('meny').jingdu,
      latitude: wx.getStorageSync('meny').weidu,
    };
    request({
      url: '/api/ym/home/getDistrict',
      data: data
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          allCity: res.data.data.items,  //市区列表
          pid: res.data.data.items[0].id
        })
      } else {
        Function.layer('获取门店区域失败，请稍后重试！')
      }
    })
  },
  _getgoodslist(type) { //请求店家列表
    var token = wx.getStorageSync('token') || '';
    let that = this;
    let data = {
      longitude: wx.getStorageSync('meny').jingdu,  //经度
      latitude: wx.getStorageSync('meny').weidu,    //纬度
      page: that.data.page,
      token: token
    }
    if (type == 1) { //传区域id
      data.category_id = that.data.allCity[that.data.cityIndex].sublevel[that.data.active_endIndex].id;
    } else {
      data.category_id = '';
    }
    request({
      url: '/api/ym/home',
      data: data,
      header: {
        token: token
      }
    }).then(res => {
    console.log(res,'店铺')
      if (res.data.code == 200) {
        if (res.data.data.lately_serve != null) { //判断返回为不为数组
          this.setData({
            lately_serve: true,
            lately: res.data.data.lately_serve //上次服务理疗师
          })
        }
        this.setData({
          showlist: res.data.data.shop_list, //店铺列表
          imgUrls: res.data.data.banner, //轮播图
          coupon: res.data.data.show_coupon
        })
      }else{
        Function.layer('获取信息失败，请稍后重试！')
      }
    })
  },
  bindinput: function (e) { //搜素输入框事件
    // console.log(e.detail.value)
    if (e.detail.value == '') {
      Function.layer('输入不能为空,请重新输入!')
      return false;
    }
    this.setData({
      titles: e.detail.value,
      page: 1,
      // pagesize : 10,
      showlist: []
    })
    if (wx.getStorageSync('token')) {
      request({
        url: '/api/ym/home/getSearchShop',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          page: 1,
          keyword: String(e.detail.value)
        }
      }).then(res => {
        // console.log(res,'搜索框')
        if (res.data.code == 200) {
          if (res.data.data == null) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            this.setData({
              showlist: res.data.data
            })
          }
        } else {
          wx.showToast({
            title: '搜索失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先进行授权！',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/auth/auth',
            })

          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  },
  penmap(e) { //点击进入地图
    let latitude = Number(e.currentTarget.dataset.latitude);
    let longitude = Number(e.currentTarget.dataset.longitude);
    let adde = e.currentTarget.dataset.adde;
    wx.openLocation({        //调用小程序map方法
      latitude: latitude,
      longitude: longitude,
      name: adde,
      scale: 18,
      success: function () { }
    })
  },
  delrocrd() { //进来调用获取经纬度
    var that = this;
    wx.getLocation({ //调用方法获取经纬度
      type: 'gcj02',
      success: function (resdata) {
        // console.log(resdata, 'huou')
        let obj = {
          weidu: resdata.latitude,
          jingdu: resdata.longitude
        }
        wx.setStorage({ //经纬度保存到本地
          key: 'meny',
          data: obj,
        })
        that.setData({
          weidu: resdata.latitude,
          jingdu: resdata.longitude
        })
        that._getCountCity(); //授权后加载列表
        that._getgoodslist();
      },
      fail() {
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '',
                showCancel: false,
                content: '您未授权地理位置，部分功能将无法使用！',
                confirmText: '授权',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          that.setData({
                            islog_ed: true
                          })
                          wx.getLocation({
                            type: 'gcj02',
                            success(resdata) {
                              let obj = { //本地储存错误
                                weidu: resdata.latitude,
                                jingdu: resdata.longitude
                              }
                              wx.setStorage({
                                key: 'meny',
                                data: obj,
                              })
                              that.setData({
                                weidu: resdata.latitude,
                                jingdu: resdata.longitude
                              })
                              that._getCountCity()
                              that._getgoodslist()
                              if (fn) {
                                fn()
                              }
                            }
                          })
                        }
                      },
                    })
                  } else {
                    wx.showModal({
                      title: '',
                      showCancel: false,
                      content: '请在系统设置中打开定位服务',
                      confirmText: '确定',
                      success: function (res) {
                        fn()
                      }
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                success: function (res) {
                  that.setData({
                    islog_ed: true
                  })
                }
              })
            }
          },
        })
      }
    })
  },
  onPullDownRefresh: function () { //下拉刷新事件
   
    setTimeout(()=> {
        let that = this;
        that.setData({
          titles: '',
          page: 1,
          showlist: [],
          cityss: that.data.allCity[0].name,
          ityIndex: 0,
          active_endIndex: 0  //区域索引
        })
        this.delrocrd();
      wx.stopPullDownRefresh()
    }, 1500)
  },
  onReachBottom: function () { //上拉触底事件
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
  },
   // 点击置顶的函数处理
   handleToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400 
    })
  },
    // 监听页面的滚动事件
    onPageScroll(e) {
    const { scrollTop } = e;
    // 当前的状态
    let isShow = this.data.isShowTop;
    // 判断如果滚动高度大于100，显示回到顶部的按钮
    if (scrollTop > 100) {
      isShow = true
    } else {
      isShow = false
    }
    // 避免频繁的操作setData，所以如果下面两个值是相同就没必要再赋值了
    if (isShow == this.data.isShowTop) return;
    this.setData({
      isShowTop: isShow
    })
  }
})