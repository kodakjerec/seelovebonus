<template>
  <el-form>
    <el-table
      v-show="orderDetail.showExpandFunctions === 1"
      :data="subList"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="Value1"
        :label="$t('__certificate2')">
        <template slot-scope="scope">
          <el-select
            v-if="buttonsShowUser.new"
            filterable
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')"
            @change="(value)=>{ddlCertificate2Change(value, scope.row)}"
            style="display:block">
            <el-option v-for="item in ddlCertificate2" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
          <div v-else>
            {{scope.row.Value1}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="Value2"
        :label="$t('__chanyun')+$t('__landCertificate')">
        <template slot-scope="scope">
          <el-input
            v-if="buttonsShowUser.new"
            v-model="scope.row[scope.column.property]" :placeholder="$t('__pleaseInput')">
          </el-input>
          <div v-else>
            {{scope.row.Value2}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
export default {
  name: 'orderDetailFunctions',
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
        // 前端顯示用, 不會紀錄進資料庫
        Status: ''
      },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      ddlCertificate2: []
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
    this.preLoading()
    this.bringDetail()
  },
  methods: {
    preLoading: async function () {
      if (this.buttonsShowUser.new === 1) {
        if (this.orderDetail.showChgChanyunCertificate === 1) {
        // 取得所有原始資料
          let response = await this.$api.orders.getDropdownList({ type: 'certificate2ChgLandCertificate' })
          this.ddlCertificate2 = response.data.result
        }
      }
    },
    // 帶入資料
    bringDetail: async function () {
      this.subList = []
      this.subListDeleted = []

      // 填入舊資料
      this.productFunctionsList.forEach(row => {
        // 找出這筆商品所屬的所有特殊功能
        if (row.DetailSeq === this.orderDetail.Seq) {
          if (row.Function === 'chglandCertificate') {
            // 如果數量做過調整, 超出上限的證明編號要轉換為刪除
            if ((this.subList.length + 1) <= this.orderDetail.Qty) {
              row.Status = ''
              this.subList.push(row)
            } else {
              row.Status = 'Deleted'
              this.subListDeleted.push(row)
            }
          }
        }
      })

      /*
        展雲換狀
      */
      // 新資料
      if (this.orderDetail.showChgChanyunCertificate === 1) {
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

          newObj.Function = 'chglandCertificate'
          newObj.Seq = nextSeq
          newObj.Status = 'New'

          this.subList.push(newObj)
          index++
        }
      }
    },
    // 檢察權狀是否重複
    ddlCertificate2Change: function (value, row) {
      let findDuplication = this.subList.find(item => { return item.Value1 === value && item.Seq !== row.Seq })

      // 沒有重複
      if (findDuplication !== undefined) {
        this.$message({
          message: value + ' ' + this.$t('__valueUsed'),
          type: 'error'
        })
        row.Value1 = ''
        if (row.Status === '') {
          row.Status = 'Modified'
        }
      }
    },
    checkValidate: function () {
      let isSuccess = false

      /*
        展雲換狀
      */
      if (this.orderDetail.showChgChanyunCertificate === 1) {
        isSuccess = true

        this.subList.forEach(row => {
          if (row.Value1 === '' || row.Value2 === '') {
            this.$message({
              message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__extend') + this.$t('__function'),
              type: 'error'
            })
            isSuccess = false
            return isSuccess
          }
        })
      }

      return isSuccess
    },
    beforeSave: async function () {
      let isSuccess = false

      // 結合已刪除單據
      let finalResult = this.subList.concat(this.subListDeleted)

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
          let responseNew = await this.$api.orders.orderDetailFunctionsUpdate({ form: row })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
          }
          break
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
