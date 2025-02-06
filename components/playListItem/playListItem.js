// components/playListItem/playListItem.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onPlayListItemClick() {
      if(!this.properties.itemData.id) return
      wx.navigateTo({
        url: '/pages/detailPlayList/detailPlayList?id=' + this.properties.itemData.id,
      })
    }
  }
})