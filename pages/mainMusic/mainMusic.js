import { getBanner, getPlayList, getRankingList, getRecSongs } from "../../services/index"
import querySelector from "../../utils/querySelector"
import pick from "../../utils/pick"
import { get, throttle } from "underscore"

const querySelectorThrottle = throttle(querySelector, 1000)
const rankingMap = {
  originalRanking: 2884035,
  newRanking: 3779629,
  upRanking: 19723756
}
const app = getApp()
const audioContext = app.globalData.audioContext

Page({
  data: {
    bannerHeight: 0,
    isShowRankingList: false,

    banners: [],
    recSongs: [],
    hotPlayList: [],
    recPlayList: [],
    rankingList: {},

    currentSongData: null,
    isPlaying: false,
    addAnim: true
  },

  onPlayBtnClick() {
    audioContext.paused ? audioContext.play() : audioContext.pause()
    app.globalData.eventBus.emit('playingStatusChange')
  },

  onSearchClick() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  onBannerImageLoaded() {
    querySelectorThrottle(".banner .image").then(res => {
      this.setData({
        bannerHeight: res[0].height
      })
    })
  },

  onMoreBtnClick(e) {
    switch(e.detail) {
      case "recSongs" :
        this.handleSwitchPage('/pages/detailRankingList/detailRankingList', this.data[e.detail])
        break
      
      case "hotPlayListMenu":
        this.handleSwitchPage('/pages/detailPlayListMenu/detailPlayListMenu')
        break
      
      default : 
        break
    }
  },

  onRankListItemClick(e) {
    this.handleSwitchPage('/pages/detailRankingList/detailRankingList', e.currentTarget.dataset.listdata)
  },

  onSongsListItemClick(e) {
    app.globalData.navigateToMusicPlayer(e.currentTarget.dataset.playlist, e.currentTarget.dataset.index)
  },

  onLoad() {
    this.fetchBannerData()
    this.fetchRecSongsData()
    this.fetchPlayListData()
    this.fetchRankListData()

    app.globalData.eventBus.on('currentSong', (value) => {
      this.setData({
        currentSongData: value
      })
    })
    app.globalData.eventBus.on('playingStatusChange', () => {
      this.setData({
        isPlaying: !this.data.isPlaying
      })
      // setTimeout(() => {
      //   this.setData({
      //     isPlaying: !audioContext.paused
      //   })
      // }, 200);
    })
    app.globalData.eventBus.on('resetAnim', () => {
      this.setData({
        addAnim: false
      })
      setTimeout(() => {
        this.setData({
          addAnim: true
        })
      }, 1000);
    })
  },

  onShow() {
    this.setData({
      isPlaying: !audioContext.paused
    })
  },

  async fetchBannerData() {
    const res = await getBanner()
    this.setData({
      banners: res.banners
    })
  },

  async fetchRecSongsData() {
    const res = await getRecSongs()
    this.setData({
      recSongs: res.playlist
    })
  },

  fetchPlayListData() {
    getPlayList("全部").then(res => {
      this.setData({
        hotPlayList: res.playlists
      })
    })

    getPlayList("华语").then(res => {
      this.setData({
        recPlayList: res.playlists
      })
    })
  },

  fetchRankListData() {
    const promiseArr = []
    const keys = Object.keys(rankingMap)
    keys.forEach(key => promiseArr.push(getRankingList(rankingMap[key])))

    Promise.all(promiseArr).then(res => {
      res.forEach((item, index) => {
        this.data.rankingList[keys[index]] = this.handleRankListData(item)
      })

      this.setData({
        rankingList: this.data.rankingList,
        isShowRankingList: true
      })
    })
  },

  handleRankListData(data) {
    return pick(data.playlist, ['id', 'name', 'playCount', 'tracks', 'coverImgUrl'])

    // return {
    //   listID: data.playlist.id,
    //   listName: data.playlist.name,
    //   playCount: data.playlist.playCount,
    //   tracks: data.playlist.tracks.slice(0, 3),
    //   coverImgUrl: data.playlist.coverImgUrl
    // }
  },

  handleSwitchPage(pageURL, prop) {
    wx.navigateTo({
      url: pageURL,
      success: (res) => {
        res.eventChannel.emit("sendData", prop)
      }
    })
  }
})