import jtRequest from "../request/index"

export function getSongDetail(ids) {
  return jtRequest.get({
    url: "/song/detail",
    data: {
      ids
    }
  })
}

export function getSongLyric(id) {
  return jtRequest.get({
    url: "/lyric",
    data: {
      id
    }
  })
}