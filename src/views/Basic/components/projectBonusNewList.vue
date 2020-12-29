<template>
  <el-dialog :visible="dialogShow" center @close="cancel" append-to-body>
    <el-select v-model="projectID" :placeholder="$t('__plzChoice')" style="display:block">
      <el-option v-for="item in ddlPBList" :key="item.ID" :label="item.Value" :value="item.ID">
        <span style="float: left">{{ item.Value }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
      </el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="save">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProjectBonusNewList',
  props: {
    dialogShow: { type: Boolean, default: false }
  },
  data () {
    return {
      projectID: '',
      ddlPBList: []
    }
  },
  async mounted () {
    let response2 = await this.$api.basic.getDropdownList({ type: 'projectListForPPBNew' })
    this.ddlPBList = response2.data.result
  },
  methods: {
    save: function () {
      let value = this.ddlPBList.find(row => { return row.ID === this.projectID })
      this.$emit('dialog-save', value)
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    }
  }
}
</script>
