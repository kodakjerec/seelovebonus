<template>
  <el-table
  row-key="Seq"
  :data="subList"
  stripe
  border
  class="orderFunctionsCSS"
  style="width: 100%">
    <el-table-column
      prop="Seq"
      :label="$t('__seq')"
      width="60px">
    </el-table-column>
    <el-table-column
      prop="ProductID"
      :label="$t('__product')+$t('__id')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new"
          filterable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{ddlSubListChange(value, scope.row)}"
          style="display:block">
          <el-option-group v-for="group in ddlSubList" :key="group.Category1Name" :label="group.Category1Name">
            <el-option v-for="item in group.options" :key="item.ProductID" :value="item.ProductID">
              <!-- 商品明細特別加上價格 -->
              <span style="float: left">{{ item.ProductName + ' ['+ formatterMoneyUS(null,null,item.Cost,null) + ']' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ProductID }}</span>
            </el-option>
          </el-option-group>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="Name"
      :label="$t('__product')+$t('__name')">
    </el-table-column>
    <el-table-column
      prop="Cost"
      :label="$t('__cost')"
      :formatter="formatterMoney"
      width="100px">
    </el-table-column>
    <el-table-column
      prop="Qty"
      :label="$t('__qty')"
      width="200px">
      <template slot-scope="scope">
        <el-input-number
          :min="1"
          v-if="buttonsShowUser.new"
          v-model="scope.row[scope.column.property]"
          @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="UnitName"
      :label="$t('__unit')"
      width="60px">
    </el-table-column>
    <el-table-column
      prop="Amount"
      :label="$t('__amount')"
      :formatter="formatterMoneyUS"
      width="200px">
    </el-table-column>
    <el-table-column
      prop="StorageID"
      :label="$t('__storageAddress')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new"
          filterable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{qtyChange(value, scope.row)}"
          style="display:block">
          <el-option v-for="item in ddlStorageID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      align="right"
      width="100px">
      <template slot="header">
        <el-button
          v-show="buttonsShowUser.new"
          type="primary"
          size="large"
          @click="handleNew()">{{$t('__new')}}</el-button>
      </template>
      <template slot-scope="scope">
        <el-button
          v-show="buttonsShowUser.new"
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">{{$t('__delete')}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { formatMoney } from '@/setup/format.js'

export default {
  name: 'transportOrderDetail',
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    orderID: { type: String }
  },
  data () {
    return {
      subItem: {
        OrderID: this.orderID,
        Seq: 0,
        ProductID: '',
        Name: '',
        Qty: 0,
        Cost: 0,
        StorageID: '',
        // 以下為前端顯示用, 不會記錄進資料庫
        Status: 'New',
        Amount: 0
      },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      originDDLSubList: [],
      ddlSubList: [],
      ddlStorageID: []
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) {
        this.subItem.OrderID = newValue

        this.subList.forEach(row => {
          row.OrderID = newValue
        })
      }
    }
  },
  async mounted () {
    await this.preLoading()

    this.bringOrderDetail()
  },
  methods: {
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    formatterMoneyUS: function (row, column, cellValue, index) {
      return formatMoney(cellValue, 'US')
    },
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.orders.getDropdownList({ type: 'productsForOrderDetail' })
      this.originDDLSubList = response.data.result
      this.originDDLSubList = this.originDDLSubList.filter(item => item.Inventory === 1)

      let response2 = await this.$api.basic.getDropdownList({ type: 'storageAddress' })
      this.ddlStorageID = response2.data.result

      // 做select group 處理
      // 找出主key
      this.originDDLSubList.forEach(item => {
        let findObject = this.ddlSubList.find(item2 => { return item2.Category1Name === item.Category1Name })
        if (findObject === undefined) {
          this.ddlSubList.push(item)
        }
      })
      // group 分組選項
      this.ddlSubList.forEach(item => {
        item.options = this.originDDLSubList.filter(item2 => item2.Category1Name === item.Category1Name)
      })
    },
    // 修改狀態, 取得明細
    bringOrderDetail: async function () {
      let responseDetail = await this.$api.stock.getObject({ type: 'transportOrderDetail', ID: this.orderID })
      this.subList = responseDetail.data.result

      this.reCalAmount()
    },
    checkValidate: async function () {
      let isSuccess = true

      if (this.subList.length === 0) {
        this.$message({
          message: this.$t('__pleaseInput') + ' ' + this.$t('__detail'),
          type: 'error'
        })
        isSuccess = false
      }

      // 檢查主表單
      this.subList.slice(0).forEach(row => {
        if (row.ProductID === '' || row.Qty === 0) {
          this.$message({
            message: this.$t('__pleaseInput') + ' ' + this.$t('__detail'),
            type: 'error'
          })
          isSuccess = false
        }
      })

      return isSuccess
    },
    // 存檔-Detail
    beforeSave: async function () {
      let isSuccess = false

      // 結合已刪除單據
      let finalResult = this.subList.concat(this.subListDeleted)

      for (let index = 0; index < finalResult.length; index++) {
        isSuccess = false
        let row = finalResult[index]
        // 錯誤處理
        if (row.OrderID === '' || row.Qty === 0) {
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
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
        case 'edit':
          let responseEdit = await this.$api.stock.transportOrderDetailUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.stock.transportOrderDetailDelete({ form: row })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // ============== 子結構 ===============
    // 新增子結構
    handleNew: function () {
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

      // 新增 item
      newObj.OrderID = this.orderID
      newObj.Seq = nextSeq
      newObj.ProductID = ''
      newObj.Status = 'New'
      this.subList.push(newObj)

      // 新增商品還沒有填入資料, 不用計算金額
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.subListDeleted.push(row)
      this.subList.splice(index, 1)

      this.reCalAmount()
    },
    // 下拉式選擇商品
    ddlSubListChange: function (selected, row) {
      let findSubList = this.originDDLSubList.find(item => item.ProductID === selected)
      this.fillSubList(row, findSubList)
    },
    // 填入選擇商品: 一般商品
    fillSubList: async function (row, itemDetail) {
      row.ProductID = itemDetail.ProductID
      row.Name = itemDetail.ProductName
      row.Qty = itemDetail.Qty
      row.Cost = itemDetail.Cost

      if (row.Status === '') {
        row.Status = 'Modified'
      }
      this.qtyChange(row.Qty, row.Qty, row)
      this.reCalAmount()
    },
    // 變更明細商品數量
    qtyChange: function (newValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }

      this.reCalAmount()
    },
    // 重新計算專案總價
    reCalAmount: function () {
      let masterAmount = 0; let tempAmount = 0
      this.subList.forEach(row => {
        tempAmount = row.Cost * row.Qty
        row.Amount = tempAmount
        masterAmount += tempAmount
      })
      this.$emit('reCalculateDetail', {
        masterAmount: masterAmount
      })
    }
  }
}
</script>
