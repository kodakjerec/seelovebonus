<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="anzaOrder" :rules="rules" label-width="10vw" label-position="right">
    <h2>{{$t('__anzaOrder')+'：'}}{{fromAnzaOrder.AnzaOrderID}}</h2>
      <!-- 安座人 -->
      <el-form-item :label="$t('__anzaCustomer')" prop="CustomerID">
        <el-select v-model="anzaOrder.CustomerID" filterable value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.CustomerID">
          <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 儲位 -->
      <el-form-item :label="$t('__anzaStorageID')" prop="StorageID" v-if="!disableForm.StorageID">
        <el-col :span="8">
          <el-select
            allow-create
            default-first-option
            filterable
            @visible-change="checkStorageID"
            v-model="anzaOrder.StorageID"
            :disabled="disableForm.StorageID"
            :placeholder="$t('__plzChoice')"
            style="display:block">
            <el-option v-for="item in ddlStorageID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        {{$t('__anzaOperateWarning')}}
      </el-form-item>
      <!-- 安座日期 -->
      <el-form-item :label="$t('__real') + $t('__anza') + $t('__date')" prop="RealDate" v-if="operateType==='anza'">
        <el-date-picker
          v-model="anzaOrder.RealDate"
          :placeholder="$t('__plzChoice')+$t('__date')"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <!-- 圓滿日期 -->
      <el-form-item :label="$t('__yuanman') + $t('__date')" prop="CompleteDate" v-if="operateType==='complete'">
        <el-date-picker
          v-model="anzaOrder.CompleteDate"
          :placeholder="$t('__plzChoice')+$t('__date')"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__ok')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate'

export default {
  name: 'operateAnza',
  props: {
    dialogShow: { type: Boolean, default: false },
    operateType: { type: String },
    fromAnzaOrder: { type: Object }
  },
  data () {
    // 驗證儲位正確性
    let validateStorageID = async (rule, value, callback) => {
      if (this.fromAnzaOrder.Status !== '1') {
        callback()
      }
      // 1.驗證可用性
      let checkValidate = null
      let object = {
        ProductID: this.fromAnzaOrder.ProductID,
        Purpose: '',
        Qty: 1,
        StorageID: this.anzaOrder.StorageID
      }
      checkValidate = await validate.validateStorageID(object.ProductID, object.Purpose, object.Qty, object.StorageID, callback)

      if (checkValidate !== '') {
        callback(checkValidate)
        return
      }

      callback()
    }
    return {
      anzaOrder: {
        type: '',
        AnzaOrderID: '',
        CustomerID: '',
        StorageID: '',
        RealDate: '',
        CompleteDate: ''
      },
      disableForm: {
        CustomerID: false,
        StorageID: false
      },
      rules: {
        StorageID: [{ required: true, trigger: 'blur', validator: validateStorageID }],
        RealDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        CompleteDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      myTitle: '',
      // 下拉是選單
      ddlCustomer: [],
      ddlStorageID: []
    }
  },
  mounted () {
    this.anzaOrder.type = this.operateType
    this.anzaOrder.AnzaOrderID = this.fromAnzaOrder.AnzaOrderID
    this.anzaOrder.CustomerID = this.fromAnzaOrder.CustomerID
    this.anzaOrder.StorageID = this.fromAnzaOrder.StorageID
    this.anzaOrder.RealDate = this.fromAnzaOrder.RealDate
    this.anzaOrder.CompleteDate = this.fromAnzaOrder.CompleteDate

    switch (this.operateType) {
      case 'modify':
        this.myTitle = this.$t('__edit') + this.$t('__anza')
        this.disableForm.StorageID = true
        break
      case 'anza':
        this.myTitle = this.$t('__anzaOperation')
        this.disableForm.CustomerID = true
        this.anzaOrder.RealDate = new Date()
        break
      case 'complete':
        this.myTitle = this.$t('__yuanman')
        this.disableForm.CustomerID = true
        this.disableForm.StorageID = true
        this.anzaOrder.CompleteDate = new Date()
        break
    }
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response2 = await this.$api.stock.findStorageID({
        ProductID: this.fromAnzaOrder.ProductID,
        Purpose: '',
        Qty: 1
      })
      this.ddlStorageID = response2.data.result

      let response4 = await this.$api.orders.getDropdownList({ type: 'customer' })
      this.ddlCustomer = response4.data.result
    },
    // 檢查輸入正確性
    checkStorageID: function (event) {
      // 強制轉為大寫
      this.anzaOrder.StorageID = this.anzaOrder.StorageID.toUpperCase()

      if (event === false) {
        this.$refs['form'].validate((valid) => {})
      }
    },
    checkValidate: function () {
      // 檢查主表單
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    save: async function () {
      let response2 = await this.$api.orders.anzaOperate({ form: this.anzaOrder })
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
