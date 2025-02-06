// components/navBar/navBar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  
  properties: {
    title: {
      type: String,
      value: "JTMusic"
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 0
  },

  lifetimes: {
    attached() {
      const app = getApp()
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight
      })
    }
  },

  methods: {
    onBackBtnClick() {
      wx.navigateBack()
    }
  }

})