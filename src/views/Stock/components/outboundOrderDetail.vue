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
      prop="Purpose"
      :label="$t('__storagePurpose')"
      width="100">
      <template slot-scope="scope">
        <el-input
          v-if="buttonsShow.new && buttonsShowUser.new"
          v-model="scope.row[scope.column.property]"
          @change="(value)=>{purposeChange(value, scope.row)}">
        </el-input>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="ProductID"
      :label="$t('__product')+$t('__id')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShow.new && buttonsShowUser.new"
          default-first-option filterable clearable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{ddlSubListChange(value, scope.row)}"
          style="display:block">
          <el-option-group v-for="group in ddlSubList" :key="group.Category1Name" :label="group.Category1Name">
            <el-option v-for="item in group.options" :key="item.ProductID" :label="item.ProductID+' '+item.ProductName" :value="item.ProductID">
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
      prop="StorageID"
      :label="$t('__shipping')+$t('__storageAddress')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShow.new && buttonsShowUser.new"
          default-first-option filterable clearable
          remote
          v-model="scope.row.StorageID"
          :disabled="scope.row.ProductID===''"
          :remote-method="(value)=>{remoteMethod(value, scope.row)}"
          @change="(value)=>{storageIDChange(value, scope.row)}"
          :placeholder="$t('__plzChoice')"
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
      prop="Qty"
      :label="$t('__qty')"
      width="200px">
      <template slot-scope="scope">
        <el-input-number
          :min="1"
          v-if="buttonsShow.new && buttonsShowUser.new"
          v-model="scope.row[scope.column.property]"
          @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="buttonsShow.new && buttonsShowUser.new"
      prop="AvailableQty"
      :label="$t('__max')+$t('__qty')"
      width="60">
    </el-table-column>
    <el-table-column
      v-if="buttonsShow.new && buttonsShowUser.new"
      align="right"
      width="100px">
      <template slot="header">
        <el-button
          type="primary"
          size="large"
          @click="handleNew()">{{$t('__new')}}</el-button>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">{{$t('__delete')}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import validate from '@/setup/validate'
import { formatMoney } from '@/setup/format.js'

export default {
  name: 'outboundOrderDetail',
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    orderID: { type: String },
    fromOrderStatus: { type: String }
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
        Purpose: '',
        // 以下為前端顯示用, 不會記錄進資料庫
        Status: 'New',
        AvailableQty: 0
      },
      subList: [],
      subListDeleted: [],
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
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

    // 系統簽核過程權限
    switch (this.fromOrderStatus) {
      case '1':
        this.buttonsShow = {
          new: 1,
          edit: 1,
          save: 1,
          delete: 1,
          search: 1
        }
        break
      default:
        this.buttonsShow = {
          new: 0,
          edit: 0,
          save: 0,
          delete: 0,
          search: 0
        }
        break
    }
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
      if (this.orderID === '') {
        this.handleNew()
      } else {
        let responseDetail = await this.$api.stock.getObject({ type: 'outboundOrderDetail', keyword: this.orderID })
        this.subList = responseDetail.data.result

        this.reCalAmount()
      }
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
      for (let index = 0; index < this.subList.length; index++) {
        let row = this.subList[index]

        if (row.ProductID === '' || row.Qty === 0 || row.StorageID === '') {
          this.$message({
            message: this.$t('__pleaseInput') + ' ' + this.$t('__detail'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }

        let checkValidate = null
        let object = {
          ProductID: row.ProductID,
          Purpose: row.Purpose,
          Qty: 0 - row.Qty,
          StorageID: row.StorageID
        }
        checkValidate = await validate.validateStorageIDNoCallback(object.ProductID, object.Purpose, object.Qty, object.StorageID)
        if (checkValidate !== '') {
          this.$message({
            message: row.ProductID + ' ' + row.StorageID + ' ' + this.$t('__inventoryShortage'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }
      }

      return isSuccess
    },
    // 存檔-Detail
    beforeSave: async function () {
      let isSuccess = false

      // 結合已刪除單據, 先刪除再新增
      let finalResult = this.subListDeleted.concat(this.subList)

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
          let responseEdit = await this.$api.stock.outboundOrderDetailUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.stock.outboundOrderDetailDelete({ form: row })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // ============== 子結構 ===============
    // 儲位輸入立即查詢
    remoteMethod: async function (value, row) {
      if (value.length >= 3) {
        // 強制轉為大寫
        value = value.toUpperCase()
        row.StorageID = value

        this.findStorageIDNow(row)
      }
    },
    // 即時查詢可用儲位
    findStorageIDNow: async function (row) {
      if (row.ProductID) {
        let response2 = await this.$api.stock.findStorageID({
          ProductID: row.ProductID,
          Purpose: row.Purpose,
          Qty: 0 - row.Qty,
          StorageID: row.StorageID
        })
        this.ddlStorageID = response2.data.result
        // 預帶第一筆
        if (this.ddlStorageID.length > 0) {
          row.StorageID = this.ddlStorageID[0].ID
          this.storageIDChange(row.StorageID, row)
        }
      }
    },
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
      newObj.StorageID = ''
      newObj.Status = 'New'
      this.subList.push(newObj)
      this.remoteMethod(newObj.StorageID, newObj)

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

      // 即時查詢儲位
      this.findStorageIDNow(row)
    },
    // 下拉選擇儲位
    storageIDChange: function (selected, row) {
      let findObject = this.ddlStorageID.find(item => { return item.ID === selected })
      if (findObject) {
        row.AvailableQty = findObject.UsedQty
      }

      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 特殊原因變更
    purposeChange: function (selected, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }

      // 即時查詢儲位
      this.findStorageIDNow(row)
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
    qtyChange: function (currentValue, oldValue, row) {
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
