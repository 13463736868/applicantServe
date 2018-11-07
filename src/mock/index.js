'use strict'
import Mock from 'mockjs'
// import Json from '@/mock/data.js'

Mock.setup({
  timeout: 1000
})

const login = () => {
  let data = {
    id: '23244124',
    loginname: '荼蘼花了我无缘',
    name: '李二蛋',
    companyid: null,
    phone: null,
    password: null,
    state: null,
    token: 'sdf345dfg4567dfgh56',
    roleId: 1
  }
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

Mock.mock('/api/login', 'post', login)
