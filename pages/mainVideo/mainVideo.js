import { getTopMV } from "../../services/index.js"

Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },

  onReachBottom() {
    if(!this.data.hasMore) return
    this.fetchTopMVData()
  },

  async onPullDownRefresh() {
    this.data.offset = 0
    this.data.videoList.length = 0
    this.data.hasMore = true
    await this.fetchTopMVData()
    wx.stopPullDownRefresh()
  },

  onItemClick(e) {
    wx.navigateTo({
      url: '/pages/detailVideo/detailVideo',
      success: (res) => {
        res.eventChannel.emit("sendID", e.currentTarget.dataset.item)
      }
    })
  },

  onLoad(option) {
    this.fetchTopMVData()
  },

  async fetchTopMVData() {
    const res = await getTopMV(this.data.offset)
    const newList = [...this.data.videoList, ...res.data]
    this.data.offset = newList.length
    this.data.hasMore = res.hasMore
    wx.stup
    this.setData({
      videoList: newList
    })
  }

})