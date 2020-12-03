<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__product')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__product')+$t('__name')" prop="Name">
          <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__accounting')+$t('__name')" prop="AccountingID">
        <el-select v-model="form.AccountingID" filterable value-key="value" :placeholder="$t('__plzChoice')" @change="ddlAccountingChange" >
          <el-option v-for="item in ddlAccounting" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__qty')">
        <el-col :span="10">
          <el-input-number v-model.number="form.Qty" :min="0"></el-input-number>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__unit')" prop="Unit">
            <el-select v-model="form.Unit" value-key="value" :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlUnit" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__price')">
        <el-col :span="10">
          <el-input-number v-model.number="form.Price"></el-input-number>
          <span>{{$t('__dollar')}}</span>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__cost')">
            <el-input-number v-model.number="form.Cost"></el-input-number>
            <span>{{$t('__dollar')}}</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__itemCategory')">
        <el-col :span="8">
          <el-select v-model="form.Category1" filterable :placeholder="$t('__plzChoice')" @change="ddlCategory1Change" >
            <el-option v-for="item in ddlCategory1" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="form.Category2" filterable :placeholder="$t('__plzChoice')" @change="ddlCategory2Change" >
            <el-option v-for="item in ddlCategory2" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="form.Category3" filterable :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCategory3" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__status')">
        <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__bom')">
        <el-select v-model="form.BOM" value-key="value" :placeholder="$t('__plzChoice')" disabled>
          <el-option v-for="item in ddlBOM" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- BOM 子結構 -->
      <bom ref="bom" v-if="dialogType!=='new'" :productID="form.ID"></bom>
      <el-form-item v-else>{{$t('__productBOMWarrning')}}</el-form-item>
      <!-- 專案功能 -->
      <el-divider>{{$t('__product')+$t('__function')}}</el-divider>
      <template v-for="fun in switchProjectFunctions">
        {{fun.Value}}
        <el-switch v-model="fun.Available" :key="fun.Function" active-text="ON" inactive-text="OFF" :active-value="1" :inactive-value="0"></el-switch>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
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
    product: { type: Object },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        Name: '',
        AccountingID: '',
        AccountingName: '',
        Qty: 1,
        Unit: '1',
        Price: 0,
        Cost: 0,
        BOM: 0,
        Category1: null,
        Category2: null,
        Category3: null,
        Status: '1'
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
      isLoadingFinish: false, // 讀取完畢
      // 以下為下拉式選單專用
      ddlAccounting: [],
      ddlUnit: [],
      ddlBOM: [],
      ddlStatus: [],
      ddlCategory1: [],
      ddlCategory2Origin: [],
      ddlCategory2: [],
      ddlCategory3Origin: [],
      ddlCategory3: [],
      switchProjectFunctions: []
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__product')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__product')
        this.form = JSON.parse(JSON.stringify(this.product))
        this.disableForm.ID = true
        break
    }
    await this.preLoading()

    this.isLoadingFinish = true
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response1 = await this.$api.basic.getDropdownList({ type: 'accounting' })
      this.ddlAccounting = response1.data.result
      let response2 = await this.$api.basic.getDropdownList({ type: 'unit' })
      this.ddlUnit = response2.data.result
      let response3 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlBOM = response3.data.result
      let response4 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlStatus = response4.data.result

      let resItemCategory1 = await this.$api.basic.getDropdownList({ type: 'itemCategory1' })
      this.ddlCategory1 = resItemCategory1.data.result
      let resItemCategory2 = await this.$api.basic.getDropdownList({ type: 'itemCategory2' })
      this.ddlCategory2Origin = resItemCategory2.data.result
      let resItemCategory3 = await this.$api.basic.getDropdownList({ type: 'itemCategory3' })
      this.ddlCategory3Origin = resItemCategory3.data.result
      this.ddlCategory1Change()
      this.ddlCategory2Change()

      // 有用到的商品特殊功能
      let responseAvailableProjectFunctions = await this.$api.basic.getObject({ type: 'productFunctions', ID: this.form.ID })
      this.switchProjectFunctions = responseAvailableProjectFunctions.data.result
    },
    // 切換費用代號, 填入名稱
    ddlAccountingChange: function (selected) {
      let findObject = this.ddlAccounting.find(item => { return item.ID === selected })
      this.form.AccountingName = findObject.Value
    },
    // 檢查輸入
    checkValidate: function () {
      let tempThis = this
      this.$refs['form'].validate(async function (valid) {
        if (valid) {
          switch (tempThis.dialogType) {
            case 'new':
              tempThis.save()
              break
            case 'edit':
              let isSuccess = false

              isSuccess = await tempThis.$refs['bom'].beforeSave()

              if (isSuccess) {
                tempThis.save()
              }
              break
          }
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
          let responseNew = await this.$api.basic.productNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.productEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }

      // 商品特殊功能更新
      for (let index = 0; index < this.switchProjectFunctions.length; index++) {
        await this.$api.basic.productFunctionsUpdate({ form: this.switchProjectFunctions[index] })
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    },
    // 商品大類變更
    ddlCategory1Change: function () {
      this.ddlCategory2 = this.ddlCategory2Origin.filter(item => item.ParentID === this.form.Category1)
      if (this.isLoadingFinish) {
        this.form.Category2 = null
        this.form.Category3 = null
      }
    },
    // 商品中類變更
    ddlCategory2Change: function () {
      this.ddlCategory3 = this.ddlCategory3Origin.filter(item => item.ParentID === this.form.Category2)
      if (this.isLoadingFinish) {
        this.form.Category3 = null
      }
    }
  }
}
</script>
