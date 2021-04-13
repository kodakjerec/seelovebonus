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
      prop="ProductID">
      <template slot="header">
        {{$t('__product')+$t('__id')}}<br/>{{$t('__product')+$t('__name')}}
      </template>
      <template slot-scope="scope">
        <el-select
          v-model="scope.row[scope.column.property]"
          default-first-option filterable clearable
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{ddlSubListChange(value, scope.row)}">
          <el-option-group v-for="group in ddlSubList" :key="group.Category1Name" :label="group.Category1Name">
            <el-option v-for="item in group.options" :key="item.ProductID" :label="item.ProductID+' '+item.ProductName" :value="item.ProductID">
              <!-- 商品明細特別加上價格 -->
              <span style="float: left">{{ item.ProductName + ' ['+ formatterMoneyUS(null,null,item.Price,null) + ']' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ProductID }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="Price"
      :label="$t('__price')"
      width="210px">
      <template slot-scope="scope">
        <el-input-number v-model="scope.row[scope.column.property]" @change="(currentValue, oldValue)=>{priceChange(currentValue, oldValue, scope.row)}"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column
      prop="Qty"
      :label="$t('__qty')"
      width="210px">
      <template slot-scope="scope">
        <el-input-number v-model="scope.row[scope.column.property]" :min="1" @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column
      prop="UnitName"
      :label="$t('__unit')"
      width="50px">
    </el-table-column>
    <el-table-column
      prop="Amount"
      :label="$t('__amount')"
      :formatter="formatterMoneyUS"
      width="100px">
    </el-table-column>
    <el-table-column
      prop="FromStorageID"
      :label="$t('__fromStorageID')"
      width="200px">
      <template slot-scope="scope">
        <el-select v-if="scope.row.Inventory" v-model="scope.row[scope.column.property]" default-first-option filterable clearable :placeholder="$t('__autofill')" @change="storageChange(scope.row)">
          <el-option v-for="item in ddlStorageIDDefaultList" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="ToStorageID"
      :label="$t('__toStorageID')"
      width="200px">
      <template slot-scope="scope">
        <el-select v-if="scope.row.Inventory" v-model="scope.row[scope.column.property]" default-first-option filterable clearable :placeholder="$t('__autofill')" @change="storageChange(scope.row)">
          <el-option v-for="item in ddlStorageIDDefaultList" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="Purpose"
      :label="$t('__storagePurpose')"
      width="100px">
      <template slot-scope="scope">
        <el-input v-if="scope.row.Inventory" v-model="scope.row[scope.column.property]"></el-input>
      </template>
    </el-table-column>
    <el-table-column
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
import { formatMoney } from '@/setup/format.js'

export default {
  name: 'ProjectAnzaOrderDetail',
  props: {
    projectID: { type: String }
  },
  data () {
    return {
      rules: {
        Price: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Qty: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      // 子結構
      // Status: '', New, Modified, Deleted
      subItem: {
        ProjectID: '',
        Seq: 0,
        ProductID: '',
        Price: 0,
        Qty: 1,
        FromStorageID: '',
        ToStorageID: '',
        Purpose: '',
        // 顯示用, 不存入資料庫
        Status: '',
        Inventory: 0,
        Name: '',
        UnitName: '',
        Amount: 0
      },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      originDDLSubList: [],
      ddlSubList: [],
      ddlStorageIDDefaultList: []
    }
  },
  watch: {
    projectID: function () {
      this.bringProjectDetail()
    }
  },
  mounted () {
    this.preLoading()
    this.bringProjectDetail()
  },
  methods: {
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

      response = await this.$api.basic.getDropdownList({ type: 'projectDetailStorageIDDefault' })
      this.ddlStorageIDDefaultList = response.data.result
    },
    bringProjectDetail: async function () {
      let response1 = await this.$api.basic.getObject({ type: 'projectAnzaOrderDetail', keyword: this.projectID })
      this.subList = response1.data.result
    },
    // 存檔前先過濾
    beforeSave: async function () {
      let isSuccess = false
      // 結合已刪除單據, 先刪除再新增
      let finalResult = this.subListDeleted.concat(this.subList)
      if (finalResult.length === 0) { isSuccess = true }

      for (let index = 0; index < finalResult.length; index++) {
        let row = finalResult[index]
        // 錯誤處理
        if (row.ProjectID === '' || row.ProudctID === '') {
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
          let responseEdit = await this.$api.basic.projectAnzaOrderDetailUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.projectAnzaOrderDetailDelete({ form: row })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // 新增子結構
    handleNew: function () {
      // 檢查是否已經有主結構
      if (this.projectID === '') {
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
      newObj.ProjectID = this.projectID
      newObj.Seq = nextSeq
      newObj.Status = 'New'
      this.subList.push(newObj)
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
      if (row.Status === '') {
        row.Status = 'Modified'
      }

      let findSubList = this.originDDLSubList.find(item => item.ProductID === selected)

      row.Name = findSubList.ProductName
      row.UnitName = findSubList.UnitName
      row.Inventory = findSubList.Inventory
      row.Price = findSubList.Price
      row.FromStorageID = ''
      row.ToStorageID = ''
      row.Purpose = ''
      this.priceChange(row.Price, 0, row)
    },
    // 更改儲位
    storageChange: function (row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    priceChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
      this.reCalAmount()
    },
    qtyChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
      this.reCalAmount()
    },
    // 重新計算專案總價
    reCalAmount: function () {
      let masterAmount = 0
      let tempAmount = 0
      this.subList.forEach(row => {
        tempAmount = row.Price * row.Qty
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
