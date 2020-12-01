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
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new && scope.row.ItemType === 1"
          filterable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{ddlSubListChange(value, scope.row, 1)}"
          style="display:block">
          <el-option v-for="item in ddlSubList" :key="item.ProductID" :value="item.ProductID">
            <!-- 商品明細特別加上價格 -->
            <span style="float: left">{{ item.ProductName + ' ['+ formatterMoneyUS(null,null,item.Price,null) + ']' }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ProductID }}</span>
          </el-option>
        </el-select>
        <div v-else>
          {{scope.row.ProductID}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="Name"
      :label="$t('__product')+$t('__name')">
    </el-table-column>
    <el-table-column
      prop="Price"
      :label="$t('__price')"
      :formatter="formatterMoney"
      width="100px">
    </el-table-column>
    <el-table-column
      prop="Qty"
      :label="$t('__qty')"
      width="200px">
      <template slot-scope="scope">
        <el-input-number
          v-if="buttonsShowUser.new && scope.row.ItemType === 1"
          v-model="scope.row[scope.column.property]"
          @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        <div v-else>
          {{scope.row.Qty}}
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
          v-show="buttonsShowUser.new && scope.row.ItemType === 1"
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
  name: 'OrderDetail',
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    orderID: { type: String },
    projectID: { type: String },
    parentQty: { type: Number }
  },
  data () {
    return {
      subItem: {
        OrderID: this.orderID,
        Seq: 0,
        ProjectID: this.projectID,
        ProductID: '',
        Name: '',
        QtyOrigin: 0,
        Qty: 0,
        Price: 0,
        UnitName: '',
        ItemType: 0,
        // 以下為前端顯示用, 不會記錄進資料庫
        Status: 'New',
        Amount: 0
      },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      ddlSubList: []
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) {
        this.subItem.OrderID = newValue

        this.subList.forEach(row => {
          row.OrderID = newValue
        })

        switch (this.dialogType) {
          case 'new':
            break
          case 'edit':
            this.bringOrderDetail()
            break
        }
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
      this.ddlSubList = response.data.result
    },
    // 修改狀態, 取得明細
    bringOrderDetail: async function () {
      let responseDetail = await this.$api.orders.getObject({ type: 'orderDetail', ID: this.orderID })
      this.subList = responseDetail.data.result

      this.reCalAmount()
    },
    // 存檔-Detail
    beforeSave: async function () {
      let isSuccess = false

      // 結合已刪除單據
      let finalResult = this.subList.concat(this.subListDeleted)

      for (let index = 0; index < finalResult.length; index++) {
        let uploadResult = 0
        let row = finalResult[index]
        // 錯誤處理
        if (row.OrderID === '' || row.Qty === 0) {
          continue
        }
        // 開始更新
        switch (row.Status) {
          case 'New':
            uploadResult = await this.save('new', row)
            break
          case 'Modified':
            uploadResult = await this.save('edit', row)
            break
          case 'Deleted':
            uploadResult = await this.save('delete', row)
            break
          case '':
            uploadResult = 1
            break
        }
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

      if (isSuccess) {
        return 1
      } else {
        return 0
      }
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
    ddlSubListChange: function (selected, row, ItemType) {
      let findSubList = this.ddlSubList.find(item => item.ProductID === selected)
      this.fillSubList(row, findSubList, ItemType)
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
      if (row.Status === '') {
        row.Status = 'Modified'
      }

      // TODO: 有BOM表, 另外顯示在小視窗
      // if (itemDetail.BOM === '1') {
      //   const resBomItemDetail = await this.$api.orders.getObject({ type: 'productBOMForOrderDetail', ID: itemDetail.ProductID })
      //   let bomItemDetail = resBomItemDetail.data.result
      //   for (let index = 0; index < bomItemDetail.length; index++) {
      //     this.handleNew()
      //     let rowParent = bomItemDetail[index]
      //     let row = this.subList[this.subList.length - 1]
      //     this.fillSubList(row, rowParent, 2)
      //   }
      // }

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
    // ============== 父視窗使用的函數 ===============
    // 父視窗:變更明細商品數量, 只變更專案商品
    parentQtyChange: function () {
      this.subList.forEach(item => {
        if (item.ItemType === 0) {
          item.Qty = item.QtyOrigin * this.parentQty
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
        this.fillSubList(row, rowParent, 0)
      }
    }
  }
}
</script>
