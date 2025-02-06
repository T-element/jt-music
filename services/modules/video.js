import jtRequest from "../request/index"

export function getTopMV(offset = 0, limit = 20) {
  return jtRequest.get({
    url: "/top/mv",
    data: {
      offset,
      limit
    }
  })
}

export function getMV(id) {
  return jtRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}