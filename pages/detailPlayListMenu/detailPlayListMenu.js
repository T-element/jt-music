import { getPlayListCategory, getPlayList } from "../../services/index"

const appData = getApp().globalData

Page({
  data: {
    playListMenus: []
  },
  
  onLoad(options) {
    this.fetchPlayListCategory()
  },

  async fetchPlayListCategory() {
    const res = await getPlayListCategory()
    const promiseArr = []
    res.tags.forEach(item => {
      promiseArr.push(getPlayList(item.name)) 
    })
    Promise.all(promiseArr).then(res => {
      this.setData({
        playListMenus: res
      })
    })
  }
})