<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="save">
    <el-divider>{{$t('__product')}}</el-divider>
    <el-form label-width="10vw" label-position="right">
       <el-form-item :label="$t('__product')">
        <el-select
          default-first-option filterable clearable
          v-model="searchContent.ProductID"
          :placeholder="$t('__plzChoice')"
          style="display:block">
          <el-option-group v-for="group in ddlSubList" :key="group.Category1Name" :label="group.Category1Name">
            <el-option v-for="item in group.options" :key="item.ProductID" :label="item.ProductID+' '+item.ProductName" :value="item.ProductID">
              <!-- 商品明細特別加上價格 -->
              <span style="float: left">{{ item.ProductName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ProductID }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <slot name="body"></slot>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'stockNowSearchContent',
  props: {
    dialogShow: { type: Boolean, default: false },
    fromContent: { type: Object }
  },
  data () {
    return {
      searchContent: {},
      myTitle: '條件篩選',
      // 下拉式選單
      originDDLSubList: [],
      ddlSubList: []
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
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.orders.getDropdownList({ type: 'productsForOrderDetail' })
      this.originDDLSubList = response.data.result

      // 做select group 處理
      // 找出主key
      this.originDDLSubList.forEach(item => {
        let findObject = this.ddlSubList.find(item2 => { return item2.Category1Name === item.Category1Name })
        if (findObject === undefined) {
          this.ddlSubList.push(item)
        }
      })
      // group 分組選項
      this.ddlSubList.forEach(item => {
        item.options = this.originDDLSubList.filter(item2 => item2.Category1Name === item.Category1Name)
      })
    },
    save: function () {
      this.$emit('dialog-save', this.searchContent)
    }
  }
}
</script>
