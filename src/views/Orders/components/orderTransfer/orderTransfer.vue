<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-steps :active="0" align-center process-status="finish" finish-status="success">
      <el-step :title="$t('__choose')+' '+$t('__orderID')"></el-step>
    </el-steps>
    <!-- 選擇契約編號: 不顯示在最後的結果 -->
    <el-form label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
      <el-select
          v-model="form.ID"
          default-first-option filterable clearable
          :placeholder="$t('__plzChoice')"
          @change="ddlOrderIDChange">
          <el-option v-for="item in ddlOrderID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 底部操作按鈕 -->
    <div slot="footer">
      <br/>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="goToStep1">{{$t('__next')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderTransfer',
  props: {
    dialogType: { type: String, default: 'new' },
    parent: { type: String, default: 'Orders' }
  },
  data () {
    return {
      form: {
        ID: ''
      },
      order: {},
      myTitle: this.$t('__orderTransfer'),
      // 使用者能看到的權限: 過戶客製化
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 0,
        search: 1
      },
      // 以下為下拉式選單專用
      ddlOrderID: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response = await this.$api.orders.getDropdownList({ type: 'orderHead' })
      this.ddlOrderID = response.data.result
    },
    ddlOrderIDChange: async function () {
      // 取得可以用的契約編號
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', keyword: this.form.ID })
      this.order = responseRow.data.result[0]
      // 過戶客製化: 強制可修改內容
      this.order.Status = '1'
    },
    goToStep1: function () {
      if (this.form.ID) {
        this.$router.push({
          name: 'OrderTransferStep1',
          params: {
            dialogType: this.dialogType,
            order: this.order,
            parent: this.parent,
            buttonsShowUser: this.buttonsShowUser
          }
        })
      } else {
        this.$message.error(this.$t('__plzChoice') + this.$t('__orderID'))
      }
    },
    // 取消
    cancel: function () {
      this.$router.push({
        name: this.parent,
        params: {
          returnType: 'cancel'
        }
      })
    }
  }
}
</script>
