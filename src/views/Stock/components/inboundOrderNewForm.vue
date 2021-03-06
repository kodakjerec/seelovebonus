<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
        <el-col :span="2" v-if="dialogType === 'new'">
          {{form.Prefix}}
        </el-col>
        <el-col :span="4">
          <el-input v-model="form.ID" :placeholder="$t('__afterSaveWillShow')" disabled></el-input>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('__status')">
            <el-select v-model="form.Status" default-first-option filterable clearable disabled>
              <el-option v-for="item in ddlOrderStatus" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__order')+$t('__date')+'：'" prop="OrderDate">
            <el-date-picker
              v-model="form.OrderDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__order')+$t('__date')"
              value-format="yyyy-MM-dd"
              :disabled="disableForm.OrderDate">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 總金額 -->
      <el-form-item :label="$t('__total') + $t('__amount')">
        {{formatterMoney(null,null,form.Amount,null)}}
      </el-form-item>
      <!-- 供應商 -->
      <el-form-item :label="$t('__supplier')" prop="Supplier">
        <el-select v-model="form.Supplier" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.OrderDate">
          <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 備註 -->
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" type="textarea" rows="2" maxlength="100" show-word-limit
            :disabled="disableForm.OrderDate"></el-input>
      </el-form-item>
    </el-form>
    <!-- 明細 -->
    <inbound-order-detail
      ref="inboundOrderDetail"
      v-if="form.OrderDate"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :orderID="form.ID"
      :fromOrderStatus="form.Status"
      @reCalculateDetail="reCalculateDetail"></inbound-order-detail>
    <div slot="footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="deleteItem">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
import { formatMoney, formatDate } from '@/setup/format.js'
import { messageBoxYesNo } from '@/services/utils'
import inboundOrderDetail from './inboundOrderDetail'

export default {
  name: 'InboundOrderNewForm',
  components: {
    inboundOrderDetail
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    inboundOrder: { type: Object },
    parent: { type: String, default: 'InboundOrder' },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        OrderDate: '',
        Status: '1',
        CreateID: this.$store.state.userID,
        Amount: 0,
        Memo: '',
        Prefix: 'IB',
        Supplier: ''
      },
      batchInsert: false, // 開啟批次新增
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Supplier: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        OrderDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
      disableForm: {
        OrderDate: false
      },
      myTitle: '',
      // 以下為下拉式選單專用
      ddlOrderStatus: [],
      ddlCompanies: []
    }
  },
  mounted () {
    // 不是從上層選單進入, 而是其他不允許路徑
    if (this.inboundOrder === undefined) {
      this.cancel()
      return
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__inboundOrder')
        let tempDate = new Date()
        this.form.OrderDate = formatDate(tempDate.toISOString().slice(0, 10))
        this.buttonsShow = {
          new: 1,
          edit: 0,
          save: 1,
          delete: 0,
          search: 1
        }
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__inboundOrder')
        this.form = JSON.parse(JSON.stringify(this.inboundOrder))

        // 帶入原始單據狀態, 開啟或關閉
        switch (this.form.Status) {
          case '0':
          case '4':
            // 是否允許修改
            this.disableForm.OrderDate = true

            this.buttonsShow = {
              new: 0,
              edit: 0,
              save: 0,
              delete: 0,
              search: 0
            }
            break
          case '1':
            this.buttonsShow = {
              new: 1,
              edit: 1,
              save: 1,
              delete: 1,
              search: 1
            }
            break
          case '2':
          case '3':
            this.buttonsShow = {
              new: 0,
              edit: 0,
              save: 1,
              delete: 0,
              search: 1
            }
            break
        }
        break
    }
    this.preLoading()
  },
  methods: {
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    formatterMoneyUS: function (row, column, cellValue, index) {
      return formatMoney(cellValue, 'US')
    },
    // 讀取預設資料
    preLoading: async function () {
      let response3 = await this.$api.basic.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response3.data.result
      let response = this.$api.local.getDropdownList({ type: 'InboundStatus' })
      this.ddlOrderStatus = response
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      await this.$refs['form'].validate((valid) => { isSuccess = valid })
      if (!isSuccess) { return }

      // 檢查明細資訊
      isSuccess = await this.$refs['inboundOrderDetail'].checkValidate()
      if (!isSuccess) { return }

      if (isSuccess) {
        this.beforeSave()
      }
    },
    // 存檔前準備
    beforeSave: async function () {
      let isSuccess = false
      let saveStep = 'order'
      saveStep = 'order'

      isSuccess = await this.save(this.dialogType)
      if (isSuccess) {
        saveStep = 'orderDetail'
        isSuccess = await this.$refs['inboundOrderDetail'].beforeSave()
      }

      if (isSuccess) {
        this.$alert(this.updateMessage, 200, {
          callback: () => {
            this.$router.replace({
              name: this.parent,
              params: {
                returnType: 'save'
              }
            })
          }
        })
      } else {
        this.$alert(this.$t('__uploadFail') + ' Step: ' + saveStep)
      }
    },
    // 取消
    cancel: function () {
      this.$router.push({
        name: this.parent,
        params: {
          returnType: 'cancel'
        }
      })
    },
    // 刪除
    deleteItem: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__inboundOrder'), this.$t('__delete'))

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
        case 'edit':
          let responseUpdate = await this.$api.stock.inboundOrderUpdate({ form: this.form })
          if (responseUpdate.headers['code'] === '200') {
            isSuccess = true
            this.form.ID = responseUpdate.data.result[0].ID
            this.updateMessage = responseUpdate.data.result[0].message
          }
          break
        case 'delete':
          let responseDelete = await this.$api.stock.inboundOrderDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseDelete.data.result[0].message
          }
          break
      }

      return isSuccess
    },
    // 子->父: 統計商品明細總價
    reCalculateDetail: function (object) {
      const { masterAmount } = object
      this.form.Amount = masterAmount
    }
  }
}
</script>
