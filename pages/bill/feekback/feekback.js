import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    titleArr: [],
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
    xiao: [{   //星星数组
      status: true
    }, {
      status: true
    },
    {
      status: true
    },
    {
      status: true
    }, {
      status: true
    }],
    id: '',  //店铺id
    desc: '', //感受
    star: 5,
    activeindex: 0
  },
  onLoad: function (options) {
    this.setData({ id: options.id, name: options.name, head_img: options.img })
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

  setPlain(e) {    //提交评论
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

  _getdiscuss() {

    if (this.data.star == 0) {
      Function.layer('请进行星级评论！');
      return false;
    }
    let that = this;
    that.setData({
      submin: false //决定是否点提交
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
      url: '/api/ym/Discuss/increase',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'post',
      data: data
    }).then(res => {
      // console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '评价成功！',
          icon: "none",
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1100)
      } else {
        Function.layer(res.data.msg);
        setTimeout(() => {
          wx.navigateBack()
        }, 1100)
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
                let prell = that.data.prell;
                if (prell.length >= 8) {
                  Function.layer('最多上传八张照片！')
                  return false;
                }
                prell.push('http://' + data.data.url)
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
  },
})
