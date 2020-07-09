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
      prop="Grade"
      :label="$t('__grade')">
      <template slot-scope="scope">
        <el-select v-model="scope.row[scope.column.property]" :placeholder="$t('__plzChoice')" @change="(value)=>{ddlSubListChange(value, scope.row)}" style="display:block">
          <el-option v-for="item in ddlSubList" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="Percentage"
      :label="$t('__performanceBonus')+$t('__percentage')+'(%)'">
      <template slot-scope="scope">
        <el-input v-model="scope.row[scope.column.property]" autocomplete="off" @change="(value)=>{percentageChange(value, scope.row)}"></el-input>
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
export default {
  name: 'ProjectPBonus',
  props: {
    projectID: { type: String },
    projectPBonus: { type: Array }
  },
  data () {
    return {
      // 子結構
      // Status: '', New, Modified, Deleted
      subItem: { ProjectID: '', Seq: 0, Grade: null, Percentage: 0, Status: '' },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      ddlSubList: []
    }
  },
  watch: {
    projectPBonus: function () {
      this.subList = this.projectPBonus
    }
  },
  mounted () {
    this.preloading()
  },
  methods: {
    // 讀取預設資料
    preloading: async function () {
      // 取得所有原始資料
      const response = await this.$api.basic.getDropdownList({ type: 'grade' })
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
        if (row.ProjectID === '') {
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
        return 'success'
      } else {
        this.$alert(this.$t('__uploadFail'))
        return 'fail'
      }
    },
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
          const responseNew = await this.$api.basic.projectPBonusNew({ form: row })
          if (responseNew.status === 200) {
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.projectPBonusEdit({ form: row })
          if (responseEdit.status === 200) {
            isSuccess = true
          }
          break
        case 'delete':
          const responseDelete = await this.$api.basic.projectPBonusDelete({ form: row })
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
      if (this.projectID === '') {
        this.$refs['form'].validate()
        return
      }

      let newObj = Object.assign({}, this.subItem)
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
    },
    // 下拉式選擇商品
    ddlSubListChange: function (selected, row) {
      if (row.status === '') {
        row.Status = 'Modified'
      }
    },
    percentageChange: function (selected, row) {
      if (row.status === '') {
        row.Status = 'Modified'
      }
    }
  }
}
</script>
