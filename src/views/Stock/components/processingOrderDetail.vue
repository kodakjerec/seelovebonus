<template>
  <div>
    <!-- 成品 -->
    <h2 style="text-align:left">{{$t('__putOn')+$t('__detail')}}</h2>
    <el-table
    row-key="Seq"
    :data="subList_1"
    stripe
    border
    class="orderFunctionsCSS"
    style="width: 100%">
      <el-table-column
        prop="Seq"
        :label="$t('__seq')"
        width="60">
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
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__product')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="StorageID"
        :label="$t('__putOn')+$t('__storageAddress')"
        width="300">
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
            <el-option v-for="item in ddlStorageID[scope.row.Seq]" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
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
        prop="SetQty"
        :label="$t('__setQty')"
        width="60">
      </el-table-column>
      <el-table-column
        prop="Set"
        width="60">
        <template slot="header">
          <span style="color:red">*</span>{{$t('__set')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Qty"
        :label="$t('__qty')"
        width="60">
      </el-table-column>
      <el-table-column
        v-if="buttonsShow.new && buttonsShowUser.new"
        prop="AvailableQty"
        :label="$t('__max')+$t('__qty')"
        width="60">
      </el-table-column>
    </el-table>
    <!-- 原料 -->
    <h2 style="text-align:left">{{$t('__picking')+$t('__detail')}}</h2>
    <el-table
    row-key="Seq"
    :data="subList_0"
    stripe
    border
    class="orderFunctionsCSS"
    style="width: 100%">
      <el-table-column
        prop="Seq"
        :label="$t('__seq')"
        width="60">
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
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__product')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="StorageID"
        :label="$t('__picking')+$t('__storageAddress')"
        width="300">
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
            <el-option v-for="item in ddlStorageID[scope.row.Seq]" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
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
        prop="SetQty"
        :label="$t('__setQty')"
        width="60">
      </el-table-column>
      <el-table-column
        prop="Set"
        :label="$t('__set')"
        width="60">
      </el-table-column>
      <el-table-column
        prop="Qty"
        :label="$t('__qty')"
        width="60">
      </el-table-column>
      <el-table-column
        v-if="buttonsShow.new && buttonsShowUser.new"
        prop="AvailableQty"
        :label="$t('__max')+$t('__qty')"
        width="60">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import validate from '@/setup/validate'

export default {
  name: 'processingOrderDetail',
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    orderID: { type: String },
    fromOrderStatus: { type: String },
    fromProductID: { type: String },
    fromPurpose: { type: String },
    fromSet: { type: Number }
  },
  data () {
    return {
      subItem: {
        OrderID: this.orderID,
        Seq: 0,
        Type: 0,
        ProductID: '',
        Name: '',
        Qty: 0,
        StorageID: '',
        Purpose: '',
        SetQty: 0,
        Set: 0,
        // 以下為前端顯示用, 不會記錄進資料庫
        Status: 'New',
        AvailableQty: 0
      },
      subList: [],
      subList_0: [],
      subList_1: [],
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
    },
    fromProductID: function (newValue) {
      if (newValue) {
        this.bringProcessingDetail()
      }
    },
    fromSet: function (newValue, oldValue) {
      this.setChange(newValue, oldValue)
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
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.orders.getDropdownList({ type: 'productsForOrderDetail' })
      this.originDDLSubList = response.data.result
    },
    // 修改狀態, 取得明細
    bringOrderDetail: async function () {
      if (this.orderID !== '') {
        let responseDetail = await this.$api.stock.getObject({ type: 'processingOrderDetail', keyword: this.orderID })
        this.subList = responseDetail.data.result

        // 子=>父: 帶入明細主要商品
        let returnItem = {
          Purpose: '',
          ProductID: '',
          Set: 0
        }
        this.subList.forEach(row => {
          if (row.Type === 1) {
            returnItem.Purpose = row.Purpose
            returnItem.ProductID = row.ProductID
            returnItem.Set = row.Set
            this.$emit('bringProcessingItem', returnItem)
          }
        })
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
        return isSuccess
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
          Qty: row.Qty,
          StorageID: row.StorageID
        }
        checkValidate = await validate.validateStorageIDNoCallback(object.ProductID, object.Purpose, object.Qty, object.StorageID)
        if (checkValidate !== '') {
          this.$message({
            message: row.ProductID + ' ' + row.StorageID + ' ' + this.$t('__exceedQtyLimit'),
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
          let responseEdit = await this.$api.stock.processingOrderDetailUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.stock.processingOrderDetailDelete({ form: row })
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
      if (value.length >= 5) {
        // 強制轉為大寫
        value = value.toUpperCase()
        row.StorageID = value

        clearTimeout(this.inputTimeout)
        this.inputTimeout = setTimeout(() => {
          this.findStorageIDNow(row, row.Type)
        }, 500)
      }
    },
    // 即時查詢可用儲位
    findStorageIDNow: async function (row, Type) {
      if (row.ProductID) {
        let findQty = 0
        if (Type === 0) {
          findQty = 0 - row.Qty
        } else {
          findQty = row.Qty
        }
        let response2 = await this.$api.stock.findStorageID({
          ProductID: row.ProductID,
          Purpose: row.Purpose,
          Qty: findQty,
          StorageID: row.StorageID
        })
        this.ddlStorageID[row.Seq] = response2.data.result
        // 預帶第一筆
        if (this.ddlStorageID[row.Seq].length > 0) {
          row.StorageID = this.ddlStorageID[row.Seq][0].ID
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
      newObj.Purpose = this.fromPurpose
      newObj.Status = 'New'
      this.subList.push(newObj)

      // 新增商品還沒有填入資料, 不用計算金額
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.subListDeleted.push(row)
      this.subList.splice(index, 1)
    },
    // 父=>選擇商品, 帶出明細商品
    bringProcessingDetail: async function () {
      // reset all
      if (this.subList.length > 0) {
        let maxLength = this.subList.length
        for (let index = 0; index < maxLength; index++) {
          let row = this.subList[0]
          if (row) { this.handleDelete(0, row) }
        }
        this.subList_0 = []
        this.subList_1 = []
      }

      // 填入加工後商品
      let findSubList = this.originDDLSubList.find(item => item.ProductID === this.fromProductID)
      if (findSubList) {
        this.handleNew()
        let processingType = 1
        let row = this.subList[0]
        row.Type = processingType
        this.fillSubList(row, findSubList, 1)
        // 即時查詢儲位
        await this.findStorageIDNow(row, row.Type)
      }

      // 填入原料
      let responseBOM = await this.$api.basic.getObject({ type: 'productBOM', keyword: this.fromProductID })
      let bomList = responseBOM.data.result
      for (let index = 0; index < bomList.length; index++) {
        let bomItem = bomList[index]
        let findSubList2 = this.originDDLSubList.find(item => item.ProductID === bomItem.SubID)
        if (findSubList2) {
          this.handleNew()
          let processingType = 0
          let row = this.subList[this.subList.length - 1]
          row.Type = processingType
          this.fillSubList(row, findSubList2, bomItem.Qty)
          // 即時查詢儲位
          await this.findStorageIDNow(row, row.Type)
        }
      }

      // 分割
      this.subList_0 = this.subList.filter(item => { return item.Type === 0 })
      this.subList_1 = this.subList.filter(item => { return item.Type === 1 })
    },
    // 下拉選擇儲位
    storageIDChange: function (selected, row) {
      let findObject = this.ddlStorageID[row.Seq].find(item => { return item.ID === selected })
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
    fillSubList: async function (row, itemDetail, SetQty) {
      row.ProductID = itemDetail.ProductID
      row.Name = itemDetail.ProductName
      row.SetQty = SetQty
      row.Set = this.fromSet

      if (row.Status === '') {
        row.Status = 'Modified'
      }
      this.setChange(row.Set, row.Set, row)
    },
    // 變更明細商品數量
    setChange: function (currentValue, oldValue) {
      this.subList.forEach(row => {
        row.Set = currentValue
        row.Qty = row.SetQty * row.Set
        if (row.Status === '') {
          row.Status = 'Modified'
        }
      })
    }
  }
}
</script>
