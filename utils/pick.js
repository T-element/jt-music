export default function pick(obj, keys) {
  if(obj === null || typeof obj !== "object") return
  const objProxy = new Proxy({}, {
    set(target, key, value) {
      return target[key] = value
    }
  })

  keys.forEach(key => {
    if(key in obj) objProxy[key] = obj[key]
  })

  return objProxy
}