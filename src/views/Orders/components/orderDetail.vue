<template>
  <el-table
  :data="subList"
  stripe
  border
  style="width: 100%">
    <el-table-column
      prop="Seq"
      :label="$t('__seq')"
      width="60px">
    </el-table-column>
    <el-table-column
      prop="ProductID"
      :label="$t('__product')+$t('__id')">
    </el-table-column>
    <el-table-column
      prop="Name"
      :label="$t('__product')+$t('__name')">
    </el-table-column>
    <el-table-column
      prop="Qty"
      :label="$t('__qty')"
      width="100px">
    </el-table-column>
    <el-table-column
      prop="UnitName"
      :label="$t('__unit')"
      width="60px">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: {
    orderID: { type: String },
    orderDetail: { type: Array }
  },
  data () {
    return {
      subList: []
    }
  },
  watch: {
    orderID: function (value) {
      if (value) {
        this.subList.forEach((item) => { item.OrderID = value })
      }
    },
    orderDetail: function () {
      this.subList = this.orderDetail
    }
  },
  methods: {
    // 存檔-Detail
    beforeSave: async function () {
      let isSuccess = false
      for (let index = 0; index < this.orderDetail.length; index++) {
        let uploadResult = 0
        let row = this.orderDetail[index]
        // 錯誤處理
        if (row.OrderID === '') {
          continue
        }
        // 送出查詢
        uploadResult = await this.save('new', row)
        // 檢查
        if (uploadResult === 0) {
          isSuccess = false
          return isSuccess
        } else {
          isSuccess = true
        }
      }

      return isSuccess
    },
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
          const responseNew = await this.$api.orders.orderDetailNew({ form: row })
          if (responseNew.status === 200) {
            isSuccess = true
          }
          break
        case 'edit':
          isSuccess = true
          break
      }

      if (isSuccess) {
        return 1
      } else {
        return 0
      }
    }
  }
}
</script>
