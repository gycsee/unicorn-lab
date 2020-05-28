

const DEFAULT_CONFIG = {
  v: '1.3.2',
  hostAndPath: 'webapi.amap.com/loca',
  key: 'a5383c0232f1a76ca1e4d34584ee6fec',
}

let mainPromise = null

export default class LocalLoader {
  constructor({ key, version, protocol }) {
    this.config = { ...DEFAULT_CONFIG, protocol }
    if (typeof window !== 'undefined') {
      if (key) {
        this.config.key = key
      } else if ('amapkey' in window) {
        this.config.key = window.amapkey
      }
    }
    if (version) {
      this.config.v = version
    }
    this.protocol = protocol || window.location.protocol
    if (this.protocol.indexOf(':') === -1) {
      this.protocol += ':'
    }
  }

  getScriptSrc(cfg) {
    return `${this.protocol}//${cfg.hostAndPath}?v=${cfg.v}&key=${cfg.key}`
  }

  buildScriptTag(src) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src = src
    return script
  }

  getMainPromise() {
    if (window.Loca) {
      return Promise.resolve()
    }
    const script = this.buildScriptTag(this.getScriptSrc(this.config))
    const p = new Promise(resolve => {
      script.onload = () => {
        resolve()
      }
    })
    document.body.appendChild(script)
    return p
  }

  load() {
    if (typeof window === 'undefined') {
      return null
    }
    mainPromise = mainPromise || this.getMainPromise()
    return new Promise(resolve => {
      mainPromise.then(() => {
        resolve()
      })
    })
  }
}