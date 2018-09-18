'use strict'
import Mock from 'mockjs'
import Json from '@/mock/data.js'

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
    userType: 1
  }
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const details = () => {
  let data = Json.details
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const prepareList = () => {
  let data = Json.prepareList
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const caseNew = () => {
  let data = Json.caseNew
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const caseDel = () => {
  let data = 1
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const partyAdd = () => {
  let data = Json.partyAdd
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const proxyAdd = () => {
  let data = Json.proxyAdd
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const partyUpdate = () => {
  let data = Json.partyUpdate
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const proxyUpdate = () => {
  let data = Json.proxyUpdate
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const partyDelete = () => {
  let data = 1
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const proxyDelete = () => {
  let data = 1
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const requestAdd = () => {
  let data = Json.requestAdd
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const requestUpdate = () => {
  let data = Json.requestUpdate
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const reasonsUpdate = () => {
  let data = Json.reasonsUpdate
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const delFile = () => {
  let data = 1
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const evidenceDelete = () => {
  let data = 1
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const sendMessage = () => {
  let data = 'ok'
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

const identCode = () => {
  let data = 1
  return {
    flag: true,
    data: data,
    code: '000000',
    message: null
  }
}

Mock.mock('/api/login', 'post', login)
Mock.mock('/api/sendMessage', 'post', sendMessage)
Mock.mock('/api/identCode', 'post', identCode)
Mock.mock('/api/case/details', 'post', details)
Mock.mock('/api/case/prepareList', 'post', prepareList)
Mock.mock('/api/case/new', 'post', caseNew)
Mock.mock('/api/case/delete', 'post', caseDel)
Mock.mock('/api/party/add/1', 'post', partyAdd)
Mock.mock('/api/party/add/2', 'post', partyAdd)
Mock.mock('/api/proxy/add', 'post', proxyAdd)
Mock.mock('/api/party/update', 'post', partyUpdate)
Mock.mock('/api/proxy/update', 'post', proxyUpdate)
Mock.mock('/api/party/delete/1', 'post', partyDelete)
Mock.mock('/api/party/delete/2', 'post', partyDelete)
Mock.mock('/api/proxy/delete', 'post', proxyDelete)
Mock.mock('/api/case/requestAdd/1', 'post', requestAdd)
Mock.mock('/api/case/requestUpdate/1', 'post', requestUpdate)
Mock.mock('/api/case/requestUpdate/2', 'post', reasonsUpdate)
Mock.mock('/api/case/requestDelete', 'post', requestAdd)
Mock.mock('/api/file/deleteFileUpload', 'post', delFile)
Mock.mock('/api/case/evidenceDelete', 'post', evidenceDelete)
