<template>
  <iframe width="1123px" height="796px" :src="urlPath"></iframe>
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
      urlPath: ''
    }
  },
  watch: {
    params: function (newValue) {
      this.refresh()
    }
  },
  methods: {
    refresh: function () {
      this.rsPath = 'http://' + seeloveNodeServer.ip + ':' + seeloveNodeServer.portReportingServices + '/ReportServer/Pages/ReportViewer.aspx?/Reports/' + this.reportPath
      let rsCommands = '&rs:Embed=true&rc:Parameters=false'
      let paramsString = ''

      Object.keys(this.params).forEach(key => {
        paramsString += '&' + key + '=' + this.params[key]
      })

      this.urlPath = this.rsPath + rsCommands + paramsString
      console.log(this.urlPath)
    }
  }
}
</script>
