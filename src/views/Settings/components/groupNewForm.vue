<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center :show-close="false">
    <el-form :model="form" label-width="30%">
      <el-form-item :label="$t('__groups')" required>
        <el-input v-model="form.GroupID" autocomplete="off" :disabled="disableForm.GroupID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__groupName')" required>
        <el-input v-model="form.Name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="progList" ref="multipleTable"  @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55"
      prop="checked">
      </el-table-column>
      <el-table-column
      prop="ProgID"
      label="ProgID">
    </el-table-column>
    <el-table-column
      prop="Name"
      label="Name">
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
      myTitle: ''
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
        this.form = this.group
        this.disableForm.GroupID = true
        break
    }

    // 已經有選擇的資料帶入
    const rowsToToggle = this.progList.filter(row => row.checked === true)
    this.$nextTick(() => { this.toggleSelection(rowsToToggle) })
  },
  methods: {
    toggleSelection: function (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange: function (val) {
      this.multipleTable = val
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.settings.groupNew({ GroupID: this.form.GroupID, Name: this.form.Name })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.settings.groupEdit({ GroupID: this.form.GroupID, Name: this.form.Name })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (isSuccess === false) {
        return
      }
      // 已經有最終的結果
      // console.log(this.multipleTable)
      // ProgList 比對 multipleTable
      // proglist.checked = true => 有找到 => 本來就有權限
      // proglist.checked = true => 沒找到 => 刪除現有權限 => Delete
      // proglist.checked = false=> 有找到 => 表示新增權限 => Insert
      // proglist.checked = false=> 沒找到 => 本來就沒有權限

      if (this.multipleTable !== undefined) {
        this.progList.forEach(value => {
          if (value.checked) {
            let findMultipleTable = this.multipleTable.find(item => { return value.ProgID === item.ProgID })
            if (findMultipleTable === undefined) {
              this.$api.settings.groupProgListDel({ GroupID: this.form.GroupID, ProgID: value.ProgID })
            }
          } else {
            let findMultipleTable = this.multipleTable.find(item => { return value.ProgID === item.ProgID })
            if (findMultipleTable) {
              this.$api.settings.groupProgListNew({ GroupID: this.form.GroupID, ProgID: value.ProgID })
            }
          }
        })
      }
      this.$emit('dialog-save')
    }
  }
}
</script>
