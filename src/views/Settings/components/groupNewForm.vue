<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form :model="form" label-width="10vw">
      <el-form-item :label="$t('__groups')" required>
        <el-input v-model="form.GroupID" autocomplete="off" :disabled="disableForm.GroupID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__groupName')" required>
        <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="editableProgList"
      stripe
      border
      ref="finalResult"
      @cell-mouse-enter="handleCellMouseEnter"
      @selection-change="handleSelectChange">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
        prop="ProgID"
        label="ProgID">
      </el-table-column>
      <el-table-column
        prop="Name"
        label="Name">
      </el-table-column>
      <el-table-column :label="$t('__new')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun1" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('__edit')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun2" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('__delete')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun3" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun4">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun4" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun5">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun5" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun6">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun6" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun7">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun7" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun8">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun8" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun9">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun9" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="fun10">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.fun10" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="save">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'GroupNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    group: { type: Object },
    progList: { type: Array }
  },
  data () {
    return {
      form: {
        GroupID: '',
        Name: ''
      },
      disableForm: {
        GroupID: false
      },
      myTitle: '',
      editableProgList: [], // 顯示functions使用
      tempRow: {} // 暫存, 目前指到哪一條row
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__groups')
        this.disableForm.GroupID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__groups')
        this.form = JSON.parse(JSON.stringify(this.group))
        this.disableForm.GroupID = true
        break
    }

    // 功能清單
    this.editableProgList = JSON.parse(JSON.stringify(this.progList))

    // 已經有選擇的資料帶入
    let rowsToToggle = this.editableProgList.filter(row => row.checked === 1)
    this.$nextTick(() => { this.toggleSelection(rowsToToggle) })
  },
  methods: {
    // 選中欄位
    toggleSelection: function (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.finalResult.toggleRowSelection(row)
        })
      } else {
        this.$refs.finalResult.clearSelection()
      }
    },
    // 第一行的checkbox, 選中代表功能開放, event:select-change
    handleSelectChange: function (selection) {
      this.finalResult = selection
      if (this.tempRow !== undefined) {
        if (this.tempRow.checked === 1) {
          this.tempRow.checked = 0
        } else {
          this.tempRow.checked = 1
        }
        this.changeAllFunctionValue()
      }
    },
    // event: cell-mouse-enter
    // 改變方式截取 checkbox 的狀態
    // 先記錄現在指定的row => 如果有selectChange => 就是有點checkbox => 修改欄位
    handleCellMouseEnter: function (row, column, cell, event) {
      if (column.colSpan === 1) {
        this.tempRow = row
      }
    },
    changeAllFunctionValue: function () {
      let finalValue = this.tempRow.checked
      for (let key in this.tempRow) {
        if (key.indexOf('fun') >= 0) {
          this.tempRow[key] = finalValue
        }
      }
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          let responseNew = await this.$api.settings.groupNew({ GroupID: this.form.GroupID, Name: this.form.Name })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.settings.groupEdit({ GroupID: this.form.GroupID, Name: this.form.Name })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (!isSuccess) { return isSuccess }
      // 已經有最終的結果
      // console.log(this.finalResult)
      // ProgList 比對 finalResult
      // checked = 1 => finalResult.checked = 1 => 本來就有權限
      //                                                  fun欄位有異動 => Update
      // checked = 1 => finalResult.checked = undefined => 刪除現有權限 => Delete
      // checked = 0 => finalResult.checked = 1         => 表示新增權限 => Insert
      // checked = 0 => finalResult.checked = undefined => 本來就沒有權限

      this.progList.forEach(prog => {
        let findResult = this.finalResult.find(item => { return prog.ProgID === item.ProgID })

        if (prog.checked === 1) {
          if (findResult && findResult.checked === 1) {
            let isNeedUpdate = false

            for (var key in findResult) {
              if (isNeedUpdate === false && key.indexOf('fun') >= 0) {
                if (findResult[key] !== prog[key]) {
                  isNeedUpdate = true
                }
              }
            }
            if (isNeedUpdate) {
              this.$api.settings.groupProgListEdit({ GroupID: this.form.GroupID, Row: findResult })
            }
          } else {
            this.$api.settings.groupProgListDel({ GroupID: this.form.GroupID, Row: prog })
          }
        } else if (prog.checked === 0) {
          if (findResult && findResult.checked === 1) {
            this.$api.settings.groupProgListNew({ GroupID: this.form.GroupID, Row: findResult })
          } else {
            // 本來就沒有權限
          }
        }
      })

      this.$emit('dialog-save')
    }
  }
}
</script>
