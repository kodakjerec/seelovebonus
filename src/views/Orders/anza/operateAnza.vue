<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form label-width="10vw" label-position="right">
    <h2>{{$t('__anzaOrder')+'：'}}{{anzaOrder.AnzaOrderID}}</h2>
      <el-form-item :label="$t('__storageAddress')">
        <el-select
          filterable
          v-model="anzaOrder.StorageID"
          :disabled="disableForm.StorageID"
          :placeholder="$t('__plzChoice')"
          style="display:block">
          <el-option v-for="item in ddlStorageID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__real') + $t('__anza') + $t('__date')" v-if="anzaOrder.type==='anza'">
        <el-date-picker
          v-model="anzaOrder.RealDate"
          :placeholder="$t('__plzChoice')+$t('__date')"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('__yuanman') + $t('__date')" v-if="anzaOrder.type==='complete'">
        <el-date-picker
          v-model="anzaOrder.CompleteDate"
          :placeholder="$t('__plzChoice')+$t('__date')"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="save">{{$t('__ok')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'operateAnza',
  props: {
    dialogShow: { type: Boolean, default: false },
    operateType: { type: String },
    fromAnzaOrder: { type: Object }
  },
  data () {
    return {
      anzaOrder: {
        type: this.operateType,
        OrderID: '',
        AnzaOrderID: '',
        StorageID: '',
        RealDate: '',
        CompleteDate: ''
      },
      disableForm: {
        StorageID: false
      },
      myTitle: '',
      // 下拉是選單
      ddlStorageID: []
    }
  },
  watch: {
    operateType: function (newValue) {
      this.anzaOrder.type = newValue
      switch (this.anzaOrder.type) {
        case 'anza':
          this.myTitle = this.$t('__anzaOperation')
          break
        case 'complete':
          this.disableForm.StorageID = true
          this.myTitle = this.$t('__yuanman')
          break
      }
    },
    fromAnzaOrder: function (newValue) {
      if (newValue) {
        this.anzaOrder.OrderID = newValue.OrderID
        this.anzaOrder.AnzaOrderID = newValue.AnzaOrderID
        this.anzaOrder.StorageID = newValue.StorageID
        this.anzaOrder.RealDate = new Date()
        this.anzaOrder.CompleteDate = new Date()
      }
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response2 = await this.$api.stock.getDropdownList({ type: 'storageAddressForAnza' })
      this.ddlStorageID = response2.data.result
    },
    save: async function () {
      let response2 = await this.$api.orders.anzaOperate({ keyword: JSON.stringify(this.anzaOrder) })
      if (response2.headers['code'] === '200') {
        this.$message({
          message: response2.data.result[0].message,
          type: 'success'
        })
      }
      this.$emit('dialog-save')
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    }
  }
}
</script>
