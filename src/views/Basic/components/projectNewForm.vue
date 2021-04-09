<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__project')+$t('__id')" prop="ID">
        <el-col :span="10">
          <el-input v-model="form.ID" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__projectOrderPrefix')" prop="Prefix">
            <el-input v-model="form.Prefix" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__project')+$t('__name')" prop="Name">
          <el-input v-model="form.Name" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__startDate')" prop="StartDate">
        <el-col :span="10">
          <el-form-item prop="StartDate">
            <el-date-picker
              v-model="form.StartDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__startDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__endDate')" prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__price')">
          <span>{{formatterMoneyUS(null,null,form.Price,null)+$t('__dollar')}}</span>
      </el-form-item>
      <el-form-item :label="$t('__pv')">
          <el-input-number v-model.number="form.PV" :precision="2" :min="0"></el-input-number>
          <span>{{$t('__100PercentInput100')}}</span>
      </el-form-item>
      <el-form-item v-if="dialogType==='new'">{{$t('__projectDetailWarning')}}</el-form-item>
      <!-- 專案明細 -->
      <template v-else>
        <el-divider>{{$t('__project')+$t('__detail')}}</el-divider>
        <project-detail
          ref="projectDetail"
          :projectID="form.ID"
          @reCalculateDetail="reCalculateDetail">
        </project-detail>
        <!-- 專案功能 -->
        <el-divider>{{$t('__project')+$t('__function')}}</el-divider>
        <template v-for="fun in switchProjectFunctions">
          <div :key="fun.Function">
            {{fun.Value}}
            <el-switch v-model="fun.Available" active-text="ON" inactive-text="OFF" :active-value="1" :inactive-value="0" @change="(value)=>switchChange(value, fun)"></el-switch>
          </div>
        </template>
        <!-- 安座單功能 -->
        <template v-if="projectFunctionForAnza && projectFunctionForAnza.Available === 1">
          <el-divider>{{$t('__anzaOrder')+$t('__function')}}</el-divider>
          <el-form-item>
          <el-col :span="4"><span>{{$t('__new')}}</span><el-switch v-model="projectFunctionForAnza.Extend.new" active-text="ON" inactive-text="OFF" :active-value="1" :inactive-value="0"></el-switch></el-col>
          <el-col :span="4"><span>{{$t('__anzaTransfer')}}</span><el-switch v-model="projectFunctionForAnza.Extend.transfer" active-text="ON" inactive-text="OFF" :active-value="1" :inactive-value="0"></el-switch></el-col>
          <el-col :span="4"><span>{{$t('__anzaExtend')}}</span><el-switch v-model="projectFunctionForAnza.Extend.extend" active-text="ON" inactive-text="OFF" :active-value="1" :inactive-value="0"></el-switch></el-col>
          <el-col :span="4"><span>{{$t('__anzaRenew')}}</span><el-switch v-model="projectFunctionForAnza.Extend.renew" active-text="ON" inactive-text="OFF" :active-value="1" :inactive-value="0"></el-switch></el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="8"><span>Year</span><el-input v-model="projectFunctionForAnza.Extend.year" style="width:50px"></el-input></el-col>
            <el-col :span="8"><span>{{$t('__after')+$t('__project')}}</span><el-input v-model="projectFunctionForAnza.Extend.nextProjectID" style="width:100px"></el-input></el-col>
          </el-form-item>
          <el-divider>{{$t('__anzaOrder')+$t('__detail')}}</el-divider>
          <project-anza-order-detail
            ref="projectAnzaOrderDetail"
            v-if="buttonsShowUser.new"
            :projectID="form.ID">
          </project-anza-order-detail>
        </template>
        <!-- 分期付款 -->
        <el-divider>{{$t('__installment')}}</el-divider>
        <project-installment-detail
          v-if="buttonsShowUser.new"
          :projectID="form.ID">
        </project-installment-detail>
      </template>
    </el-form>
    <div slot="footer">
      <el-button v-show="dialogType === 'edit' &&  buttonsShowUser.delete" type="danger" @click="deleteItem">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatMoney } from '@/setup/format.js'
import validate from '@/setup/validate.js'
import projectDetail from './projectDetail'
import projectInstallmentDetail from './projectInstallmentDetail'
import projectAnzaOrderDetail from './projectAnzaOrderDetail'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'ProjectNewForm',
  components: {
    projectDetail,
    projectInstallmentDetail,
    projectAnzaOrderDetail
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    project: { type: Object },
    buttonsShowUser: { type: Object }
  },
  data () {
    let myValidate = async (rule, value, callback) => {
      // 新增時才檢驗
      if (this.dialogType !== 'new') {
        callback()
        return
      }

      // 強制轉為大寫
      this.form.ID = this.form.ID.toUpperCase()

      // 1.驗證可用性
      let checkValidate = await validate.validateProjectID(rule, value, callback)
      if (checkValidate !== '') {
        callback(checkValidate)
        return
      }

      callback()
    }
    return {
      form: {
        ID: '',
        Name: '',
        StartDate: '',
        EndDate: '',
        Price: 0,
        PV: 100,
        Prefix: ''
      },
      rules: {
        ID: [{ required: true, trigger: 'blur', validator: myValidate }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Prefix: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false
      },
      myTitle: '',
      projectFunctionForAnza: {}, // 安座單專用設定
      // 下拉式選單
      switchProjectFunctions: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__project')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__project')
        this.disableForm.ID = true
        this.disableForm.Prefix = true

        this.form = JSON.parse(JSON.stringify(this.project))
        break
    }
    this.preLoading()
  },
  methods: {
    formatterMoneyUS: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // 讀取預設資料
    preLoading: async function () {
      // 有用到的專案功能
      let responseAvailableProjectFunctions = await this.$api.basic.getObject({ type: 'projectFunctions', keyword: this.form.ID })
      this.switchProjectFunctions = responseAvailableProjectFunctions.data.result

      this.switchProjectFunctions.forEach(item => {
        if (item.Extend) { item.Extend = JSON.parse(item.Extend) }

        // 安座單設定拉出來
        if (item.Function === 'newAnzaOrder') {
          this.projectFunctionForAnza = item // 修改獨立出去的projectFunctionForAnza, 也可以回寫projectFunction
        }
      })
    },
    // 專案功能切換
    switchChange: function (value, fun) {
      if (fun.Function === 'newAnzaOrder' && value === 1) {
        fun.Extend = {
          new: 0,
          transfer: 0,
          extend: 0,
          renew: 0,
          year: 1,
          nextProjectID: ''
        }
      }
    },
    // 檢查輸入
    checkValidate: async function () {
      if (this.dialogType !== 'new') {
        // check BOM
        let isSuccess = false
        isSuccess = await this.$refs['projectDetail'].beforeSave()
        if (!isSuccess) { return }
        isSuccess = false
        isSuccess = await this.$refs['projectAnzaOrderDetail'].beforeSave()
        if (!isSuccess) { return }
      }

      // 強制轉為大寫
      this.form.Prefix = this.form.Prefix.toUpperCase()

      // 安座單設定寫回
      this.switchProjectFunctions.forEach(item => {
        if (item.Extend) { item.Extend = JSON.stringify(item.Extend) }
      })

      // 檢查主表單
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save(this.dialogType)
        }
      })
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 刪除
    deleteItem: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__project') + ' ' + this.form.ID, this.$t('__delete'))

      switch (answerAction) {
        case 'confirm':
          let isSuccessEdit = await this.save('delete')
          if (isSuccessEdit) {
            this.$alert(this.updateMessage, 200, {
              callback: () => {
                this.$router.push({
                  name: this.parent,
                  params: {
                    returnType: 'save'
                  }
                })
              }
            })
          }
          break
        case 'cancel':
          break
        case 'close':
          break
      }
    },
    // 存檔
    save: async function (type) {
      let isSuccess = false
      switch (type) {
        case 'new':
          let responseNew = await this.$api.basic.projectNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true

            // 更新專案功能代號
            this.switchProjectFunctions.forEach(item => {
              item.ProjectID = this.form.ID
            })
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.projectEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.projectDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          } else {
            isSuccess = false
          }
          break
      }

      // 專案功能更新
      for (let index = 0; index < this.switchProjectFunctions.length; index++) {
        await this.$api.basic.projectFunctionsUpdate({ form: this.switchProjectFunctions[index] })
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    },
    // 子->父: 統計商品明細總價
    reCalculateDetail: function (object) {
      const { masterAmount } = object
      this.form.Price = masterAmount
    }
  }
}
</script>
