<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="save">
    <el-divider>{{$t('__orderID')+$t('__prefix')}}</el-divider>
    <el-checkbox-group v-model="searchContent.selectedOrdersType">
      <el-checkbox v-for="item in searchContent.OrdersType"
        :key="item.Prefix"
        :label="item.Prefix">{{item.Prefix+'('+item.Qty+')'}}</el-checkbox>
    </el-checkbox-group>
    <el-divider>{{$t('__status')}}</el-divider>
    <el-checkbox-group v-model="searchContent.selectedStatusType">
      <el-checkbox v-for="item in searchContent.StatusType"
        :key="item.Status"
        :label="item.Status">{{item.Name+'('+item.Qty+')'}}</el-checkbox>
    </el-checkbox-group>
    <el-divider>{{$t('__date')}}</el-divider>
    <el-form label-width="10vw" label-position="right">
      <el-form-item :label="$t('__startDate')">
        <el-col :span="12">
          <el-date-picker
            v-model="searchContent.StartDate"
            type="date"
            :placeholder="$t('__plzChoice')+$t('__startDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__endDate')">
            <el-date-picker
              v-model="searchContent.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <slot name="body"></slot>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'OrdersSearchContent',
  props: {
    dialogShow: { type: Boolean, default: false },
    fromContent: { type: Object }
  },
  data () {
    return {
      searchContent: {},
      myTitle: '條件篩選'
    }
  },
  watch: {
    fromContent: {
      handler (newValue) {
        this.searchContent = newValue
      },
      deep: true
    }
  },
  methods: {
    save: function () {
      this.$emit('dialog-save', this.searchContent)
    }
  }
}
</script>
