<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="invoiceForm" :model="form" :rules="rules">
      <el-form-item :label="$t('__order')+$t('__id')" label-width="100px" label-position="left">
          <el-input v-model="form.OrderID" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__kind')" prop="InvoiceKind" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-select v-model="form.InvoiceKind" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlInvoiceKind" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__invoice')+$t('__status')}}
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlInvoiceStatus" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__date')" prop="InvoiceDate" label-width="100px" label-position="left">
        <el-date-picker
          v-model="form.InvoiceDate"
          type="date"
          :placeholder="$t('__plzChoice')+$t('__invoice')+$t('__date')"
          format="yyyy - MM - dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__id')" prop="InvoiceID" label-width="100px" label-position="left">
        <el-col :span="10">
          <el-input v-model="form.InvoiceID" autocomplete="off"></el-input>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__randomCode')}}
        </el-col>
        <el-col :span="10">
          <el-form-item prop="RandomCode">
          <el-input v-model="form.RandomCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__title')" label-width="100px" label-position="left">
          <el-input v-model="form.Title" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__uniformNumber')" label-width="100px" label-position="left">
          <el-input v-model="form.UniformNumber" autocomplete="off" maxlength="8" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__carrierNumber')" label-width="100px" label-position="left">
          <el-input v-model="form.CarrierNumber" autocomplete="off" maxlength="64" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__received')+$t('__operator')" prop="CreateID" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-select v-model="form.CreateID" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__tax')+$t('__status')}}
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.Tax" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlTax" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__memo')" label-width="100px" label-position="left">
          <el-input v-model="form.Memo" autocomplete="off" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-divider>{{$t('__invoice')+$t('__detail')}}</el-divider>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <br/>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'

export default {
  name: 'Invoice',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    invoiceHead: { type: Object },
    ddlCreateID: { type: Array }
  },
  data () {
    return {
      form: {
        InvoiceID: null,
        InvoiceDate: null,
        OrderID: null,
        Title: null,
        UniformNumber: null,
        Amount: null,
        ReceivedDate: null,
        InvoiceKind: '6',
        Tax: '1',
        CarrierNumber: null,
        Memo: null,
        InvoiceIDFirst: null,
        RandomCode: null,
        CreateID: null,
        Status: '2',
        SalesReturnDate: null
      },
      rules: {
        InvoiceKind: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        InvoiceDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        InvoiceID: [{ trigger: 'blur', validator: validate.validateInvoiceID }],
        RandomCode: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        CreateID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      myTitle: '',
      // 以下為下拉式選單專用
      ddlInvoiceKind: [],
      ddlInvoiceStatus: [],
      ddlTax: []
    }
  },
  mounted () {
    this.form = Object.assign({}, this.invoiceHead)

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__invoice')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__invoice')
        break
    }

    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      const response1 = await this.$api.orders.getDropdownList({ type: 'invoiceKind' })
      this.ddlInvoiceKind = response1.data.result
      const response2 = await this.$api.orders.getDropdownList({ type: 'invoiceStatus' })
      this.ddlInvoiceStatus = response2.data.result
      const response3 = await this.$api.orders.getDropdownList({ type: 'tax' })
      this.ddlTax = response3.data.result
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      await this.$refs['invoiceForm'].validate((valid) => {
        isSuccess = valid
      })

      if (isSuccess) {
        isSuccess = await this.save()
      }

      if (isSuccess) {
        this.$alert(this.$t('__uploadSuccess'), 200)
        this.$emit('dialog-save')
      }
    },
    // 存檔
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.orders.invoiceHeadNew({ form: this.form })
          if (responseNew.status === 200) {
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.invoiceHeadEdit({ form: this.form })
          if (responseEdit.status === 200) {
            isSuccess = true
          }
          break
      }

      return isSuccess
    }
  }
}
</script>
