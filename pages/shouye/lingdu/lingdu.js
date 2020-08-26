// pages/shouye/lingdu/lingdu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show : false,
      show1 : false,
      show2 : false,
      show3 : false
  },
  handleClick(){
     if(this.data.show == false){
       this.setData({
         show : !this.data.show
       })
      }else{
        this.setData({
          show : false
        })
      } 
  },
  handleClick1(){
    if(this.data.show1 == false){
      this.setData({
        show1 : !this.data.show1
      })
     }else{
       this.setData({
         show1 : false
       })
     } 
 },
 handleClick2(){
  if(this.data.show2 == false){
    this.setData({
      show2 : !this.data.show2
    })
   }else{
     this.setData({
       show2 : false
     })
   } 
},
handleClick3(){
  if(this.data.show3 == false){
    this.setData({
      show3 : !this.data.show3
    })
   }else{
     this.setData({
       show3 : false
     })
   } 
},
  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
  }
})