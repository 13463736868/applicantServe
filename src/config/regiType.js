'use strict'
// YanCheng:/api  anyang:/trial   ;src/axios;src/router;index.html
const api = '/api'
const type = 'QingYang'
const infoMap = {
  'QingYang': {
    name: '中国庆阳仲裁委员会',
    excName: 'QingYang Arbitration Commission',
    tel: '0934-8232372',
    address: '甘肃省庆阳市西峰区南大街51号',
    goRoom: '',
    note: '前后不分离,去掉进入庭室,记录功能,不需要二级权限,结案变成上传,只能依赖master打包'
  },
  'AnYang': {
    name: '中国安阳仲裁委员会',
    excName: 'AnYang Arbitration Commission',
    tel: '0372-5369110',
    address: '河南省安阳市文峰区文峰大道559号',
    goRoom: 'https://wlzc.anyang.gov.cn/view/index.html#/',
    note: '前后分离,打包需要注意:代理信息,服务器路径前缀judge,接口地址前缀trial,以及路由信息base,图片信息'
  },
  'YanCheng': {
    name: '中国盐城仲裁委员会',
    excName: 'YanCheng Arbitration Commission',
    tel: '0515-88123589',
    address: '江苏省盐城市人民南路106号',
    goRoom: 'https://trialonline.yczcw.com.cn:3004/view/index.html#/',
    note: '前后不分离 注释掉ruleMana其中五项 发送邮件文书变成数组'
  },
  'HuiZhou': {
    name: '惠州信用便民仲裁服务中心',
    excName: 'HuiZhou Credit Arbitration Center',
    tel: '0752-2112666',
    address: '广东省惠州市惠城区鹅岭南路车世界广场三楼A区',
    goRoom: 'https://yun.youzhengkeji.com:3004/view/index.html#/',
    note: '前后不分离'
  },
  'YouZheng': {
    name: '中国某某仲裁委员会',
    excName: 'XxxXxx Arbitration Commission',
    tel: '0xxx-xxxxxxxx',
    address: '某某市xxx路xxx号',
    goRoom: 'https://yun.youzhengkeji.com:3004/view/index.html#/',
    note: '演示'
  },
  'Laiwu': {
    name: '中国莱芜仲裁委员会',
    excName: 'LaiWu Arbitration Commission',
    tel: '0634-5878177',
    address: '山东省莱芜市龙潭大街001号',
    goRoom: 'https://yun.youzhengkeji.com:3004/view/index.html#/',
    note: '莱芜演示'
  },
  'HaErBin': {
    name: '中国哈尔滨仲裁委员会',
    excName: 'HARBIN ARBITRATION COMMISSION',
    tel: '0451-82815701',
    address: '黑龙江省哈尔滨市道里区抚顺街1号',
    goRoom: '',
    note: '哈尔滨部署演示'
  }
}
const dataMap = infoMap[type]

export default {
  type,
  api,
  dataMap
}
