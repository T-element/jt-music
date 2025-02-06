import { getSongDetail, getSongLyric } from "../../services/index";
import { throttle, debounce } from "underscore"
import parseLyric from "../../utils/parseLyric"

const modeMap = {
  order: "order",
  repeat: "repeat",
  random: "random"
}

const app = getApp()
const appData = app.globalData

Page({
  data: {
    playerHeight: 0,
    pageTitles: ['歌曲', '歌词'],
    currentPageIndex: 0,

    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: 0,
    lyricScrollTop: 0,

    songList: [],
    currentIndex: 0,
    isMusicPlaying: false,
    playMode: 'order',
    currentModeIndex: 0,

    audioContext: null,
    currentTime: 0,
    durationTime: 0,
    sliderValue: 0,
    isSliderValueChange: false,
    isUserDraging: false
  },

  onDragStart() {
    this.setData({
      isUserDraging: true
    })
  },

  onDragEnd() {
    this.setData({
      isUserDraging: false
    })
  },

  onPageTitleClick(e) {
    this.setData({
      currentPageIndex: e.currentTarget.dataset.index
    })
  },

  onPageIndexChange(e) {
    this.setData({
      currentPageIndex: e.detail.current
    })
  },

  onSliderChange(e) {
    this.setData({
      currentTime: Math.floor(e.detail.value * this.data.durationTime / 100),
      sliderValue: e.detail.value
    })
    this.data.audioContext.seek(this.data.currentTime / 1000)
    this.data.isSliderValueChange = true
    this.handleCurrentTimeSeek()
  },

  onModeBtnClick() {
    this.handlePlayModeChange()
  },

  onPlayBtnClick() {
    app.globalData.eventBus.emit('playingStatusChange')
    if(this.data.audioContext.paused) {
      this.data.audioContext.play()
      this.setData({
        isMusicPlaying: true
      })
    } else {
      this.data.audioContext.pause()
      this.setData({
        isMusicPlaying: false
      })
    }
  },

  onPrevBtnClick() {
    this.handleCurrentIndexChange()
    if(this.data.playMode === modeMap.order) {
      this.data.currentIndex--
      if(this.data.currentIndex <= 0) this.data.currentIndex = this.data.songList.length - 1
    }
    this.hangleMusicSrcChange()
  },

  onNextBtnClick() {
    this.handleCurrentIndexChange()
    if(this.data.playMode === modeMap.order) {
      this.data.currentIndex++
      if(this.data.currentIndex >= this.data.songList.length) this.data.currentIndex = 0  
    }
    this.hangleMusicSrcChange()
  },

  handleCurrentIndexChange() {
    const currentMode = this.data.playMode
    if(currentMode === modeMap.repeat) return
    if(currentMode === modeMap.random) {
      this.setData({
        currentIndex: Math.floor(Math.random() * this.data.songList.length)
      })
    }
  },

  handlePlayModeChange() {
    const values = Object.values(modeMap)
    if(++this.data.currentModeIndex >= values.length) this.data.currentModeIndex = 0
    this.setData({
      playMode: values[this.data.currentModeIndex]
    })
  },

  handleMusicPlayerSetting() {
    const audioContext = this.data.audioContext
    audioContext.onTimeUpdate(this.timeUpdateCB)
    audioContext.onCanplay(() => {
      audioContext.play()
    })
    audioContext.onPlay(() => {
      this.setData({
        isMusicPlaying: !audioContext.paused
      })
    })
    audioContext.onSeeked(() => {
      audioContext.paused
    })
    audioContext.onEnded(() => {
      this.onNextBtnClick()
    })
    audioContext.onError(err => {
      console.log(err);
    })
  },

  hangleMusicSrcChange() {
    const audioContext = this.data.audioContext
    audioContext.stop()
    const songID = this.data.songList[this.data.currentIndex].id
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${songID}.mp3`
    this.fetchSongDetailData()
    this.fetchSongLyricData()
    appData.eventBus.emit('resetAnim')
    this.setData({
      currentTime: 0,
      sliderValue: 0,
      currentLyricIndex: 0
    })
    // setTimeout(() => {
    //   audioContext.play()
    // }, 500);
  },

  handleCurrentTimeSeek: debounce(function() {
    this.data.isSliderValueChange = false
  }, 500),

  timeUpdateCB: throttle(function() {
    if(this.data.isSliderValueChange) return
    const audioContext = this.data.audioContext
    const currentTime = Math.floor(audioContext.currentTime * 1000)
    let currentLyricIndex = 0
    for(let i = 0; i < this.data.lyricInfos.length; i++) {
      if(currentTime + 500 < this.data.lyricInfos[i].time) {
        currentLyricIndex = i - 1
        break
      } else {
        currentLyricIndex = i
      }
    }
    this.setData({
      currentTime: currentTime,
      sliderValue: Math.floor(currentTime / this.data.durationTime * 100),
      currentLyricIndex: currentLyricIndex,
      currentLyricText: this.data.lyricInfos[currentLyricIndex]?.text || "",
    })
    if(!this.data.isUserDraging) {
      this.setData({
        lyricScrollTop: (currentLyricIndex) * 35
      })
    }

  }, 800, {leading: false ,trailing: false}),

  onLoad() {
    const app = getApp()
    const playerHeight = app.globalData.screenHeight - app.globalData.statusBarHeight - app.globalData.navBarHeight
    this.setData({
      playerHeight
    })
    this.data.audioContext = app.globalData.audioContext

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendSongList', (value) => {
      this.data.songList = value.songList,
      this.data.currentIndex = value.currentIndex
      
      this.handleMusicPlayerSetting()
      this.hangleMusicSrcChange()
    })

  },

  async fetchSongDetailData() {
    const songID = this.data.songList[this.data.currentIndex].id
    const app = getApp()
    const res = await getSongDetail(songID)
    app.globalData.eventBus.emit("currentSong", res.songs[0])
    this.setData({
      songData: res.songs[0],
      durationTime: res.songs[0].dt
    })
  },

  async fetchSongLyricData() {
    const songID = this.data.songList[this.data.currentIndex].id
    const res = await getSongLyric(songID)
    this.setData({
      lyricInfos: parseLyric(res.lrc.lyric)
    })
  }
})