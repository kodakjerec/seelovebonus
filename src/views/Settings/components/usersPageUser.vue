<template>
  <div>
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
        prop="refEmployeeID"
        :label="$t('__refEmployeeID')">
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
    :user="user"
    :prog-list="progList"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './usersNewForm'
export default {
  name: 'UsersPageUser',
  components: {
    newForm
  },
  props: {
    users: {
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
      user: {}
    }
  },
  methods: {
    handleClick: async function (row, column, event) {
      const response = await this.$api.settings.getUserProg({ UserID: row.UserID })
      this.userProg = response.data.userProg
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
    }
  }
}
</script>
