/*
專門用於新增訂單自動產生供奉憑證
*/
<template>
  <el-form>
    <h2 class="alignLeft">{{$t('__certificate1')}}</h2>
    <p/>
    <el-table
      :data="certificate1List"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__certificate1Prefix')">
      </el-table-column>
      <el-table-column
        prop="qty"
        :label="$t('__qty')">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row[scope.column.property]"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
export default {
  name: 'Certificate1ForOrderNew',
  props: {
    orderID: { type: String },
    parentQty: { type: Number }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        Certificate1: '',
        PrintCount: 0,
        Status: '1',
        CreateDate: new Date(),
        ReportDuration: '1',
        Prefix: ''
      },
      certificate1List: []
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) {
        this.form.OrderID = newValue
      }
    },
    parentQty: function () {
      this.parentQtyChange()
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      // 新增時憑證編號清單
      const responseCer1List = await this.$api.orders.getDropdownList({ type: 'certificate1Prefix' })
      responseCer1List.data.result.forEach(row => {
        this.certificate1List.push(row)
      })

      this.parentQtyChange()
    },
    // 父視窗:變更明細商品數量, 只變更專案商品
    parentQtyChange: function (newQty) {
      let index = 0
      let tempList = JSON.parse(JSON.stringify(this.certificate1List))
      this.certificate1List = []

      tempList.forEach(row => {
        if (index === 0) {
          row.qty = this.parentQty
        } else {
          row.qty = 0
        }

        // 強制觸發vue.js更新機制
        this.certificate1List.push(row)

        index++
      })
    },
    beforeSave: function () {
      // 錯誤處理
      if (this.form.OrderID === '') {
        return
      }

      this.certificate1List.forEach(row => {
        this.form.Prefix = row.ID
        for (let i = 0; i < row.qty; i++) {
          this.save(this.form)
        }
      })
    },
    // 存檔
    save: async function (item) {
      await this.$api.orders.orderCertificate1New({ form: item })
    }
  }
}
</script>
<style lang="scss" scoped>
.alignLeft {
  text-align: left;
}
</style>
