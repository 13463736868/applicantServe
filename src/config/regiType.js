'use strict'
const api = '/api'
const type = 'YanCheng'
const infoMap = {
  'AnYang': {
    name: '中国安阳仲裁委员会',
    excName: 'AnYang Arbitration Commission',
    tel: '0372-5369110',
    address: '河南省安阳市文峰区文峰大道559号',
    goRoom: 'https://wlzc.anyang.gov.cn/view/index.html#/'
  },
  'YanCheng': {
    name: '中国盐城仲裁委员会',
    excName: 'YanCheng Arbitration Commission',
    tel: '0515-88123589',
    address: '江苏省盐城市人民南路106号',
    goRoom: 'https://trialonline.yczcw.com.cn:3004/view/index.html#/'
  },
  'YouZheng': {
    name: '中国某某仲裁委员会',
    excName: 'XxxXxx Arbitration Commission',
    tel: '0xxx-xxxxxxxx',
    address: '某某市xxx路xxx号',
    goRoom: 'https://yun.youzhengkeji.com:3004/view/index.html#/'
  }
}
const dataMap = infoMap[type]

export default {
  api,
  dataMap
}
