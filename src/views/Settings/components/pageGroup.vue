<template>
  <div>
    <el-table
      :data="groups"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="GroupID"
        :label="$t('__groups')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__groupName')">
      </el-table-column>
    </el-table>
    <br/>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :group="group"
    :prog-list="progList"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './groupNewForm'
export default {
  name: 'PageUser',
  components: {
    newForm
  },
  props: {
    groups: {
      type: Array,
      default: function () {
        return []
      }
    },
    progList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      group: {},
      checkedProgList: []
    }
  },
  methods: {
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      const response = await this.$api.settings.getGroupProg({ GroupID: row.GroupID })
      this.userProg = response.data.userProg

      // 篩選出有用的選單
      this.progList.forEach(value => {
        let findResult = this.userProg.find(value2 => { return value2.ProgID === value.ProgID })
        if (findResult) {
          value.checked = true
        } else {
          value.checked = false
        }
        this.checkedProgList.push(value)
      })

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.group = row
    },
    // 開啟表單
    showForm: function (eventType) {
      // 篩選出有用的選單
      this.progList.forEach(value => {
        value.checked = false
        this.checkedProgList.push(value)
      })

      // 進入新增
      this.dialogType = eventType
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.$emit('refresh')
    }
  }
}
</script>
