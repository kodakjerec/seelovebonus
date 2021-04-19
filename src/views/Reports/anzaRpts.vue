<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__totalReport')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('__export')+$t('__salesReport')" name="second"></el-tab-pane>
    </el-tabs>
    <total v-if="activeName==='first'"></total>
    <wintonExport v-if="activeName==='second'"></wintonExport>
  </div>
</template>

<script>
import total from './components/anza/glReportAnzaTotal'
import wintonExport from './components/anza/glReportWintonExport'

export default {
  name: 'AnzaRpts',
  components: {
    total,
    wintonExport
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
