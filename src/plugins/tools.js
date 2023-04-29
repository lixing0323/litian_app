import Vue from 'vue'

const tool = {}
const metadata = {
  getText(name, value) {
    if (value === null || value === 'null') return ''
    const data = metadata[name]
    if (!data) return ''
    let result = ''
    data.forEach((e) => {
      if (e.value + '' === value + '') result = e.label
    })
    if (!result) result = '未知'
    return result
  },
  getValue(name, label) {
    const data = metadata[name]
    if (!data) return ''
    let result = ''
    data.forEach((e) => {
      if (e.label + '' === label + '') result = e.value
    })
    return result
  },
  getList(name) {
    const data = metadata[name]
    let result = []
    if (!data) return []
    data.forEach((e) => {
      result.push(e.label)
    })
    return result
  }
}
tool['metadata'] = metadata
// 日期格式化
tool['formatDate'] = (date, format) => {
  if (!date) return
  const paddNum = function (num) {
    num += ''
    return num.replace(/^(\d)$/, '0$1')
  }
  // 指定格式字符
  const cfg = {
    yyyy: date.getFullYear(),
    yy: date.getFullYear().toString().substring(2),
    M: date.getMonth() + 1,
    MM: paddNum(date.getMonth() + 1),
    d: date.getDate(),
    dd: paddNum(date.getDate()),
    hh: paddNum(date.getHours()),
    mm: paddNum(date.getMinutes()),
    ss: paddNum(date.getSeconds())
  }
  format || (format = 'yyyy-MM-dd hh:mm:ss')
  return format.replace(/([a-z])(\1)*/ig, function (m) {
    return cfg[m]
  })
}

tool['shortTime'] = (time) => {
  let min, hour, day, d
  const now = parseInt(new Date().getTime() / 1000)
  const ctime = new Date(time.replace(/-/g, '/'))
  d = now - (ctime.getTime() / 1000)
  day = parseInt(d / 86400)
  hour = parseInt(d / 3600)
  min = parseInt(d / 60)
  if (day > 0 && day < 7) {
    return day + '天前'
  } else if (day <= 0 && hour > 0) {
    return hour + '小时前'
  } else if (hour <= 0 && min > 0) {
    return min + '分钟前'
  } else if (min <= 0) {
    return d + '秒前'
  } else {
    return time.split(' ')[0]
  }
}
// 获取天、周、月、年的开始结束时间
tool['getDateByType'] = (type, diff) => {
  let startDate = ''
  let endDate = ''
  const now = new Date(); // 当前日期
  if (type === '天') {
    now.setDate(now.getDate() + diff)
    startDate = tool['formatDate'](now, 'yyyy-MM-dd')
    endDate = tool['formatDate'](now, 'yyyy-MM-dd')
  } else if (type === '周') {
    now.setDate(now.getDate() + (diff * 7))
    let dayOfWeek = now.getDay() // 今天本周的第几天 0-6:周日-周六
    if (dayOfWeek === 0) dayOfWeek = 7
    now.setDate(now.getDate() - (dayOfWeek - 1)) // 设置时间为周一
    startDate = tool['formatDate'](now, 'yyyy-MM-dd')
    now.setDate(now.getDate() + 6) // 设置时间为周日
    endDate = tool['formatDate'](now, 'yyyy-MM-dd')
  } else if (type === '月') {
    now.setMonth(now.getMonth() + diff)
    now.setDate(1) // 设置时间为1号
    startDate = tool['formatDate'](now, 'yyyy-MM-dd')
    now.setMonth(now.getMonth() + 1) // 月份+1
    now.setDate(now.getDate() - 1) // 日期-1则为上个月最后一天
    endDate = tool['formatDate'](now, 'yyyy-MM-dd')
  } else if (type === '年') {
    now.setFullYear(now.getFullYear() + diff)
    now.setMonth(0) // 设置月份为1月
    now.setDate(1) // 设置时间为1号
    startDate = tool['formatDate'](now, 'yyyy-MM-dd')
    now.setFullYear(now.getFullYear() + 1)
    now.setDate(now.getDate() - 1) // 日期-1则为去年最后一天
    endDate = tool['formatDate'](now, 'yyyy-MM-dd')
  }
  return {
    startTime: startDate ? startDate + ' 00:00:00' : '',
    endTime: endDate ? endDate + ' 00:00:00' : '',
    startDate: startDate,
    endDate: endDate,
  }
}
// 对象克隆
const cloneObj = (obj) => {
  let o
  let j
  if (typeof obj !== 'object' || obj === null || obj instanceof Date) return obj
  if (obj instanceof (Array)) {
    o = []
    j = obj.length
    for (let i = 0; i < j; i++) o[i] = cloneObj(obj[i])
  } else {
    o = {}
    for (let i in obj) o[i] = cloneObj(obj[i])
  }
  return o
}
tool['clone'] = cloneObj
tool['priceFmt'] = (price) => {
  const negative = price < 0
  if (negative) price = -price
  let result = ''
  let value = price + ''
  if (value === 'null') value = '0'
  const len = value.length
  if (len > 2) {
    result = value.substr(0, len - 2) + '.' + value.substr(len - 2, len)
  } else {
    let decimal = value.substr(len - 2, len)
    if (decimal.length < 2) decimal = '0' + decimal
    result = '0.' + decimal
  }
  return negative ? -parseFloat(result) : parseFloat(result)
}
tool['sizeFmt'] = (size) => {
  if (!size) return '未知大小'
  // B < KB < MB < GB < TB
  if (size < 1024) return size.toFixed(2) + ' B'
  size = size / 1024
  if (size < 1024) return size.toFixed(2) + ' KB'
  size = size / 1024
  if (size < 1024) return size.toFixed(2) + ' MB'
  size = size / 1024
  if (size < 1024) return size.toFixed(2) + ' GB'
  size = size / 1024
  return size.toFixed(2) + 'TB'
}
tool['download'] = (url, name) => {
  const a = document.createElement('a')
  const e = document.createEvent('MouseEvents')
  e.initEvent('click', false, false)
  a.href = url
  a.target = '_blank'
  if (name) a.download = name
  a.dispatchEvent(e) // 给指定的元素，执行事件click事件
}
Vue.prototype.$tools = tool
export default tool
