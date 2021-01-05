<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form :inline="true">
      <el-form-item :label="$t('__kind')">
        <el-select v-model="projectID" :placeholder="$t('__plzChoice')" style="display:block" :disabled="isNewPB" @change="(value)=>{ddlPPBListChange(value)}">
          <el-option v-for="item in ddlPPBList" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-show="!isNewPB" @click="openNewPB">{{$t('__new')+$t('__performanceBonus')}}</el-button>
      </el-form-item>
    </el-form>
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
          <el-select v-model="scope.row[scope.column.property]" :placeholder="$t('__plzChoice')" @change="(value)=>{ddlSubListChange(value, scope.row)}" style="display:block" :disabled="!buttonsShowUser.save">
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
    <newForm
      :dialog-show="dialogShowNewPB"
      @dialog-cancel="cancelNewPB"
      @dialog-save="saveNewPB"></newForm>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="beforeSave">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import newForm from './projectBonusNewList'

export default {
  name: 'ProjectPerformanceBonus',
  components: {
    newForm
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      // 子結構
      // Status: '', New, Modified, Deleted
      projectID: 'BASE',
      myTitle: this.$t('__edit') + this.$t('__performanceBonus'),
      subItem: { ProjectID: '', Seq: 0, Grade: null, Percentage: 0, Status: '' },
      subList: [],
      subListDeleted: [],
      // 新增PB
      dialogShowNewPB: false,
      isNewPB: false, // 進入新增狀態不要切換類別
      // 下拉是選單
      ddlSubList: [],
      ddlPPBList: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.basic.getDropdownList({ type: 'grade' })
      this.ddlSubList = response.data.result
      let response2 = await this.$api.basic.getDropdownList({ type: 'projectPerformanceBonusList' })
      this.ddlPPBList = response2.data.result

      let response3 = await this.$api.basic.getObject({ type: 'projectPerformanceBonus', keyword: this.projectID })
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
        if (row.ProjectID === '' || row.Grade === null) {
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
          let responseNew = await this.$api.basic.projectPBonusNew({ form: row })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.projectPBonusEdit({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.projectPBonusDelete({ form: row })
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
    ddlSubListChange: function (selected, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 切換大類
    ddlPPBListChange: async function (selected) {
      this.projectID = selected
      let response3 = await this.$api.basic.getObject({ type: 'projectPerformanceBonus', keyword: this.projectID })
      this.subList = response3.data.result
    },
    percentageChange: function (currentValue, oldValue, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // New PB
    openNewPB: function () {
      this.dialogShowNewPB = true
    },
    saveNewPB: async function (newObject) {
      this.dialogShowNewPB = false

      // 找回BASE設定
      this.projectID = 'BASE'
      let response3 = await this.$api.basic.getObject({ type: 'projectPerformanceBonus', keyword: this.projectID })
      this.subList = response3.data.result

      // 填入基本資料
      this.ddlPPBList.push(newObject)
      this.projectID = newObject.ID
      this.myTitle = this.$t('__new') + this.$t('__performanceBonus')
      this.isNewPB = true

      this.subList.forEach(row => {
      // 替換所有代號
        row.ProjectID = newObject.ID
        // 替換每行狀態=New
        row.Status = 'New'
      })
    },
    cancelNewPB: function () {
      this.dialogShowNewPB = false
    }
  }
}
</script>
