Page({
  data: {
    userName: "未登录",
    avatarUrl: "/assets/images/profile/avatar_placeholder.png",

    isDialogShow: false
  },

  onLoginBoxClick() {
    if(this.data.userName !== '未登录') return
    wx.getUserProfile({
      desc: '登录'
    }).then(res => {
      this.setData({
        userName: res.userInfo.nickName,
        avatarUrl: res.userInfo.avatarUrl
      })
    })
  },

  onCreateListClick() {
    this.setData({
      isDialogShow: true
    })
  },
  

  onLoad(options) {

  }
})