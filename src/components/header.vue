<template>
  <el-header>
    <el-menu
      :default-active="activeIndex2"
      class="floatingMenu"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :route="true"
      v-if="isLogin"
      >
      <template v-for="(menuItem, keyIndex) in menuList">
        <el-submenu :key="keyIndex" :index="''+keyIndex">
          <template slot="title">{{menuItem.Name}}</template>
          <el-menu-item v-for="(subMenuItem, keyIndex2) in menuItem.subMenu" :key="keyIndex2" :index="subMenuItem.Path" :route="{path: subMenuItem.Path}">
            {{subMenuItem.Name}}
          </el-menu-item>
        </el-submenu>
      </template>
      <el-menu-item index="/home">
        {{userName}}, {{$t('__hello')}}
      </el-menu-item>
      <el-menu-item index="/" class="defineCSS">
        <i class="el-icon-switch-button"></i>
        <span>{{$t('__logout')}}</span>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'Header',
  data () {
    return {
      activeIndex2: '1'
    }
  },
  computed: {
    ...mapState(['isLogin', 'userName', 'menuList']) // 監控隨時更新的系統變數,用mapState
  },
  methods: {
    handleSelect: async function (key, keyPath) {
      switch (key) {
        case '/':
          await this.$api.login.logout({
            UserID: this.$store.state.UserID
          })
          break
        default:
      }
      router.replace(key)
    }
  }
}
</script>
<style lang="scss" scoped>
.floatingMenu {
  position:fixed; /* fixing the position takes it out of html flow - knows
                   nothing about where to locate itself except by browser
                   coordinates */
  left:0;           /* top left corner should start at leftmost spot */
  top:0;            /* top left corner should start at topmost spot */
  width:100vw;      /* take up the full browser width */
  z-index:200;  /* high z index so other content scrolls underneath */
}
.defineCSS {
  position: absolute;
  right:0px;
  i {
    color: yellow
  }
}
</style>
