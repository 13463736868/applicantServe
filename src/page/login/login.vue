<template>
  <div class="_login clearfix" :style="style.bg">
    <img :src="style.icon.src" :style="style.loginLogo">
    <div class="_center not_s">
      <div class="_header tc">
        <span class="fcf f26">登陆</span>
        <transition name="fade">
          <div class="_em" v-text="user.em" v-show="user.emStatus"></div>
        </transition>
      </div>
      <div class="_bodyer tc">
        <div class="_username bc">
          <Row>
            <Col span="6">
              <label class="lh32 f16 fc9">用户名:</label>
            </Col>
            <Col span="18" class="tl">
              <input type="text" class="_input" v-model.trim="user.username">
            </Col>
          </Row>
        </div>
        <div class="_password bc">
          <Row>
            <Col span="6">
              <label class="lh32 f16 fc9">密 码:</label>
            </Col>
            <Col span="18" class="tl">
              <input class="_input" v-model="user.password" placeholder="" :type="user.showPass === true?'text':'password'" @keyup.enter="resLogin"></input>
              <Icon size="18" class="hand" :type="user.showPass === true?'eye':'eye-disabled'" @click="showPass"></Icon>
            </Col>
          </Row>
        </div>
        <div class="_footer bc w350 tc">
          <button class="_loginBtn" v-bind:disabled="user.loginBtn" :class="{'_active':user.loginBtn}" @click="resLogin">确 认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import {setToken, removeToken} from '@/cookies'
import {getRouter, getMenu} from '@/router/routers.js'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'login',
  data () {
    return {
      style: {
        bg: {
          backgroundImage: "url('../../static/images/login_bg.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        },
        icon: {
          src: '../../static/images/login_icon.png'
        },
        loginLogo: {
          width: '210px',
          position: 'absolute',
          top: '20px',
          right: '20px'
        }
      },
      user: {
        username: '',
        password: '',
        showPass: false,
        loginBtn: false,
        em: '',
        emStatus: false
      },
      roleArr: [1, 10, 7, 8, 9]
    }
  },
  created () {
    this.clearTokenLoc()
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'setUsersInfo',
      'setMenu',
      'setRouter'
    ]),
    clearTokenLoc () {
      removeToken()
      if (window.localStorage) {
        let loc = window.localStorage
        loc.removeItem('usersInfo')
      }
    },
    showPass () {
      this.user.showPass = !this.user.showPass
    },
    resLogin () {
      if (this.user.username === '') {
        this.user.emStatus = true
        this.user.em = '请输入用户名'
      } else if (this.user.password === '') {
        this.user.emStatus = true
        this.user.em = '请输入密码'
      } else if (!setRegExp(this.user.password, 'password')) {
        this.user.emStatus = true
        this.user.em = '密码错误'
      } else {
        this.user.emStatus = false
        this.user.em = ''
        axios.post('/login', {
          username: this.user.username,
          password: this.user.password
        }).then(res => {
          let _res = res.data.data
          try {
            if (_res.roleId === null) {
              this.$Message.error({
                content: '登录身份未知,禁止登录',
                duration: 5
              })
            } else if (this.roleArr.indexOf(_res.roleId) === -1) {
              this.$Message.error({
                content: '登录身份未知,禁止登录',
                duration: 5
              })
            } else {
              if (window.localStorage) {
                let loc = window.localStorage
                loc.setItem('usersInfo', JSON.stringify(_res))
              }
              let _gMenu = getMenu(_res.roleId)
              let _gRouter = getRouter(_res.roleId)
              setToken(_res.client_token)
              this.setUsersInfo(_res)
              this.setMenu(_gMenu)
              this.setRouter(_gRouter)
              this.$router.addRoutes(_gRouter)
              this.$router.push({
                path: _gMenu[0].url
              })
            }
          } catch (e) {
            this.$Message.error({
              content: '错误信息:' + e,
              duration: 5
            })
          }
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e,
            duration: 5
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._login {
  width: 100%;
  height: 100%;
  background: url('/static/images/login_bg.png') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  ._center {
    @include center;
    width: 460px;
    height: 360px;
    ._header {
      @include backgroundLine(bottom, #1a2b58, #126eaf);
      height: 70px;
      line-height: 70px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      position: relative;
      ._em{
        position: absolute;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #ff7a7a;
        bottom: -30px;
        background: #fff799;
      }
      .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
      }
      .fade-enter, .fade-leave-to {
        opacity: 0;
      }
    }
    ._bodyer {
      @include boxShadow(0 1px 6px -1px #bbb);
      background: #ffffff;
      height: 290px;
      ._username, ._password {
        width: 350px;
        padding: 45px 0 5px;
        border-bottom: 1px solid #ddd;
        letter-spacing: 1px;
        margin-bottom: 5px;
        ._input {
          width: 80%;
          letter-spacing: 1px;
          font-size: 16px;
          color: #666;
          height: 32px;
          line-height: 32px;
          border: none;
        }
        ._input:focus {
          box-shadow: none;
          outline: 0px;
        }
      }
      ._footer {
        padding-top: 30px;
        ._loginBtn {
          @include btn(#126eaf, 90px, 16px, 40px);
          @include borderRadius(5px);
        }
        ._loginBtn._active {
          @include btn(#ccc, 90px, 16px, 40px);
        }
      }
    }
  }
}
</style>
