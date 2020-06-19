<template>
  <el-dialog :title="myTitle" :visible.sync="dialogShow" center>
    <el-form :model="form" label-width="30%">
      <el-form-item :label="$t('__userId')" required>
        <el-input v-model="form.UserID" autocomplete="off" :disabled="disableForm.UserID"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__pwd')" required>
        <el-input v-model="form.Password" autocomplete="off" :disabled="disableForm.Password"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__groups')" required>
        <el-input v-model="form.GroupID" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__refEmployeeID')" required>
        <el-input v-model="form.refEmployeeID" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="progList">
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
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="save()">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UsersNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    user: {
      type: Object
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
      form: {
        UserID: '',
        Password: '',
        GroupID: '',
        refEmployeeID: ''
      },
      disableForm: {
        UserID: false,
        Password: false
      },
      myTitle: ''
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__users')
        this.disableForm.UserID = false
        this.disableForm.Password = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__users')
        this.form = this.user
        this.disableForm.UserID = true
        this.disableForm.Password = true
        break
    }
  },
  methods: {
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    save: function () {
      this.$emit('dialog-save')
    }
  }
}
</script>
