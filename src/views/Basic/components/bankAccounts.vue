<template>
  <el-table
    :data="subList"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="Account"
      :label="$t('__bankAccountNo')"
      width="250">
      <template slot-scope="scope">
        <el-input v-model="scope.row[scope.column.property]" maxlength="20" show-word-limit></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="BankID"
      :label="$t('__bank')+$t('__id')"
      width="200">
      <template slot-scope="scope">
        <el-select filterable v-model="scope.row[scope.column.property]" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlBankID" :key="item.ID" :label="item.ID+''+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="Branch"
      :label="$t('__bankBranch')">
      <template slot-scope="scope">
        <el-input v-model="scope.row[scope.column.property]" maxlength="10" show-word-limit></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="UserName"
      :label="$t('__bankUserName')">
      <template slot-scope="scope">
        <el-input v-model="scope.row[scope.column.property]" maxlength="40" show-word-limit></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="IsDefault"
      :label="$t('__default')">
      <template slot-scope="scope">
        <el-switch v-model="scope.row[scope.column.property]" @change="switchChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"></el-switch>
      </template>
    </el-table-column>
    <el-table-column
      align="right"
      width="100">
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
export default {
  name: 'BankAcoounts',
  props: {
    fromType: { type: String },
    fromID: { type: String }
  },
  data () {
    return {
      subList: [],
      subListDeleted: [],
      subItem: {
        FromType: '',
        FromID: '',
        Seq: 0,
        Account: '',
        BankID: '',
        Branch: '',
        UserName: '',
        IsDefault: 0,
        // 純顯示
        Status: ''
      },
      // 下拉式選單
      ddlBankID: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let combineForm = { FromType: this.fromType, FromID: this.fromID }
      let response = await this.$api.basic.bankAccountShow({ form: combineForm })
      let list = response.data.result
      list.forEach(row => {
        row.Status = ''
        this.subList.push(row)
      })
      if (this.subList.length === 0) {
        this.handleNew()
      }

      response = this.$api.local.getDropdownList({ type: 'BankID' })
      this.ddlBankID = response
    },
    // 子結構
    // 新增子結構
    handleNew: function () {
      // 檢查是否已經有主結構
      if (this.fromID === '') {
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
      newObj.FromType = this.fromType
      newObj.FromID = this.fromID
      newObj.Seq = nextSeq
      if (nextSeq === 1) {
        newObj.IsDefault = 1
      }
      newObj.Status = 'New'
      this.subList.push(newObj)
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.subListDeleted.push(row)
      this.subList.splice(index, 1)
    },
    // 切換Default
    switchChange: function (index, row) {
      this.subList.forEach(row2 => {
        if (row2.Seq === row.Seq) {
          row2.IsDefault = 1
          row2.Status = 'Modified'
        } else {
          if (row2.IsDefault !== 0) {
            row2.IsDefault = 0
            row2.Status = 'Modified'
          }
        }
      })
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
        if (row.FromType === '' || row.FromID === '' || row.Account === '' || row.BankID === '') {
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
          let responseNew = await this.$api.basic.bankAccountUpdate({ form: row })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.bankAccountUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.bankAccountDelete({ form: row })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    }
  }
}
</script>
