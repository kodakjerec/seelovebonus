<template>
  <div>
    <el-button @click="goBack">{{$t('__goback')}}</el-button>
    <h1>{{myTitle}}</h1>
    <!-- 檢視 -->
    <el-table
      :data="steps"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="StepName">
      </el-table-column>
      <el-table-column
        :label="$t('__signOffGroups')">
        <template slot-scope="scope">
          <el-tag v-for="object in scope.row.subList" :key="object.Seq" :type="object.UserType === 0 ? '': 'success'">
            {{object.ID + ' ' + object.GroupName}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改小視窗 -->
    <el-dialog :title="myTitle2" :visible="dialogShow" center width="80vw" @close="cancel">
      <h2>{{step.StepName}}</h2>
      <el-table
        :data="step.subList"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="UserType"
          label="UserType">
          <template slot-scope="scope">
            <el-select
              filterable
              v-model="scope.row.UserType"
              :placeholder="$t('__plzChoice')"
              @change="(value)=>{ddlUserTypeChange(value, scope.row)}"
              style="display:block">
              <el-option v-for="item in ddlUserType" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="ID"
          :label="$t('__groups') + ' or ' + $t('__operator')">
          <template slot-scope="scope">
            <el-select
              filterable
               v-show="scope.row.UserType === 0"
              v-model="scope.row.ID"
              :placeholder="$t('__plzChoice')"
              @change="(value)=>{ddlIDChange(value, scope.row)}"
              style="display:block">
              <el-option v-for="item in ddlGroups" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
            <el-select
              filterable
              v-show="scope.row.UserType === 1"
              v-model="scope.row.ID"
              :placeholder="$t('__plzChoice')"
              @change="(value)=>{ddlIDChange(value, scope.row)}"
              style="display:block">
              <el-option v-for="item in ddlUsers" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('__cancel')}}</el-button>
        <el-button type="primary" @click="beforeSave">{{$t('__save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'orderSignOffManual',
  props: {
    orderType: { type: String },
    parent: { type: String }
  },
  data () {
    return {
      steps: [],
      step: {},
      subItem: {
        Seq: '0',
        ParentSeq: '0',
        UserType: 0,
        ID: '',
        // 顯示用, 部紀錄資料庫
        GroupName: ''
      },
      permissions: [],
      myTitle: this.$t('__signOffProcedure'),
      myTitle2: this.$t('__edit') + this.$t('__signOffProcedure'),
      dialogShow: false,
      // 以下為下拉式選單
      ddlUserType: [{ ID: 0, Value: this.$t('__groups') }, { ID: 1, Value: this.$t('__operator') }],
      ddlGroups: [],
      ddlUsers: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      let response = await this.$api.signOff.getObject({ type: 'signOffProcedure', keyword: this.orderType })
      this.steps = response.data.result

      let responsePermission = await this.$api.signOff.getObject({ type: 'signOffPermission', keyword: this.orderType })
      this.permissions = responsePermission.data.result
      this.steps.forEach(item => {
        item.Status = ''
        item.subList = this.permissions.filter(sub => { return sub.ParentSeq === item.Seq })
      })

      let resGroups = await this.$api.settings.getDropdownList({ type: 'groupsList' })
      this.ddlGroups = resGroups.data.result
      let resUsers = await this.$api.settings.getDropdownList({ type: 'usersList' })
      this.ddlUsers = resUsers.data.result
    },
    goBack: function () {
      this.$router.push({
        name: this.parent
      })
    },
    handleClick: function (row, column, event) {
      this.dialogShow = true
      this.step = JSON.parse(JSON.stringify(row))
      this.step.subListDeleted = []
    },
    cancel: function () {
      this.dialogShow = false
      this.step = {}
    },
    // ===== 以下為修改小視窗 =====
    // 紀錄提前整理
    beforeSave: async function () {
      // 結合已刪除單據
      let finalResult = this.step.subList.concat(this.step.subListDeleted)
      if (finalResult.length === 0) { return }

      for (let index = 0; index < finalResult.length; index++) {
        let row = finalResult[index]
        // 錯誤處理
        if (row.ProjectID === '' || row.ProudctID === '') {
          continue
        }
        // 開始更新
        switch (row.Status) {
          case 'New':
            await this.save('new', row)
            break
          case 'Modified':
            await this.save('edit', row)
            break
          case 'Deleted':
            await this.save('delete', row)
            break
          case '':
            break
        }
      }

      this.dialogShow = false
      this.preLoading()
    },
    save: async function (type, row) {
      switch (type) {
        case 'new':
          await this.$api.signOff.permissionNew({ form: row })
          break
        case 'edit':
          await this.$api.signOff.permissionEdit({ form: row })
          break
        case 'delete':
          await this.$api.signOff.permissionDelete({ form: row })
          break
        default:
          break
      }
    },
    // 新增子結構
    handleNew: function () {
      let newObj = JSON.parse(JSON.stringify(this.subItem))
      // find Maximum Seq
      let nextSeq = 1
      if (this.step.subList.length === 0) {
        nextSeq = 1
      } else {
        let amounts = this.step.subList.map(item => item.Seq)
        let highestSeq = Math.max(...amounts)
        nextSeq = highestSeq + 1
      }

      // 新增 item
      newObj.ParentSeq = this.step.Seq
      newObj.ID = ''
      newObj.GroupName = ''
      newObj.UserType = 0
      newObj.Seq = nextSeq.toString()
      newObj.Status = 'New'
      this.step.subList.push(newObj)
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.step.subListDeleted.push(row)
      this.step.subList.splice(index, 1)
    },
    // 切換 UserType
    ddlUserTypeChange: function (selected, row) {
      row.GroupName = ''
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 切換 ID
    ddlIDChange: function (selected, row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    }
  }
}
</script>
