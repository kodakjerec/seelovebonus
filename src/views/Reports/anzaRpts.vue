<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__totalReport')" name="first"></el-tab-pane>
    </el-tabs>
    <total v-if="activeName==='first'"></total>
  </div>
</template>

<script>
import total from './components/anza/glReportAnzaTotal'

export default {
  name: 'AnzaRpts',
  components: {
    total
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
