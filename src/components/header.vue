<template>
      <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
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
      <el-menu-item index="/" class="defineCSS">
        <i class="el-icon-switch-button"></i>
        <span>{{$t('__logout')}}</span>
      </el-menu-item>
      <el-menu-item>
        {{userName}}, 你好
      </el-menu-item>
    </el-menu>
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
    ...mapState(['isLogin', 'userName', 'menuList'])
  },
  methods: {
    handleSelect (key, keyPath) {
      router.push(key)
    }
  }
}
</script>
<style lang="scss" scoped>
.defineCSS i {
  color: yellow
}
</style>
