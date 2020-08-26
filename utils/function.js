// 方法的封装

// 跳转链接
function linkTo(url,type=false) {
  if (type =="redirectTo"){
    wx.redirectTo({
      url: url,
    })
  }else{
    wx.navigateTo({
      url: url,
      fail: function (rs) {
        wx.switchTab({
          url: url
        })
      }
    })
  }
}

// 弹出提示框
function layer(msg){
  wx.showToast({
    title: msg,
    mask: true, //是否显示透明蒙层，防止触摸穿透
    icon: "none",
    duration: 2000
  })
}
// 弹出成功提示框
function success(msg) {
  wx.showToast({
    title: msg,
    mask: true, //是否显示透明蒙层，防止触摸穿透
    icon: "success",
    duration: 1500
  })
}

/*获得元素上的绑定的值*/
function getDataSet(event, key) {
  return event.currentTarget.dataset[key];
}

module.exports={
  linkTo: linkTo,
  layer: layer,
  getDataSet: getDataSet,
  success: success,
};
