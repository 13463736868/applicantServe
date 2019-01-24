<template>
  <div class="_header pr not_s" :style="style.bg">
    <div class="header_top clearfix">
      <ul class="nav fl" v-if="isRegister">
        <router-link v-for="item in menu" :to="item.url" :key="item.id" tag="li" class="hand fl">{{item.text}}</router-link>
      </ul>
      <div class="user fr w300">
        <Row type="flex" justify="center" align="middle" class="hmax tc">
          <Col span="18 tr">
            <span class="fcf f13" v-if="isRegister"><span class="hand" @click="resOnes" v-if="userName !== null" v-text="userName + '，您好！'"></span></span>
          </Col>
          <Col span="6">
            <Icon class="hand" type="md-close" size="26" color="#ffffff" @click="loginOut"></Icon>
          </Col>
        </Row>
      </div>
    </div>
    <div class="header_bot">
      <Row type="flex" justify="center" align="middle">
        <Col span="24" class="tc">
          <router-link to="/home" tag="img" :src="img.logoUrl" alt="logo" class="_logo hand pa"></router-link>
          <slot></slot>
        </Col>
      </Row>
    </div>
    <alert-tip :alertShow="alertShowOut" @alertCancel="userOutCanc" @alertConfirm="userOutSave" alertTitle="提示" alertText="确定退出吗？"></alert-tip>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import {removeToken} from '@/cookies'
import alertTip from '@/components/common/alertTip'

export default {
  name: 'header_top',
  props: ['isRegister', 'headType'],
  components: { alertTip },
  data () {
    return {
      alertShowOut: false,
      userName: null,
      style: {
        bg: {
          backgroundImage: 'url(' + require('../../static/images/header_bg.png') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }
      },
      img: {
        logoUrl: require('../../static/images/logo.png')
      }
    }
  },
  created () {
    this.setUserName()
  },
  computed: {
    ...mapGetters([
      'menu'
    ])
  },
  methods: {
    ...mapActions([
      'setMenuArrObj',
      'setMenu',
      'setRouter'
    ]),
    loginOut () {
      this.alertShowOut = true
    },
    userOutSave () {
      try {
        axios.post('/SignOut').then(res => {
          removeToken()
          if (window.localStorage) {
            let loc = window.localStorage
            loc.removeItem('usersInfo')
            loc.removeItem('menuArrObj')
          }
          this.setMenuArrObj(null)
          this.setMenu(null)
          this.setRouter(null)
          this.$router.replace({
            path: '/login'
          })
          setTimeout(() => {
            location.reload()
          }, 0)
          this.$router.replace({
            path: '/login'
          })
        }).catch(e => {
          removeToken()
          if (window.localStorage) {
            let loc = window.localStorage
            loc.removeItem('usersInfo')
            loc.removeItem('menuArrObj')
          }
          this.setMenuArrObj(null)
          this.setMenu(null)
          this.setRouter(null)
          this.$router.replace({
            path: '/login'
          })
          setTimeout(() => {
            location.reload()
          }, 0)
          this.$router.replace({
            path: '/login'
          })
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } catch (error) {
        removeToken()
        if (window.localStorage) {
          let loc = window.localStorage
          loc.removeItem('usersInfo')
          loc.removeItem('menuArrObj')
        }
        this.setMenuArrObj(null)
        this.setMenu(null)
        this.setRouter(null)
        this.$router.replace({
          path: '/login'
        })
        setTimeout(() => {
          location.reload()
        }, 0)
        this.$router.replace({
          path: '/login'
        })
        this.$Message.error({
          content: '错误信息:' + error + ' 稍后再试',
          duration: 5
        })
      }
    },
    userOutCanc () {
      this.alertShowOut = false
    },
    setUserName () {
      if (window.localStorage) {
        let loc = window.localStorage
        let _usersInfo = loc.getItem('usersInfo')
        this.userName = _usersInfo === null ? null : JSON.parse(_usersInfo).loginname
      }
    },
    resOnes () {
      this.$router.replace({
        path: '/onesInfo'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._header {
  @include wh(100%, 13rem);
  @include mw(1180px);
  .header_top {
    @include wh(90%, 6rem);
    @include mw(1180px);
    @include bc;
    .nav {
      height: 100%;
      font-size: 14px;
      li {
        padding: 0 15px;
        height: 100%;
        line-height: 6rem;
        text-align: center;
        color: #fff;
      }
      li.router-link-exact-active {
        color: #fff;
      }
    }
    .user {
      height: 100%;
    }
  }
  .header_bot {
    ._logo {
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      height: 80px;
      top: -140px;
    }
    z-index: -1;
    @include wh(100%, 7rem);
    @include mw(1180px);
    @include bc;
    border-top:1px solid #fff;
    padding-top:40px;
  }
}
</style>
