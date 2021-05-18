<template>
  <div v-if="orderDetail.showExpandFunctions === 1">
    <!-- 換狀證明交換展雲權狀-->
    <part1
      ref="chglandCertificate"
      v-if="orderDetail.chglandCertificate === 1"
      :subList="subList"
      :buttonsShowUser="buttonsShowUser"></part1>
    <!-- 換狀證明過戶 -->
    <part2
      ref="transferCustomer"
      v-if="orderDetail.transferCustomer === 1"
      :subList="subList"
      :buttonsShowUser="buttonsShowUser"></part2>
  </div>
</template>

<script>
import part1 from './chglandCertificate'
import part2 from './transferCustomer'
export default {
  name: 'orderDetailFunctions',
  components: {
    part1,
    part2
  },
  props: {
    orderDetail: { type: Object },
    buttonsShowUser: { type: Object },
    productFunctionsList: { type: Array }
  },
  data () {
    return {
      subItem: {
        OrderID: this.orderDetail.OrderID,
        DetailSeq: this.orderDetail.Seq,
        Function: '',
        Seq: 0,
        Value1: '',
        Value2: '',
        Value3: '',
        Value4: '',
        // 前端顯示用, 不會紀錄進資料庫
        Status: ''
      },
      subList: [],
      subListDeleted: []
    }
  },
  watch: {
    // 監聽Object, 要改為 handler + deep
    orderDetail: {
      handler: function (newValue, oldValue) {
        let newOrderID = newValue.OrderID
        let newOrderSeq = newValue.Seq
        this.subList.forEach(row => {
          row.OrderID = newOrderID
          row.DetailSeq = newOrderSeq
        })
        this.subListDeleted.forEach(row => {
          row.OrderID = newOrderID
          row.DetailSeq = newOrderSeq
        })
      },
      deep: true
    }
  },
  mounted () {
    this.bringDetail()
  },
  methods: {
    // 帶入資料
    bringDetail: function () {
      this.subList = []
      this.subListDeleted = []

      // 填入舊資料
      this.productFunctionsList.forEach(row => {
        // 找出這筆商品所屬的所有特殊功能
        if (row.DetailSeq === this.orderDetail.Seq) {
          // 如果數量做過調整, 超出上限的證明編號要轉換為刪除
          if ((this.subList.length + 1) <= this.orderDetail.Qty) {
            row.Status = ''
            this.subList.push(row)
          } else {
            row.Status = 'Deleted'
            this.subListDeleted.push(row)
          }
        }
      })

      /*
        展雲換狀
      */
      // 新資料
      if (this.orderDetail.showExpandFunctions === 1) {
        let index = 0
        let loopMax = (this.orderDetail.Qty - this.subList.length)
        while (index < loopMax) {
          let newObj = JSON.parse(JSON.stringify(this.subItem))
          // find Maximum Seq
          let nextSeq = 1
          if (this.subList.length === 0) {
            nextSeq = 1
          } else {
            let amounts = this.subList.map(item => item.Seq)
            let highestSeq = Math.max(...amounts)
            nextSeq = highestSeq + 1
          }
          newObj.Seq = nextSeq
          newObj.Status = 'New'

          this.subList.push(newObj)
          index++
        }
      }

      // 帶入各組特殊資料
      if (this.$refs['chglandCertificate']) {
        this.subList.forEach(row => {
          row.Function = 'chglandCertificate'
        })
      }
      if (this.$refs['transferCustomer']) {
        this.subList.forEach(row => {
          row.Function = 'transferCustomer'
        })
      }
    },
    checkValidate: function () {
      let isSuccess = false

      /*
        展雲換狀
      */
      if (this.$refs['chglandCertificate']) {
        isSuccess = this.$refs['chglandCertificate'].checkValidate()
      }
      if (this.$refs['transferCustomer']) {
        isSuccess = this.$refs['transferCustomer'].checkValidate()
      }

      return isSuccess
    },
    beforeSave: async function () {
      let isSuccess = false

      // 結合已刪除單據, 先刪除再新增
      let finalResult = this.subListDeleted.concat(this.subList)

      for (let index = 0; index < finalResult.length; index++) {
        isSuccess = false
        let row = finalResult[index]
        // 錯誤處理
        if (row.Value1 === '' || row.Value2 === '') {
          continue
        }
        // 開始更新
        switch (row.Status) {
          case 'New':
            isSuccess = await this.save('new', row)
            break
          case 'Modified':
            isSuccess = await this.save('edit', row)
            break
          case 'Deleted':
            isSuccess = await this.save('delete', row)
            break
          case '':
            isSuccess = true
            break
        }
        // 檢查
        if (!isSuccess) { return isSuccess }
      }

      return isSuccess
    },
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
        case 'edit':
          let responseEdit = await this.$api.orders.orderDetailFunctionsUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.orders.orderDetailFunctionsDelete({ form: row })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // ============== 父視窗使用的函數 ===============
    // 變更明細商品數量
    qtyChange: function (currentValue) {
      this.bringDetail()
    }
  }
}
</script>
