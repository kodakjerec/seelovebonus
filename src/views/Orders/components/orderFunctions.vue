<template>
  <el-form ref="form" :model="form" label-width="10vw" label-position="right" class="orderFunctionsCSS">
    <template v-for="item in subList">
      <el-form-item v-if="item.Function==='chanyunOrderID'" :key="item.Function" :label="$t('__chanyunOrderID')">
        <el-input v-model="item.Value" :placeholder="$t('__pleaseInput')" :disabled="buttonsShowUser.new === 0" @input="inputChange('chanyunOrderID', item)"></el-input>
      </el-form-item>
      <el-form-item v-if="item.Function==='newAnzaOrder'" :key="item.Function" :label="$t('__anzaOldOrderID')">
        <el-input v-model="item.Value" maxlength="20" show-word-limit disabled></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: 'orderFunctions',
  props: {
    dialogType: { type: String, default: 'new' },
    fromOrderID: { type: String },
    buttonsShowUser: { type: Object },
    projectFunctions: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: '',
        Function: '',
        Value: '',
        // 顯示用
        Status: '',
        Extend: {}
      },
      subList: [],
      fromType: ''
    }
  },
  watch: {
    projectFunctions: {
      handler: function () {
        this.bringOrderFunctions()
      },
      deep: true
    }
  },
  methods: {
    // 修改狀態:取得額外資料
    bringOrderFunctions: async function () {
      // 有啟用的功能, 就要顯示
      this.subList = []
      let newObj = JSON.parse(JSON.stringify(this.form))
      if (this.projectFunctions.chanyunOrderID.Available) {
        newObj.Function = 'chanyunOrderID'
        newObj.Status = 'New'
        newObj.Extend = this.projectFunctions.chanyunOrderID.Extend
        this.subList.push(newObj)
      }
      if (this.projectFunctions.newAnzaOrder.Available) {
        switch (this.fromType) {
          case 'anzaRenew':
          case 'anzaExtend':
            newObj.Function = 'newAnzaOrder'
            newObj.Status = 'New'
            newObj.Extend = this.projectFunctions.newAnzaOrder.Extend
            this.subList.push(newObj)
            break
          case 'anzaTransfer':
          case 'anzaInherit':
            break
        }
      }

      // 如果有舊資料, 填值
      let responseCustomer = await this.$api.orders.getObject({ type: 'orderFunctons', keyword: this.fromOrderID })
      let fromData = responseCustomer.data.result

      fromData.forEach(row => {
        this.subList.forEach(row2 => {
          if (row2.Function === row.Function) {
            row2.OrderID = row.OrderID
            row2.Value = row.Value
            row2.Status = ''
          }
        })
      })
    },
    // 有修改資料
    inputChange: function (type, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 父視窗: 變更任意資料
    parentAssginData: function (type, fromObject) {
      switch (type) {
        case 'newAnzaOrder':
          this.subList.forEach(row => {
            if (row.Function === type) {
              row.Value = fromObject
              this.inputChange(row.Function, row)
            }
          })
          break
        case 'fromType':
          this.fromType = fromObject
          break
      }
    },
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = true
      this.subList.forEach(row => {
        if (row.Value === '') {
          this.$message({
            message: this.$t('__pleaseInput'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }
      })
      return isSuccess
    },
    // 存檔前檢查
    beforeSave: async function () {
      let isSuccess = false
      if (this.fromOrderID === '') {
        isSuccess = false
        return isSuccess
      }
      // 預防沒用到orderFunction又會新增
      if (this.subList.length === 0) {
        isSuccess = true
        return isSuccess
      }
      // 開始更新
      for (let i = 0; i < this.subList.length; i++) {
        let row = this.subList[i]

        // 檢查
        if (row.Value === '') { continue }

        // 代入
        row.OrderID = this.fromOrderID

        switch (row.Status) {
          case 'New':
            isSuccess = await this.save('new', row)
            break
          case 'Modified':
            isSuccess = await this.save('edit', row)
            break
          case '':
            isSuccess = true
            break
        }
      }

      return isSuccess
    },
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      let responseNew = await this.$api.orders.orderFunctionsUpdate({ form: row })
      if (responseNew.headers['code'] === '200') {
        isSuccess = true
      }
      return isSuccess
    }
  }
}
</script>

<style lang="scss" scoped>
.orderFunctionsCSS {
  background-color: bisque;
}
</style>
