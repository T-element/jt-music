import { object } from "underscore";

// components/songItem/songItem.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: () => ({})
    },
    index: {
      type: Number,
      value: 0
    }
  },

  methods: {
    onMoreBtnClick() {
      wx.showActionSheet({
        itemList: ["收藏", "喜欢", "添加到歌单"],
      }).then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
  }
})