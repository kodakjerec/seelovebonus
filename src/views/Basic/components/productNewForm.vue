<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center :show-close="false" width="80%">
    <el-form ref="form" :model="form" :rules="rules" label-width="20%">
      <el-form-item :label="$t('__product')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__product')+$t('__name')" prop="Name">
          <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__accounting')+$t('__name')" prop="AccountingID">
        <el-select v-model="form.AccountingID" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlAccountingChange" >
          <el-option v-for="item in ddlAccounting" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__qty')">
          <el-input v-model="form.Qty" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__unit')" prop="Unit">
        <el-select v-model="form.Unit" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlUnit" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__price')">
          <el-input v-model="form.Price" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__cost')">
          <el-input v-model="form.Cost" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__bom')">
        <el-select v-model="form.BOM" value-key="value" :placeholder="$t('__plzChoice')" disabled>
          <el-option v-for="item in ddlBOM" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <bom ref="bom" v-if="dialogType!=='new'" :productID="form.ID" :productBOM="productBOM" @dialog-save="save()"></bom>
      <el-form-item v-else>{{$t('__productBOMWarrning')}}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import bom from './productBOM'
export default {
  name: 'ProductNewForm',
  components: {
    bom
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    product: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        Name: '',
        AccountingID: '',
        AccountingName: '',
        Qty: 1,
        Unit: 1,
        Price: 0,
        Cost: 0,
        BOM: 0
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        AccountingID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Unit: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false
      },
      myTitle: '',
      productBOM: [],
      // 以下為下拉式選單專用
      ddlAccounting: [],
      ddlUnit: [],
      ddlBOM: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__product')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__product')
        this.form = this.product
        this.disableForm.ID = true
        break
    }
    this.preloading()
  },
  methods: {
    // 讀取預設資料
    preloading: async function () {
      const response1 = await this.$api.basic.getDropdownList({ type: 'accounting' })
      this.ddlAccounting = response1.data.result
      const response2 = await this.$api.basic.getDropdownList({ type: 'unit' })
      this.ddlUnit = response2.data.result
      const response3 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlBOM = response3.data.result
      const responseBOM = await this.$api.basic.getObject({ type: 'productBOM', ID: this.form.ID })
      this.productBOM = responseBOM.data.result
    },
    // 切換費用代號, 填入名稱
    ddlAccountingChange: function (selected) {
      let findObject = this.ddlAccounting.find(item => { return item.ID === selected })
      this.form.AccountingName = findObject.Value
    },
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$refs['bom'].beforeSave()
          return true
        } else {
          return false
        }
      })
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 存檔
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.basic.productNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.productEdit({ form: this.form })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    }
  }
}
</script>
