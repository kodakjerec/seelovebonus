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
        <el-select v-if="buttonsShowUser.new && scope.row.ItemType === 1"
          filterable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{ddlSubListChange(value, scope.row)}"
          style="display:block">
          <el-option v-for="item in ddlSubList" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
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
      prop="Qty"
      :label="$t('__qty')"
      width="200px">
      <template slot-scope="scope">
        <el-input-number v-if="buttonsShowUser.new && scope.row.ItemType === 1" v-model.number="scope.row[scope.column.property]" @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
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
export default {
  name: 'OrderDetail',
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    orderID: { type: String },
    projectID: { type: String },
    orderDetail: { type: Array },
    parentQty: { type: Number }
  },
  data () {
    return {
      subItem: {
        OrderID: this.orderID,
        Seq: 0,
        ProjectID: '',
        ProductID: '',
        Name: '',
        QtyOrigin: 0,
        Qty: 0,
        UnitName: '',
        ItemType: 0,
        Status: 'New'
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
        this.subList.forEach(item => { item.OrderID = newValue })
      }
    },
    orderDetail: function (newValue) {
      this.subList = JSON.parse(JSON.stringify(newValue))
    },
    parentQty: function () {
      this.parentQtyChange()
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.basic.getDropdownList({ type: 'product' })
      this.ddlSubList = response.data.result
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
    // 新增子結構
    handleNew: function () {
      // 檢查是否已經有主結構
      if (this.OrderID === '') {
        this.$refs['form'].validate()
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
      newObj.OrderID = this.orderID
      newObj.ProjectID = this.projectID
      newObj.Seq = nextSeq
      newObj.ProjectID = ''
      newObj.ItemType = 1
      newObj.Status = 'New'
      this.subList.push(newObj)
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.subListDeleted.push(row)
      this.subList.splice(index, 1)
    },
    // 下拉式選擇商品
    ddlSubListChange: function (selected, row) {
      let findSubList = this.ddlSubList.find(item => item.ID === selected)
      row.Name = findSubList.Value
      row.Qty = 1
      row.QtyOrigin = 1
      row.UnitName = findSubList.UnitName
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 變更明細商品數量
    qtyChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 父視窗:變更明細商品數量, 只變更專案商品
    parentQtyChange: function () {
      this.subList.forEach(item => {
        if (item.ItemType === 0) {
          item.Qty = item.QtyOrigin * this.parentQty
        }
      })
    },
    // 父視窗:清空選單, 填入專案商品
    parentResetItems: function (projectDetail) {
      // reset
      this.subList = []

      for (let index = 0; index < projectDetail.length; index++) {
        let product = projectDetail[index]

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
        newObj.ProductID = product.ProductID
        newObj.Name = product.ProductName
        newObj.QtyOrigin = product.Qty
        newObj.Qty = product.Qty
        newObj.Seq = nextSeq
        newObj.ProjectID = product.ProjectID
        newObj.ItemType = 0
        newObj.Status = 'New'
        this.subList.push(newObj)
      }
    }
  }
}
</script>
