const appData = getApp().globalData

Page({
  data: {
    listData: {}
  },

  onItemClick(e) {
    appData.navigateToMusicPlayer(e.currentTarget.dataset.playlist, e.currentTarget.dataset.index)
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendData', res => {
      this.setData({
        listData: res
      })
      wx.setNavigationBarTitle({
        title: res.name,
      })
    })
  }
})