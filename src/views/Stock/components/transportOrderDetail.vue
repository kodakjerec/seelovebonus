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
          v-if="buttonsShow.new && buttonsShowUser.new"
          default-first-option filterable clearable
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
      prop="Qty"
      :label="$t('__qty')"
      width="200">
      <template slot-scope="scope">
        <el-input-number
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
    <!-- 移出儲位 -->
    <el-table-column
      prop="FromPurpose"
      :label="$t('__picking')+$t('__storagePurpose')"
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
      prop="FromStorageID"
      :label="$t('__fromStorageID')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShow.new && buttonsShowUser.new"
          filterable clearable
          remote
          v-model="scope.row.FromStorageID"
          :disabled="scope.row.ProductID===''"
          :remote-method="(value)=>{remoteMethod_From(value, scope.row)}"
          @change="(value)=>{storageIDChange(value, scope.row)}"
          :placeholder="$t('__plzChoice')"
          style="display:block">
          <el-option v-for="item in ddlStorageID_From[scope.row.Seq]" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <!-- 移入儲位 -->
    <el-table-column
      prop="ToPurpose"
      :label="$t('__putOn')+$t('__storagePurpose')"
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
      prop="ToStorageID"
      :label="$t('__toStorageID')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShow.new && buttonsShowUser.new"
          filterable clearable
          remote
          v-model="scope.row.ToStorageID"
          :disabled="scope.row.ProductID===''"
          :remote-method="(value)=>{remoteMethod_To(value, scope.row)}"
          :placeholder="$t('__plzChoice')"
          style="display:block">
          <el-option v-for="item in ddlStorageID_To[scope.row.Seq]" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
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
  name: 'transportOrderDetail',
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
        FromStorageID: '',
        FromPurpose: '',
        ToStorageID: '',
        ToPurpose: '',
        // 以下為前端顯示用, 不會記錄進資料庫
        Status: 'New'
      },
      subList: [],
      subListDeleted: [],
      inputTimeout: null,
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
      ddlStorageID_From: [],
      ddlStorageID_To: []
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
        let responseDetail = await this.$api.stock.getObject({ type: 'transportOrderDetail', keyword: this.orderID })
        this.subList = responseDetail.data.result
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
        if (row.ProductID === '' || row.Qty === 0 || row.FromStorageID === '' || row.ToStorageID === '') {
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
          Purpose: row.FromPurpose,
          Qty: 0 - row.Qty,
          StorageID: row.FromStorageID
        }
        checkValidate = await validate.validateStorageIDNoCallback(object.ProductID, object.Purpose, object.Qty, object.StorageID)
        if (checkValidate !== '') {
          this.$message({
            message: row.ProductID + ' ' + row.FromStorageID + ' ' + this.$t('__exceedQtyLimit'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }

        object = {
          ProductID: row.ProductID,
          Purpose: row.ToPurpose,
          Qty: row.Qty,
          StorageID: row.ToStorageID
        }
        checkValidate = await validate.validateStorageIDNoCallback(object.ProductID, object.Purpose, object.Qty, object.StorageID)
        if (checkValidate !== '') {
          this.$message({
            message: row.ProductID + ' ' + row.ToStorageID + ' ' + this.$t('__exceedQtyLimit'),
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
    },
    // ============== 子結構 ===============
    // 儲位輸入立即查詢
    remoteMethod_From: async function (value, row) {
      if (value.length >= 3) {
        // 強制轉為大寫
        value = value.toUpperCase()

        clearTimeout(this.inputTimeout)
        this.inputTimeout = setTimeout(() => {
          this.findStorageIDNow_From(row, value)
        }, 500)
      }
    },
    remoteMethod_To: async function (value, row) {
      if (value.length >= 3) {
        // 強制轉為大寫
        value = value.toUpperCase()

        clearTimeout(this.inputTimeout)
        this.inputTimeout = setTimeout(() => {
          this.findStorageIDNow_To(row, value)
        }, 500)
      }
    },
    // 即時查詢可用儲位
    findStorageIDNow_From: async function (row, storageID) {
      if (row.ProductID) {
        let response2 = await this.$api.stock.findStorageID({
          ProductID: row.ProductID,
          Purpose: row.FromPurpose,
          Qty: 0 - row.Qty,
          StorageID: storageID
        })
        this.ddlStorageID_From[row.Seq] = response2.data.result
        row.FromStorageID = storageID
      }
    },
    // 即時查詢可用儲位
    findStorageIDNow_To: async function (row, storageID) {
      if (storageID === undefined) {
        storageID = row.StorageID
      }
      if (row.ProductID) {
        let response2 = await this.$api.stock.findStorageID({
          ProductID: row.ProductID,
          Purpose: row.ToPurpose,
          Qty: row.Qty,
          StorageID: storageID
        })
        this.ddlStorageID_To[row.Seq] = response2.data.result
        row.ToStorageID = storageID
      }
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.subListDeleted.push(row)
      this.subList.splice(index, 1)
    },
    // 下拉式選擇商品
    ddlSubListChange: function (selected, row) {
      let findSubList = this.originDDLSubList.find(item => item.ProductID === selected)
      if (findSubList) { this.fillSubList(row, findSubList) }
    },
    // 下拉選擇儲位
    storageIDChange: function (selected, row) {
      let findObject = this.ddlStorageID_From[row.Seq].find(item => { return item.ID === selected })
      if (findObject) {
        row.AvailableQty = findObject.AvailableQty
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

      if (row.Status === '') {
        row.Status = 'Modified'
      }
      this.qtyChange(row.Qty, row.Qty, row)
    },
    // 變更明細商品數量
    qtyChange: function (newValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    }
  }
}
</script>
