<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <p/>
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
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :group="group"
    :progList="checkedProgList"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './groupNewForm'
export default {
  name: 'PageGroup',
  components: {
    newForm
  },
  props: {
    groups: {
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
      const response = await this.$api.settings.getObject({ type: 'group', ID: row.GroupID })
      this.checkedProgList = response.data.result

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.group = row
    },
    // 開啟表單
    showForm: async function (eventType) {
      // 取得可以用的選單
      const response = await this.$api.settings.getObject({ type: 'group', ID: '' })
      this.checkedProgList = response.data.result

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
