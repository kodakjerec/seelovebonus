<template>
  <div>
    <form ref="form" id='frmRender' method="post" :action="urlPath" target="myIframe">
      <input type="hidden" name="rs:Embed" value="true"/>
      <input type="hidden" name="rc:Parameters" value="false" />
      <input type="hidden" name="rs:Format" value="HTML4.0"/>
      <template v-for="(item, keyIndex) in paramList">
        <input type="hidden" :key="keyIndex" :name="item.key" :value="item.value" />
      </template>
      <iframe name="myIframe" :style="{ width:'70vw', height:'70vh'}">
      </iframe>
    </form>
  </div>
</template>

<script>
import { seeloveNodeServer } from '@/services/utils'

export default {
  name: 'iframeReportingService',
  props: {
    reportPath: { type: String },
    params: { type: Object }
  },
  data () {
    return {
      rsPath: '',
      urlPath: '',
      paramList: []
    }
  },
  watch: {
    params: function (newValue) {
      this.refresh()
    }
  },
  methods: {
    refresh: function () {
      // reset
      this.paramList = []

      // 設定網址
      this.rsPath = 'http://' + seeloveNodeServer.ip + ':' + seeloveNodeServer.portReportingServices + '/ReportServer/Pages/ReportViewer.aspx?/Reports/' + this.reportPath

      // 將傳入參數 => array
      Object.keys(this.params).forEach(key => {
        if (this.params[key]) {
          this.paramList.push({
            key: key,
            value: this.params[key]
          })
        }
      })

      // 組合網址
      this.urlPath = this.rsPath
      console.log(this.urlPath)

      // 送出submit
      this.$nextTick(() => {
        this.$refs['form'].submit()
      })
    }
  }
}
</script>
