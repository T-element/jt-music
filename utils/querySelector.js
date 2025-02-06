export default function querySelector(selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select('.banner .image').boundingClientRect()
    query.exec(res => {
      resolve(res)
    })
  })
}