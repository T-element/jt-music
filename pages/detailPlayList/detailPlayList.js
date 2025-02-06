import { getRankingList } from "../../services/index";

const appData = getApp().globalData

Page({
  data: {
    playListData: {}
  },

  onSongItemClick(e) {
    appData.navigateToMusicPlayer(
      e.currentTarget.dataset.songlist,
      e.currentTarget.dataset.index
    )
  },

  onLoad(options) {
    this.fetchPlayListData(options.id)
  },

  async fetchPlayListData(id) {
    const res = await getRankingList(id)
    this.setData({
      playListData: res.playlist
    })
  }

})