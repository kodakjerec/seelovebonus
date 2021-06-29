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
        {{scope.row.ProductID+' '+scope.row.Name}}
      </template>
    </el-table-column>
    <el-table-column
      prop="Qty"
      :label="$t('__qty')"
      width="100px">
    </el-table-column>
    <el-table-column
      prop="Price"
      :label="$t('__price')"
      :formatter="formatterMoneyUS"
      width="100px">
    </el-table-column>
    <el-table-column
      prop="FromStorageID"
      :label="$t('__fromStorageID')"
      width="200px">
    </el-table-column>
    <el-table-column
      prop="ToStorageID"
      :label="$t('__toStorageID')"
      width="200px">
    </el-table-column>
    <el-table-column
      prop="Purpose"
      :label="$t('__storagePurpose')"
      width="100px">
    </el-table-column>
  </el-table>
</template>

<script>
import { formatMoney } from '@/setup/format.js'
import validate from '@/setup/validate'

export default {
  name: 'AnzaOrderDetail',
  props: {
    fromList: { type: Array }
  },
  data () {
    return {
      rules: {
        Price: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Qty: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      subList: [],
      subListDeleted: []
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
    },
    bringProjectDetail: async function () {
      this.subList = this.fromList

      for (let index = 0; index < this.subList.length; index++) {
        let row = this.subList[index]

        row.Status = ''

        // 查找移出儲位
        if (row.FromStorageID === '') {
          let response = await this.$api.stock.findStorageID({ ProductID: row.ProductID, Purpose: row.Purpose, Qty: 0 - row.Qty, StorageID: row.FromStorageID })
          let result = response.data.result
          if (result.length > 0) {
            row.FromStorageID = result[0].ID
            row.Status = 'Modified'
          }
        }
      }
    },
    // 檢查正確性
    checkValidate: async function () {
      let isSuccess = false

      // 檢查主表單
      for (let index = 0; index < this.subList.length; index++) {
        let row = this.subList[index]
        isSuccess = true

        // 關係庫存
        if (row.Inventory === 1) {
          if (row.FromStorageID === '' || row.ToStorageID === '') {
            this.$message({
              message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__detail') + this.$t('__storageAddress'),
              type: 'error'
            })
            isSuccess = false
            return isSuccess
          }

          // 檢查庫存餘額是否足夠
          let checkValidate = null

          // 移出
          checkValidate = await validate.validateStorageID(row.ProductID, row.Purpose, 0 - row.Qty, row.FromStorageID, null)

          if (checkValidate !== '') {
            this.$message({
              message: this.$t('__fromStorageID') + this.$t('__inventoryShortage'),
              type: 'error'
            })
            isSuccess = false
            return isSuccess
          }

          // 移入
          checkValidate = await validate.validateStorageID(row.ProductID, row.Purpose, row.Qty, row.ToStorageID, null)

          if (checkValidate !== '') {
            this.$message({
              message: this.$t('__tofromStorageID') + this.$t('__inventoryShortage'),
              type: 'error'
            })
            isSuccess = false
            return isSuccess
          }
        }

        isSuccess = true
      }

      return isSuccess
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
          let responseEdit = await this.$api.orders.anzaOrderDetailUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    }
  }
}
</script>
