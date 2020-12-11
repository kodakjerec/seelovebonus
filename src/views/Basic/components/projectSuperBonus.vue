<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
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
        prop="Price"
        :label="$t('__sumOfBusinessMin')">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row[scope.column.property]" :min="0" @change="(currentValue, oldValue)=>{priceChange(currentValue, oldValue, scope.row)}" :disabled="!buttonsShowUser.save"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="Percentage"
        :label="$t('__superBonus')+$t('__percentage')+'(%)'">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row[scope.column.property]" :precision="2" :min="0" @change="(currentValue, oldValue)=>{percentageChange(currentValue, oldValue, scope.row)}" :disabled="!buttonsShowUser.save"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="100px"
        v-if="buttonsShowUser.save">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="beforeSave">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProjectSuperBonus',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      // 子結構
      // Status: '', New, Modified, Deleted
      projectID: 'R00001',
      myTitle: this.$t('__edit') + this.$t('__superBonus'),
      subItem: { ProjectID: '', Seq: 0, Price: 0, Percentage: 0, Status: '' },
      subList: [],
      subListDeleted: []
      // 下拉是選單
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response3 = await this.$api.basic.getObject({ type: 'projectSuperBonus', ID: this.projectID })
      this.subList = response3.data.result
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 存檔前先過濾
    beforeSave: async function () {
      let isSuccess = false
      // 結合已刪除單據
      let finalResult = this.subList.concat(this.subListDeleted)
      if (finalResult.length === 0) { isSuccess = true }

      for (let index = 0; index < finalResult.length; index++) {
        let row = finalResult[index]
        // 錯誤處理
        if (row.ProjectID === '' || row.Price === 0) {
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

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    },
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
          let responseNew = await this.$api.basic.projectSuperBonusNew({ form: row })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.projectSuperBonusEdit({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.projectSuperBonusDelete({ form: row })
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
    },
    // 下拉式選擇商品
    priceChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    percentageChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    }
  }
}
</script>
