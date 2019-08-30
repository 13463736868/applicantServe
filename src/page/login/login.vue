<template>
  <div class="_login clearfix" :style="style.bg">
    <img :src="style.icon.src" :style="style.loginLogo">
    <div class="_center not_s">
      <div class="_header tc">
        <span class="fcf f26">登录</span>
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
              <input class="_input" v-model="user.password" :type="user.showPass === true?'text':'password'" @keyup.enter="resLogin"></input>
              <Icon size="18" class="hand ml30 vtt" :type="user.showPass === true?'md-eye':'md-eye-off'" @click="showPass"></Icon>
            </Col>
          </Row>
        </div>
        <div class="_code bc">
          <Row>
            <Col span="6">
              <label class="lh32 f16 fc9">验证码:</label>
            </Col>
            <Col span="18" class="tl">
              <input class="_input" v-model="user.code" @keyup.enter="resLogin"></input>
              <img class="_img" :src="codeImgSrc" alt="" @click="resGetCode">
            </Col>
          </Row>
        </div>
        <div class="_footer bc w350 tc">
          <button class="_loginBtn" v-bind:disabled="user.loginBtn" :class="{'_active':user.loginBtn}" @click="resLogin">确 认</button>
        </div>
      </div>
    </div>
    <div class="tc fcf _footerFont">
      <p>CopyRight © 版权所有: 中卫仲裁委员会 技术支持：北京知仲科技有限公司（010-64170741）</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import {setToken, removeToken} from '@/cookies'
import {getRouter, getMenu} from '@/router/routers.js'
import regi from '@/config/regiType.js'

export default {
  name: 'login',
  data () {
    return {
      style: {
        bg: {
          backgroundImage: 'url(' + require('../../static/images/login_bg.png') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        },
        icon: {
          src: require('../../static/images/login_icon.png')
        },
        loginLogo: {
          width: '210px',
          position: 'absolute',
          top: '20px',
          left: '20px',
          userSelect: 'none'
        }
      },
      user: {
        username: '',
        password: '',
        code: '',
        showPass: false,
        loginBtn: false,
        em: '',
        emStatus: false
      },
      loginInfo: null,
      codeSrc: ''
    }
  },
  created () {
    this.clearTokenLoc()
    this.resGetCode()
  },
  mounted () {
  },
  computed: {
    codeImgSrc () {
      return regi.api + '/verify/code' + this.codeSrc
    }
  },
  methods: {
    ...mapActions([
      'setButtonMap',
      'setMenuArrObj',
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
    resGetCode () {
      this.codeSrc = '?t=' + (new Date()).valueOf()
    },
    resLogin () {
      if (this.user.username === '') {
        this.user.emStatus = true
        this.user.em = '请输入用户名'
      } else if (this.user.password === '') {
        this.user.emStatus = true
        this.user.em = '请输入密码'
      } else if (this.user.code === '') {
        this.user.emStatus = true
        this.user.em = '请输入验证码'
      } else if (this.user.code.length !== 4) {
        this.user.emStatus = true
        this.user.em = '请正确输入四位验证码'
      } else {
        this.user.emStatus = false
        this.user.em = ''
        axios.post('/login', {
          username: this.user.username,
          password: this.user.password,
          verifyCode: this.user.code
        }).then(res => {
          let _res = res.data.data
          this.loginInfo = res.data.data
          try {
            if (_res.roleId === null) {
              this.user.password = ''
              this.user.code = ''
              this.resGetCode()
              this.$Message.error({
                content: '登录身份未知,禁止登录',
                duration: 5
              })
            } else {
              setToken(_res.client_token)
              this.resGetMeun()
            }
          } catch (e) {
            this.user.password = ''
            this.user.code = ''
            this.resGetCode()
            this.$Message.error({
              content: '错误信息:' + e,
              duration: 5
            })
          }
        }).catch(e => {
          this.user.password = ''
          this.user.code = ''
          this.resGetCode()
          this.$Message.error({
            content: '错误信息:' + e,
            duration: 5
          })
        })
      }
    },
    resGetMeun () {
      axios.get('/auth/function/menuAndButton').then(res => {
        // /auth/function/menuAndButton
        let _res = res.data.data
        let _oldRes = {}
        _oldRes.menu = []
        _oldRes.menuName = []
        for (let k in _res) {
          _oldRes.menu.push(_res[k].route)
          _oldRes.menuName.push(_res[k].menuName)
        }
        if (window.localStorage) {
          let loc = window.localStorage
          loc.setItem('buttonMap', JSON.stringify(_res))
        }
        this.setButtonMap(_res)
        // let _oldRes = res.data.data
        if (_oldRes.menu !== [] && _oldRes.menuName !== []) {
          if (window.localStorage) {
            let loc = window.localStorage
            loc.setItem('usersInfo', JSON.stringify(this.loginInfo))
            loc.setItem('menuArrObj', JSON.stringify(_oldRes))
          }
          this.setUsersInfo(this.loginInfo)
          this.setMenuArrObj(_oldRes)
          let _gMenu = getMenu(_oldRes)
          let _gRouter = getRouter(_oldRes)
          this.setMenu(_gMenu)
          this.setRouter(_gRouter)
          this.$router.addRoutes(_gRouter)
          this.$router.push({
            path: _gMenu[0].url
          })
        } else {
          this.$Message.error({
            content: '登录身份权限未知,禁止登录',
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
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._login {
  width: 100%;
  height: 100%;
  // background: url('/static/images/login_bg.png') no-repeat center center;
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
      height: 300px;
      padding-top: 20px;
      ._username, ._password, ._code {
        width: 330px;
        padding: 15px 0 5px;
        border-bottom: 1px solid #ddd;
        letter-spacing: 1px;
        margin-bottom: 10px;
        ._input {
          width: 70%;
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
        ._img {
          width: 70px;
          height: 32px;
          float: right;
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
  ._footerFont {
     position: absolute;
     bottom: 10%;
     right: 50%;
     transform: translate(50%, -50%);
  }
}
</style>
