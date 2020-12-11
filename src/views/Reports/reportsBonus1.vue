<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__totalReport')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('__detail')" name="second"></el-tab-pane>
    </el-tabs>
    <total v-if="activeName==='first'"></total>
    <detail v-if="activeName==='second'"></detail>
  </div>
</template>

<script>
import total from './components/reportsBonus1Total'
import detail from './components/reportsBonus1Detail'

export default {
  name: 'Users',
  components: {
    total,
    detail
  },
  data () {
    return {
      activeName: 'first',
      users: [],
      groups: []
    }
  }
}
</script>
