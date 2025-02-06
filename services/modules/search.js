import jtRequest from "../request/index"

export function getHotSearch() {
  return jtRequest.get({
    url: "/search/hot"
  })
}

export function getSearchSuggest(keywords) {
  return jtRequest.get({
    url: "/search/suggest",
    data: {
      keywords,
    }
  })
}

export function getSearch(keywords, offset = 0) {
  return jtRequest.get({
    url: "/search",
    data: {
      keywords,
      offset
    }
  })
}