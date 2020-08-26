import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
    fankui2: false, //提交反馈的弹窗
    prell: [], //图片组
    fankui: '', //文本域
    lei: '',
    jiemei: false, //接私单
    count: [],
    is_anonymity: 2,  //是否匿名
  },

  sidan_handle() { //点击接私单
    this.setData({
      jiemei: true
    })
  },
  radioChange(e) { //拿到单选框的选中
    // console.log(e.detail.value)
    this.setData({
      lei: e.detail.value
    })
  },
  checkboxChange(e) {
    if (e.detail.value.length == 0) {
      this.setData({
        is_anonymity: 2
      })
    } else {
      this.setData({
        is_anonymity: 1
      })
    }
    console.log(this.data.is_anonymity)
  },

  bindonhod(e) {   //监听文本域的值
    this.setData({ fankui: e.detail.value })
  },

  hidemodal() { //关闭提示
    this.setData({ jiemei: false })
  },
  selctPhone(e) {  //点击上传图片
    let that = this;
    wx.chooseImage({
      count: 5,
      success: res => {
        let tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item,i) =>{
          wx.uploadFile({
            url: 'https://www.imebox.cn/api/common/upload',  
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {},
            success: res => {
              let data = JSON.parse(res.data)
              if (data.code == 200) {
                let prell = that.data.prell;
                if(prell.length >= 5){
                   Function.layer('最多上传五张照片！')
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

  preimg(e) {   //点击图片放大
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    wx.previewImage({
      urls: that.data.prell,
      current: that.data.prell[index]
    })
  },

  fankuiover() {  //点击提交反馈
    if (this.data.lei == '') {
      Function.layer("请选择反馈分类");
      return;
    }
    if (this.data.fankui == '') {
      Function.layer("请填写反馈内容");
      return;
    }
    let data = {
      type: this.data.lei,
      content: this.data.fankui,
      is_anonymity: this.data.is_anonymity,
      images: this.data.prell.join(',')
    }
    request({
      url: '/api/common/getFeedback',
      data: data,
      header: {
        token: wx.getStorageSync('token')
      }
    }).then(res => {
      // console.log(res)
      if (res.data.code == 200) {
        this.setData({
          fankui2: true
        })
      } else {
        Function.layer(res.data.msg)
      }
    })
  },

  hidemodal2: function () {  //点击反馈成功
    wx.switchTab({
      url: '/pages/my/mine/mine'
    })
  },
})
