import { getMV } from "../../services/index"

Page({
  data: {
    mvURL: "",
    artistName: ""
  },

  onLoad(option) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("sendID", res => {
      this.fetchMVData(res.id)
      this.setData({
        artistName: res.artistName
      })
    })
  },

  async fetchMVData(id) {
    const res = await getMV(id)
    console.log(res.data);
    this.setData({
      mvURL: res.data.url
    })
  }
})