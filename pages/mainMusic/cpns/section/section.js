// pages/mainMusic/cpns/section.js
Component({
  properties: {
    isShowMoreBtn: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ""
    },
    name: {
      type: String,
      value: ''
    }
  },

  methods: {
    onMoreBtnClick() {
      this.triggerEvent("moreBtnClick", this.properties.name)
    }
  }
})