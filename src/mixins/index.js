import { getcurrentTime } from '../api/index'
export default {
  methods: {
    getCurrentTime (callback) {
      getcurrentTime({}).then(res => {
        this.constant.time = res.status === 200 ? res.dateTime : new Date().getTime()
        callback && callback()
      })
    }
  }
}