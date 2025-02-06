const BASE_URL = "http://codercba.com:9002"
// const BASE_URL = "https://coderwhy-music.vercel.app/"
const TIME_OUT = 20000

class JTRequest {
  constructor(baseUrl = BASE_URL, timeout = TIME_OUT) {
    this.baseUrl = baseUrl,
    this.timeout = timeout
  }

  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseUrl + url,
        timeout: this.timeout,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err.errMsg)
        }
      })
    })
  }

  get(options) {
    return this.request({
      ...options,
      method: "GET"
    })
  }

  post(options) {
    return this.request({
      ...options,
      method: "POST"
    })
  }
}

export default new JTRequest()