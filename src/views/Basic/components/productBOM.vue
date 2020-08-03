<template>
  <div>
      <el-divider>{{$t('__bomSub')}}</el-divider>
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
          prop="SubID"
          :label="$t('__product')+$t('__id')">
          <template slot-scope="scope">
            <el-select v-model="scope.row[scope.column.property]" filterable :placeholder="$t('__plzChoice')" @change="(value)=>{ddlSubListChange(value, scope.row)}" style="display:block">
              <el-option v-for="item in ddlSubList" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="Qty"
          :label="$t('__qty')"
          width="100px">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row[scope.column.property]" @change="(value)=>{qtyChange(value, scope.row)}"></el-input>
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
  </div>
</template>

<script>
export default {
  name: 'ProductBOM',
  props: {
    productID: { type: String },
    productBOM: { type: Array }
  },
  data () {
    return {
      // 子結構
      // Status: '', New, Modified, Deleted
      subItem: { ProductID: '', Seq: 0, SubID: '', Qty: 1, Status: '' },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      ddlSubList: []
    }
  },
  watch: {
    productBOM: function () {
      this.subList = JSON.parse(JSON.stringify(this.productBOM))
    }
  },
  mounted () {
    this.preloading()
  },
  methods: {
    // 讀取預設資料
    preloading: async function () {
      // 取得所有原始資料
      const response = await this.$api.basic.getDropdownList({ type: 'product' })
      this.ddlSubList = response.data.result
    },
    // 存檔前先過濾
    beforeSave: async function () {
      let isSuccess = false
      // 結合已刪除單據
      const finalResult = this.subList.concat(this.subListDeleted)
      if (finalResult.length === 0) { isSuccess = true }

      for (let index = 0; index < finalResult.length; index++) {
        let uploadResult = 0
        let row = finalResult[index]
        // 錯誤處理
        if (row.ProductID === '' || row.SubID === '') {
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
        if (uploadResult === 0) {
          isSuccess = false
          return
        } else {
          isSuccess = true
        }
      }

      if (isSuccess) {
        return isSuccess
      } else {
        this.$alert(this.$t('__uploadFail'))
        return isSuccess
      }
    },
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
          const responseNew = await this.$api.basic.productBOMNew({ form: row })
          if (responseNew.status === 200) {
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.productBOMEdit({ form: row })
          if (responseEdit.status === 200) {
            isSuccess = true
          }
          break
        case 'delete':
          const responseDelete = await this.$api.basic.productBOMDelete({ form: row })
          if (responseDelete.status === 200) {
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
      if (this.productID === '') {
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
      newObj.ProductID = this.productID
      newObj.Seq = nextSeq
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
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    qtyChange: function (selected, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    }
  }
}
</script>
