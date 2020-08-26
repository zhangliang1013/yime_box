import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    titleArr: [],  //服务名称
    isSelect: false,
    icdels: [
      {
        title: '放松舒服'
      },
      {
        title: '服务热情'
      },
      {
        title: '环境舒适'
      },
      {
        title: '性价比高'
      },
      {
        title: '感觉一般'
      },
      {
        title: '不怎么样'
      },

    ],
    prell: [], //原图片数组
    submin: true, //控制点击评论一次
    xiao: [{          //星星数组
      status: false
    }, {
      status: false
    },
    {
      status: false
    },
    {
      status: false
    }, {
      status: false
    }],
    id: '',  //店铺id
    desc: '', //感受
    star: 0,
    activeindex: 0
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({ id: options.id, name: options.name, head_img: options.img })

    this.pinglun() //评论详情
  },
  // 评论详情渲染
  pinglun() {
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
        url: '/api/ym/Discuss/getComment',
        data: {
          token: token,
          order_id: this.data.id
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '评论详情')
        if (res.data.code == 200) {
          var arr = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
          if (res.data.data.star == 1) {
            arr[0].status = true;
            arr[1].status = false;
            arr[2].status = false;
            arr[3].status = false;
            arr[4].status = false;
          } else if (res.data.data.star == 2) {
            arr[0].status = true;
            arr[1].status = true;
            arr[2].status = false;
            arr[3].status = false;
            arr[4].status = false;
          } else if (res.data.data.star == 3) {
            arr[0].status = true;
            arr[1].status = true;
            arr[2].status = true;
            arr[3].status = false;
            arr[4].status = false;
          } else if (res.data.data.star == 4) {
            arr[0].status = true;
            arr[1].status = true;
            arr[2].status = true;
            arr[3].status = true;
            arr[4].status = false;
          } else if (res.data.data.star == 5) {
            arr[0].status = true;
            arr[1].status = true;
            arr[2].status = true;
            arr[3].status = true;
            arr[4].status = true;
          }
          this.setData({
            star: res.data.data.star,
            xiao: arr,
            desc: res.data.data.content,
            newArr : res.data.data.type
          })
          if(res.data.data.images == ''){
            this.setData({
              prell: [],
            })
          }else{
            this.setData({
              prell: res.data.data.images,
            })
          }
     
          if(res.data.data.type.indexOf('放松舒服') !== -1 ){
            this.data.icdels[0].isSelect = true ;
            this.setData({
              icdels : this.data.icdels
            })
          }
          if(res.data.data.type.indexOf('服务热情') !== -1 ){
            this.data.icdels[1].isSelect = true ;
            this.setData({
              icdels : this.data.icdels
            })
          }
          if(res.data.data.type.indexOf('环境舒适') !== -1 ){
            this.data.icdels[2].isSelect = true ;
            this.setData({
              icdels : this.data.icdels
            })
          }
          if(res.data.data.type.indexOf('性价比高') !== -1 ){
            this.data.icdels[3].isSelect = true ;
            this.setData({
              icdels : this.data.icdels
            })
          }
          if(res.data.data.type.indexOf('感觉一般') !== -1 ){
            this.data.icdels[4].isSelect = true ;
            this.setData({
              icdels : this.data.icdels
            })
          }
          if(res.data.data.type.indexOf('不怎么样') !== -1 ){
            this.data.icdels[5].isSelect = true ;
            this.setData({
              icdels : this.data.icdels
            })
          }
        } else {
          Function.layer(res.data.msg)
        }
      })
    }
  },

  xuan_xing(e) { //点击星星
    var index1 = e.currentTarget.dataset.index;
    var arr = [{ status: false }, { status: false }, { status: false }, { status: false }, {
      status: false
    }];
    if (index1 == 0) {
      arr[0].status = true;
      arr[1].status = false;
      arr[2].status = false;
      arr[3].status = false;
      arr[4].status = false;
    } else if (index1 == 1) {
      arr[0].status = true;
      arr[1].status = true;
      arr[2].status = false;
      arr[3].status = false;
      arr[4].status = false;
    } else if (index1 == 2) {
      arr[0].status = true;
      arr[1].status = true;
      arr[2].status = true;
      arr[3].status = false;
      arr[4].status = false;
    } else if (index1 == 3) {
      arr[0].status = true;
      arr[1].status = true;
      arr[2].status = true;
      arr[3].status = true;
      arr[4].status = false;
    } else if (index1 == 4) {
      arr[0].status = true;
      arr[1].status = true;
      arr[2].status = true;
      arr[3].status = true;
      arr[4].status = true;
    }
    this.setData({
      xiao: arr,
      star: e.currentTarget.dataset.index + 1
    })
  },
  setPlain(e) {    //提交修改评论
    this._getdiscuss()
  },
  // 多选
  selectApply: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.icdels[index];
    item.isSelect = !item.isSelect;
    this.setData({
      icdels: this.data.icdels,
      titleArr: []
    });

    let oldArr = this.data.icdels.filter(v => {
      return v.isSelect == true
    })

    var titleArr = this.data.titleArr;
    oldArr.forEach(v => {
      titleArr.push(v.title)
    })

    this.setData({
      newArr: titleArr.join(',')
    })
  },

  _getdiscuss() {  //修改评论
    if (this.data.star == 0) {
      Function.layer('请进行星级评论！');
      return false;
    }
    let that = this;
    that.setData({
      submin: false   //决定是否点提交
    })
    let data = {
      order_id: that.data.id,
      type: that.data.newArr,
      star: that.data.star,
      content: that.data.desc,
      images: that.data.prell.join(','),
      token: wx.getStorageSync('token')
    }
    request({
      url: '/api/ym/Discuss/amend', //提交修改评论(订单id)
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'post',
      data: data
    }).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '修改评价成功！',
          icon: "none",
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1100)
      } else if (res.data.msg == '超过修改时间') {
        Function.layer('超过修改时间，无法进行修改！')
        setTimeout(() => {
          wx.navigateBack()
        }, 1100)
      } else {
        Function.layer(res.data.msg)
      }
    })
  },

  getEvarv(e) {  //文本域内容
    this.setData({
      desc: e.detail.value
    })
  },
  selctPhone(e) {  //点击上传图片
    let that = this;
    wx.chooseImage({
      count: 5,
      success: res => {
        let tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item, i) => {
          wx.uploadFile({
            url: 'https://www.imebox.cn/api/common/upload',   //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {},
            success: res => {
              let data = JSON.parse(res.data)
              if (data.code == 200) {
                that.setData({
                  prell: []
                })

                let prell = that.data.prell;
                if (prell.length >= 8) {
                  Function.layer('最多上传八张照片！')
                  return false;
                }
                prell.push('http://' + data.data.url);
                that.setData({
                  prell: prell
                })
                Function.layer('上传成功！')
                console.log(that.data.prell)
              } else {
                Function.layer('上传失败，请重试或者联系工作人员！')
              }
            }
          })
        })
      }
    })
  },

  preimg(e) {  //点击图片放大
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    wx.previewImage({
      urls: that.data.prell,
      current: that.data.prell[index]
    })
  }
})
