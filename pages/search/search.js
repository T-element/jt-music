import { getHotSearch, getSearch, getSearchSuggest } from "../../services/index"

const appData = getApp().globalData

Page({
  data: {
    hotSearchData: [],
    searchSuggest: [],
    songsData: [],
    searchKeyword: "",
    isSearchListShow: false,
    isHasMore: true,
    scrollTop: 0,
    isScollToTopShow: false
  },

  onLoad() {
    this.fetchHotSearchData()

    let value = ""
    Object.defineProperty(this.data, "searchKeyword", {
      get() {
        return value
      },

      set: (newValue) => {
        this.data.isHasMore = true
        this.data.songsData = []
        value = newValue
      }
    })
  },

  onScroll(e) {
    let status = undefined
    if(e.detail.scrollTop > 1152) {
      status = true
    }else {
      status = false
    }

    if(status !== this.data.isScollToTopShow) {
      this.setData({
        isScollToTopShow: status
      })
    }

  },

  canSendRequest: true,
  onScrollViewReachBottom() {
    if(!this.canSendRequest) return
    this.canSendRequest = false
    this.fetchSearchData()
    setTimeout(() => {
      this.canSendRequest = true
    }, 100);
  },

  onBackTopClick() {
    this.setData({
      scrollTop: 0
    })
  },

  onSearchCancelClick() {
    this.setData({
      isSearchListShow: false,
      searchKeyword: ''
    })
  },

  onHotSearchItemClick(e) {
    this.setData({
      searchKeyword: e.target.dataset.tag
    })
    this.fetchSearchData(e.target.dataset.tag)
  },

  onSearchItemClick(e) {
    appData.navigateToMusicPlayer(this.data.songsData, e.currentTarget.dataset.index)
  },

  onSearchSuggestItemClick(e) {
    this.setData({
      searchKeyword: e.target.dataset.songname
    })
    this.fetchSearchData()
  },

  onSearchBoxSearch(e) {
    this.setData({
      searchKeyword: e.detail
    })
    this.fetchSearchData()
  },

  onSearchBoxFocus() {
    this.setData({
      isSearchBoxFocus: true
    })
  },

  onSearchBoxBlur() {
    this.setData({
      isSearchBoxFocus: false
    })
  },

  onSearchBoxChange(e) {
    this.setData({
      searchKeyword: e.detail,
      isSearchListShow: false
    })
    this.fetchSearchSuggestData(e.detail)
    if(!e.detail) {
      this.setData({
        searchSuggest: []
      })
    }
  },

  async fetchHotSearchData() {
    const res = await getHotSearch()
    this.setData({
      hotSearchData: res.result.hots
    })
  },

  async fetchSearchSuggestData(keyword) {
    if(!keyword) return
    const res = await getSearchSuggest(keyword)
    if(!res.result || !res.result.songs) return
    this.setData({
      searchSuggest: res.result.songs
    })
  },

  async fetchSearchData() {
    console.log(this.data.searchKeyword);
    if(!this.data.isHasMore) return
    const res = await getSearch(this.data.searchKeyword, this.data.songsData.length)
    console.log(res);
    if(!res.result.songs) return
    const songsData = this.data.songsData.concat(res.result.songs)
    this.setData({
      songsData: songsData,
      isHasMore: res.result.hasMore,
      isSearchListShow: true
    })
  }
})