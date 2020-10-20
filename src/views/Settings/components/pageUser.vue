<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <p/>
    <el-table
      :data="users"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="UserID"
        :label="$t('__users')">
      </el-table-column>
      <el-table-column
        prop="GroupID"
        :label="$t('__groups')">
      </el-table-column>
      <el-table-column
        prop="refEmployeeIDName"
        :label="$t('__refEmployeeIDForUser')">
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :user="user"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './userNewForm'
export default {
  name: 'PageUser',
  components: {
    newForm
  },
  props: {
    users: {
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
      user: {}
    }
  },
  methods: {
    handleClick: async function (row, column, event) {
      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.user = row
    },
    // 開啟表單
    showForm: function (eventType) {
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
