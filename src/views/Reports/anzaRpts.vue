<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__totalReport')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('__export')+$t('__salesReport')" name="second"></el-tab-pane>
    </el-tabs>
    <total v-if="activeName==='first'"></total>
    <exportWinton v-if="activeName==='second'"></exportWinton>
  </div>
</template>

<script>
import total from './components/anza/glReportAnzaTotal'
import exportWinton from './components/anza/glReportOrderExportWinton'

export default {
  name: 'AnzaRpts',
  components: {
    total,
    exportWinton
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
