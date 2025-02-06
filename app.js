// app.js
App({
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 44,
    windowHeight: 0,

    audioContext: {},

    eventBus: {},

    navigateToMusicPlayer: null
  },

  onLaunch() {
    const sysInfo = wx.getWindowInfo()
    this.globalData.statusBarHeight = sysInfo.statusBarHeight
    this.globalData.screenHeight = sysInfo.screenHeight

    this.globalData.audioContext = wx.createInnerAudioContext()
    // this.globalData.audioContext = wx.getBackgroundAudioManager()
    // this.globalData.audioContext.autoplay = false
    // this.globalData.audioContext.title = '此时此刻'
    // this.globalData.audioContext.epname = '此时此刻'
    // this.globalData.audioContext.singer = '许巍'
    // this.globalData.audioContext.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg'

    this.globalData.eventBus.on = function(eventName, CBFn) {
      if(!this[eventName]) this[eventName] = []
      this[eventName].push(CBFn)
    }

    this.globalData.eventBus.emit = function(eventName, props) {
      if(!this[eventName]) return
      this[eventName].forEach(fn => {
        fn(props)
      })
    }

    this.globalData.navigateToMusicPlayer = function(songList, currentIndex) {
      wx.navigateTo({
        url: "/pages/musicPlayer/musicPlayer",
        success: (res) => {
          res.eventChannel.emit('sendSongList', {
            songList,
            currentIndex
          })
        }
      })
    }

  }
})
