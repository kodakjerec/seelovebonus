<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__totalReport')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('__export')+$t('__salesReport')" name="second"></el-tab-pane>
      <el-tab-pane :label="$t('__import')+$t('__invoice')" name="third"></el-tab-pane>
    </el-tabs>
    <total v-if="activeName==='first'"></total>
    <exportWinton v-if="activeName==='second'"></exportWinton>
    <importWinton v-if="activeName==='third'"></importWinton>
  </div>
</template>

<script>
import total from './components/anza/glReportAnzaTotal'
import exportWinton from './components/anza/glReportOrderExportWinton'
import importWinton from './components/anza/glReportImportWinton'

export default {
  name: 'AnzaRpts',
  components: {
    total,
    exportWinton,
    importWinton
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
