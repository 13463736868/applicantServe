'use strict'
import Cookies from 'js-cookie'

const TokenKey = 'client_token'

export const getToken = () => Cookies.get(TokenKey)

export const setToken = (token) => Cookies.set(TokenKey, token)

export const removeToken = () => Cookies.remove(TokenKey)
