<template>
  <el-table
  row-key="Seq"
  :expand-row-keys="subListExpand"
  @expand-change="expandChange"
  :data="subList"
  stripe
  border
  class="orderFunctionsCSS"
  style="width: 100%">
    <!-- 順序 -->
    <el-table-column
      prop="Seq"
      :label="$t('__seq')"
      width="50px">
    </el-table-column>
    <!-- 商品代號 -->
    <el-table-column
      prop="ProductID">
      <template slot="header">
        {{$t('__product')+$t('__id')}}<br/>{{$t('__product')+$t('__name')}}
      </template>
      <template slot-scope="scope">
        <div v-if="buttonsShow.new && buttonsShowUser.new && scope.row.ItemType === 1">
          <el-select
            default-first-option filterable clearable
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')"
            @change="(value)=>{ddlSubListChange(value, scope.row, 1)}"
            style="display:block">
            <el-option-group v-for="group in ddlSubList" :key="group.Category1Name" :label="group.Category1Name">
              <el-option v-for="item in group.options" :key="item.ProductID" :label="item.ProductID+' '+item.ProductName" :value="item.ProductID">
                <!-- 商品明細特別加上價格 -->
                <span style="float: left">{{ item.ProductName + ' ['+ formatterMoneyUS(null,null,item.Price,null) + ']' }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ProductID }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div v-else>
          {{scope.row[scope.column.property]}}<br/>{{scope.row.Name}}
        </div>
      </template>
    </el-table-column>
    <!-- 價格 -->
    <el-table-column
      prop="Price"
      :formatter="formatterMoney"
      width="200px">
      <template slot="header">
        {{$t('__price')}}
        <el-button size="mini" @click="checkOpenEditMode">{{$t('__openEditMode')}}</el-button>
      </template>
      <template slot-scope="scope">
        <el-input-number
          v-if="openEditMode"
          :min="0"
          v-model="scope.row[scope.column.property]"
          @change="(currentValue, oldValue)=>{priceChange(currentValue, oldValue, scope.row)}"></el-input-number>
        <span v-else>
          {{formatterMoney(null,null,scope.row[scope.column.property],null)}}
        </span>
      </template>
    </el-table-column>
    <!-- 數量 -->
    <el-table-column
      prop="Qty"
      :label="$t('__qty')"
      width="145px">
      <template slot-scope="scope">
        <el-input-number
          style="width:120px"
          :min="1"
          v-if="buttonsShow.new && buttonsShowUser.new && scope.row.ItemType === 1"
          v-model="scope.row[scope.column.property]"
          @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <!-- 單位 -->
    <el-table-column
      prop="UnitName"
      :label="$t('__unit')"
      width="50px">
    </el-table-column>
    <!-- 金額 -->
    <el-table-column
      prop="Amount"
      :label="$t('__amount')"
      :formatter="formatterMoneyUS"
      width="100px">
    </el-table-column>
    <!-- 移出儲位 -->
    <el-table-column
      prop="FromStorageID"
      :label="$t('__fromStorageID')"
      width="200px">
      <template slot-scope="scope">
        <el-select
          v-if="scope.row.Inventory"
          v-model="scope.row[scope.column.property]"
          default-first-option filterable clearable
          :placeholder="$t('__plzChoice')"
          :disabled="!(buttonsShow.new === 1 && buttonsShowUser.new === 1 && scope.row.disableFromStorageID)">
          <el-option v-for="item in ddlFromStorageIDList[scope.row.Seq]" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <!-- 移入儲位 -->
    <el-table-column
      prop="ToStorageID"
      :label="$t('__toStorageID')"
      width="200px">
      <template slot-scope="scope">
        <el-select
          v-if="scope.row.Inventory"
          v-model="scope.row[scope.column.property]"
          default-first-option filterable clearable
          :placeholder="$t('__plzChoice')"
          :disabled="!(buttonsShow.new === 1 && buttonsShowUser.new === 1 && scope.row.disableToStorageID)">
          <el-option v-for="item in ddlToStorageIDList[scope.row.Seq]" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <!-- 操作 -->
    <el-table-column
      align="right"
      width="95px">
      <template slot="header">
        <el-button
          type="primary"
          size="large"
          @click="handleNew()">{{$t('__new')}}</el-button>
      </template>
      <template slot-scope="scope">
        <el-button
          v-show="buttonsShow.new === 1 && buttonsShowUser.new === 1 && scope.row.ItemType === 1"
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">{{$t('__delete')}}</el-button>
      </template>
    </el-table-column>
    <!-- 擴充功能 -->
    <el-table-column type="expand" width="50px">
      <template slot="header">
        {{$t('__extend')}}<br/>{{$t('__function')}}
      </template>
      <template slot-scope="scope">
        <order-detail-functions
          :ref="'orderDetailFunctions' + scope.row.Seq"
          :buttonsShow="buttonsShow"
          :buttonsShowUser="buttonsShowUser"
          :orderDetail="scope.row"
          :productFunctionsList="productFunctionsList">
        </order-detail-functions>
      </template>
    </el-table-column>
    <open-edit-mode
      :dialogShow="dialogShowEditMode"
      @dialog-cancel="dialogShowEditModeCancel"
      @dialog-save="dialogShowEditModeSave"></open-edit-mode>
  </el-table>
</template>

<script>
import { formatMoney } from '@/setup/format.js'
import orderDetailFunctions from './detailFunctions/orderDetailFunctions'
import openEditMode from '@/components/openEditMode'

export default {
  name: 'OrderDetail',
  components: {
    orderDetailFunctions,
    openEditMode
  },
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    fromOrderID: { type: String },
    fromOrderStatus: { type: String },
    projectID: { type: String },
    parentQty: { type: Number }
  },
  data () {
    return {
      subItem: {
        OrderID: this.fromOrderID,
        Seq: 0,
        ProjectID: this.projectID,
        ProductID: '',
        Name: '',
        QtyOrigin: 0,
        Qty: 0,
        Price: 0,
        UnitName: '',
        ItemType: 0,
        FromStorageID: '',
        ToStorageID: '',
        Purpose: '',
        // 以下為前端顯示用, 不會記錄進資料庫
        Status: 'New',
        Amount: 0,
        disableFromStorageID: false,
        disableToStorageID: false,
        Inventory: false,
        // 商品特殊功能顯示(不記錄進資料庫)
        showExpandFunctions: 0,
        chglandCertificate: 0,
        transferCustomer: 0
      },
      subList: [],
      subListDeleted: [],
      subListExpand: [], // 要展開的明細(給el-table展開用)
      productFunctionsList: [], // 特殊功能清單(所有商品)
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
      // 修改模式
      openEditMode: false, // 開啟修改金額模式
      dialogShowEditMode: false, // 顯示修改模式
      // 下拉是選單
      originDDLSubList: [],
      ddlSubList: [],
      ddlFromStorageIDList: [],
      ddlToStorageIDList: [], // 商品可以選擇的儲位清單
      functionsList: [] // 商品+特殊功能
    }
  },
  watch: {
    fromOrderID: function (newValue) {
      if (newValue) {
        this.subItem.OrderID = newValue

        this.subList.forEach(row => {
          row.OrderID = newValue
        })
      }
    },
    parentQty: function () {
      this.parentQtyChange()
    }
  },
  async mounted () {
    await this.preLoading()

    switch (this.dialogType) {
      case 'new':
        break
      case 'edit':
        this.bringOrderDetail()
        break
    }

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

      // (既有)商品明細-額外功能
      if (this.fromOrderID) {
        let responseDetail = await this.$api.orders.getObject({ type: 'productFunctons', keyword: this.fromOrderID })
        this.productFunctionsList = responseDetail.data.result
      }

      // (設定)商品明細-額外功能
      let response2 = await this.$api.orders.getDropdownList({ type: 'productFunctionsForOrderDetail' })
      this.functionsList = response2.data.result
    },
    // 修改狀態, 取得明細
    bringOrderDetail: async function () {
      let responseDetail = await this.$api.orders.getObject({ type: 'orderDetail', keyword: this.fromOrderID })
      this.subList = responseDetail.data.result

      this.bringFunctions()

      this.reCalAmount()
    },
    // 檢查正確性
    checkValidate: async function () {
      let isSuccess = false

      // 檢查主表單
      this.subList.slice(0).forEach(row => {
        if (this.$refs['orderDetailFunctions' + row.Seq]) {
          isSuccess = false
          isSuccess = this.$refs['orderDetailFunctions' + row.Seq].checkValidate()
        } else {
          isSuccess = true
        }
        if (!isSuccess) { return isSuccess }

        if (row.ProjectID === '' || row.Qty === 0) {
          this.$message({
            message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__detail'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }

        if (row.Inventory === 1) {
          if (row.FromStorageID === '' || row.ToStorageID === '') {
            this.$message({
              message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__detail') + this.$t('__storageAddress'),
              type: 'error'
            })
            isSuccess = false
            return isSuccess
          }
        }
      })

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

        // 檢查額外功能存檔
        if (this.$refs['orderDetailFunctions' + row.Seq]) {
          isSuccess = this.$refs['orderDetailFunctions' + row.Seq].beforeSave()
          if (!isSuccess) { return isSuccess }
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
          let responseNew = await this.$api.orders.orderDetailNew({ form: row })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.orders.orderDetailEdit({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.orders.orderDetailDelete({ form: row })
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
      // 檢核是否可修改
      if ((this.buttonsShow.new && this.buttonsShowUser.new) === 0) {
        this.$message.error(this.$t('__denyEditNoPermission'))
        return
      }

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
      newObj.OrderID = this.fromOrderID
      newObj.ProjectID = this.projectID
      newObj.Seq = nextSeq
      newObj.ProductID = ''
      newObj.ItemType = 1
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
    ddlSubListChange: async function (selected, row, ItemType) {
      let findSubList = this.originDDLSubList.find(item => item.ProductID === selected)

      // 填入明細
      if (findSubList) {
        this.fillSubList(row, findSubList, ItemType)
        // 建議儲位
        this.bringDefaultStorageAddress(row)
      }
    },
    // 填入選擇商品: 一般商品
    // ItemType: 0-主約 1-附約主品項 2-附約明細商品(不計價)
    fillSubList: async function (row, itemDetail, ItemType) {
      row.ProductID = itemDetail.ProductID
      row.Name = itemDetail.ProductName
      row.Qty = itemDetail.Qty
      row.QtyOrigin = itemDetail.Qty
      row.Price = itemDetail.Price
      row.UnitName = itemDetail.UnitName
      row.ItemType = ItemType
      row.Inventory = itemDetail.Inventory
      row.FromStorageID = itemDetail.FromStorageID
      row.ToStorageID = itemDetail.ToStorageID
      row.Purpose = itemDetail.Purpose
      row.Inventory = itemDetail.Inventory

      if (row.Status === '') {
        row.Status = 'Modified'
      }

      // (主約)儲位有預設帶入, 禁止修改
      if (ItemType === 0) {
        if (itemDetail.FromStorageID !== '') {
          row.disableFromStorageID = true
        }
        if (itemDetail.ToStorageID !== '') {
          row.disableToStorageID = true
        }
      }

      // TODO: 有BOM表, 另外顯示在小視窗
      // if (itemDetail.BOM === '1') {
      //   const resBomItemDetail = await this.$api.orders.getObject({ type: 'productBOMForOrderDetail', keyword: itemDetail.ProductID })
      //   let bomItemDetail = resBomItemDetail.data.result
      //   for (let index = 0; index < bomItemDetail.length; index++) {
      //     this.handleNew()
      //     let rowParent = bomItemDetail[index]
      //     let row = this.subList[this.subList.length - 1]
      //     this.fillSubList(row, rowParent, 2)
      //   }
      // }

      this.bringFunctions()
      this.qtyChange(row.Qty, row.Qty, row)
      this.reCalAmount()
    },
    // 變更明細商品數量
    qtyChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }

      if (row.showExpandFunctions === 1 && this.$refs['orderDetailFunctions' + row.Seq] !== undefined) {
        this.$refs['orderDetailFunctions' + row.Seq].qtyChange(currentValue)
      }

      this.reCalAmount()
    },
    // 變更商品價格
    priceChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
      this.reCalAmount()
    },
    // 重新計算專案總價
    reCalAmount: function () {
      let masterAmount = 0; let subAmount = 0; let tempAmount = 0
      this.subList.forEach(row => {
        tempAmount = row.Price * row.Qty
        row.Amount = tempAmount
        switch (row.ItemType) {
          case 0:
            masterAmount += tempAmount
            break
          case 1:
            subAmount += tempAmount
            break
        }
      })
      this.$emit('reCalculateDetail', {
        masterAmount: masterAmount,
        subAmount: subAmount
      })
    },
    // 帶入預設儲位
    bringDefaultStorageAddress: async function (row) {
      if (row.Inventory === 0) {
        return
      }
      // 取得建議儲位
      // reset
      this.ddlFromStorageIDList[row.Seq] = []

      // get
      // fromStorageID
      if (row.FromStorageID === '') {
        let response = await this.$api.stock.findStorageID({ ProductID: row.ProductID, Purpose: row.Purpose, Qty: 0 - row.Qty, StorageID: '' })
        let result = response.data.result
        if (result.length > 0) {
          this.ddlFromStorageIDList[row.Seq] = result
          row.FromStorageID = this.ddlFromStorageIDList[row.Seq][0].ID
        }
      }
      // ToStorageID

      if (row.ToStorageID === '') {
        let response = await this.$api.stock.findStorageID({ ProductID: row.ProductID, Purpose: row.Purpose, Qty: row.Qty, StorageID: '' })
        let result = response.data.result
        if (result.length > 0) {
          this.ddlToStorageIDList[row.Seq] = result
          row.ToStorageID = this.ddlToStorageIDList[row.Seq][0].ID
        }
      }
    },
    // ============== 明細特殊功能 ===============
    // expand
    expandChange: function (row, expandedRows) {
      expandedRows.forEach(item => {
        this.subListExpand.push(item.Seq)
      })
    },
    // 帶入專案功能
    bringFunctions: async function () {
      // reset
      this.subListExpand = []

      // 開啟專案功能
      // functionsList 商品有開啟的特殊功能
      // 比對該商品是否應該開啟特殊功能
      this.functionsList.forEach(MasterItem => {
        this.subList.forEach(item => {
          if (item.ProductID === MasterItem.ProductID) {
            item.showExpandFunctions = MasterItem.Available
            item[MasterItem.Function] = MasterItem.Available
          }
        })
      })

      // 如果有開啟特殊功能, 自動展開明細的特殊功能
      let expandFunctionsList = this.subList.filter(item => { return item.showExpandFunctions === 1 })
      expandFunctionsList.forEach(item => {
        this.subListExpand.push(item.Seq)
      })
    },
    // ============== 父視窗使用的函數 ===============
    // 父視窗:變更明細商品數量, 只變更專案商品
    parentQtyChange: function () {
      this.subList.forEach(item => {
        if (item.ItemType === 0) {
          let oldQty = item.Qty
          item.Qty = item.QtyOrigin * this.parentQty
          this.qtyChange(item.Qty, oldQty, item)
        }
      })
      this.reCalAmount()
    },
    // 父視窗:清空選單, 填入專案商品
    parentResetItems: function (projectDetail) {
      // reset
      this.subList = []

      // 模仿 手動填入品項
      for (let index = 0; index < projectDetail.length; index++) {
        this.handleNew()
        let rowParent = projectDetail[index]
        let row = this.subList[this.subList.length - 1]

        // 填入明細
        this.fillSubList(row, rowParent, 0)

        // 建議儲位
        this.bringDefaultStorageAddress(row)
      }
    },
    // ============== 修改單價 ===============
    // 開啟修改單價模式
    checkOpenEditMode: function () {
      if ((this.buttonsShow.new && this.buttonsShowUser.new) === 0) {
        this.$message.error(this.$t('__denyEditNoPermission'))
        return
      }
      // 不要重複啟動
      if (this.openEditMode) {
        return
      }
      this.dialogShowEditMode = true
    },
    dialogShowEditModeCancel: function () {
      this.dialogShowEditMode = false
    },
    dialogShowEditModeSave: function () {
      this.dialogShowEditMode = false
      this.openEditMode = true
    }
  }
}
</script>
<style lang="scss" scoped>
.orderFunctionsCSS {
  /deep/ tr > td.el-table__expanded-cell {
    background-color: bisque;
  }
}
</style>
