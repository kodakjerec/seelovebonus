<template>
  <div>
    <el-upload
      ref="upload"
      drag
      :action="'123'"
      :limit="1"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
      :multiple="false"
      style="float:left">
      <i class="el-icon-upload"></i><br/>
      <el-button>{{$t('__upload')+$t('__invoice')+' file'}}</el-button>
    </el-upload>
  </div>
</template>

<script>
import { seeloveNodeServer } from '@/services/utils'
export default {
  name: 'glReportImportWinton',
  data () {
    return {
      filepath: 'http://' + seeloveNodeServer.ip + ':' + seeloveNodeServer.port + '/reports/wintonInvoiceUpload'
    }
  },
  methods: {
    // 篩選上傳類型
    beforeAvatarUpload: function (file) {
      let isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      if (!isXlsx) {
        this.$message.error('Only Xlsx!')
      }

      return isXlsx
    },
    // 上傳檔案
    handleUpload: async function (params) {
      // 組合上傳檔案
      let fd = new FormData()
      let file = this.$refs['upload'].uploadFiles[0]
      fd.append('file', file.raw)
      let response = await this.$api.basic.storageAddressUpload(fd)
      this.$alert('Success: ' + response.data.result.successCount +
      ' Fail: ' + response.data.result.failCount)

      // 清空上傳清單
      this.$refs['upload'].clearFiles()
    }
  }
}
</script>
