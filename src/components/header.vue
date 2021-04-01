<template>
  <el-header height="30px" class="floatingMenu" v-if="showMenu">
    <el-menu
      :default-active="activeIndex2"
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
      <el-menu-item class="defineCSS_Hide">
        <el-tag @click="showMenu=false" effect="dark" type="info">{{$t('__hide')}}</el-tag>
      </el-menu-item>
    </el-menu>
  </el-header>
  <div class="floatingButton" v-else>
    <el-tag @click="showMenu=true" effect="dark" type="info">{{$t('__show')}}</el-tag>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'Header',
  data () {
    return {
      activeIndex2: '1',
      showMenu: true
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
  padding: 0px;
  .el-menu {
    position:fixed; /* fixing the position takes it out of html flow - knows
                    nothing about where to locate itself except by browser
                    coordinates */
    width:100vw;      /* take up the full browser width */
    z-index:200;  /* high z index so other content scrolls underneath */
  }
}
.defineCSS {
  position: absolute;
  padding: 0px;
  right:60px;
  i {
    color: yellow
  }
}
.defineCSS_Hide {
  position: absolute;
  padding: 0px;
  right:0px;
}
.floatingButton {
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 2;
}
</style>
<style lang="scss">
/* 水平菜单顶层菜单样式 */
/* >符号表示直接孩子，.el-menu--horizontal>.el-submenu .el-submenu_title表示的
是类.el-menu--horizontal元素（这个是顶层菜单el-menu）下的第一层元素（sub-menu）下的标题，
这个标题是放在<i>元素的slot属性中的，从而找到了<i>元素，修改它的样式就可以了 */
.el-menu--horizontal {
    li.el-menu-item {
      height: 30px;
      line-height: 30px;
      border-bottom: 2px solid transparent;
    }

    > li.el-submenu {
      height: 30px;
      line-height: 30px;
      border-bottom: 2px solid transparent;

      div.el-submenu__title {
        height: 30px;
        line-height: 30px;
        border-bottom: 2px solid transparent;
      }
  }
}
</style>
