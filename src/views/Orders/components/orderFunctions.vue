<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right" style="background-color: lightyellow">
    <el-form-item v-if="showChanyunOrderID" :label="'展雲-契約單號'" prop="Value">
      <el-input v-model="form.Value" :placeholder="$t('__pleaseInput')" :disabled="buttonsShowUser.new === 0"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'orderFunctions',
  props: {
    orderID: { type: String },
    buttonsShowUser: { type: Object },
    showChanyunOrderID: { type: Number }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        Function: 'chanyunOrderID',
        Value: ''
      },
      rules: {
        Value: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      }
    }
  },
  watch: {
    orderID: function (newValue) {
      this.form.OrderID = newValue

      this.bringOrderFunctions()
    }
  },
  mounted () {
    this.bringOrderFunctions()
  },
  methods: {
    // 修改狀態:取得額外資料
    bringOrderFunctions: async function () {
      console.log('order Function')
      let responseCustomer = await this.$api.orders.getObject({ type: 'orderFunctons', ID: this.orderID })
      let result = responseCustomer.data.result
      result.forEach(row => {
        if (row.Function === this.form.Function) {
          this.form.Value = row.Value
        }
      })
    },
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = null
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    },
    // 存檔前檢查
    beforeSave: async function () {
      let isSuccess = false
      if (this.form.OrderID === '') {
        return false
      }

      isSuccess = await this.save()

      return isSuccess
    },
    // 存檔
    save: async function () {
      let isSuccess = false
      let responseNew = await this.$api.orders.functionsUpdate({ form: this.form })
      if (responseNew.headers['code'] === '200') {
        isSuccess = true
      }
      return isSuccess
    }
  }
}
</script>
