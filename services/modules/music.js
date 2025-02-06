import jtRequest from '../request/index'

export function getBanner() {
  return jtRequest.get({
    url: "/banner"
  })
}

export function getRecSongs(id = 3778678) {
  return jtRequest.get({
    url: "/playlist/detail",
    data: {
      id
    }
  })
}

export function getPlayList(cat, limit = 6, offset = 0) {
  return jtRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset
    }
  })
}

export function getRankingList(id) {
  return getRecSongs(id)
}

export function getPlayListCategory() {
  return jtRequest.get({
    url: "/playlist/hot"
  })
}