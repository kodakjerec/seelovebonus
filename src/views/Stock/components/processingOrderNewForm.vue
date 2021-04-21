<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
        <el-col :span="2" v-if="dialogType === 'new'">
          {{form.Prefix}}
        </el-col>
        <el-col :span="4">
          <el-input v-model="form.ID" :placeholder="$t('__afterSaveWillShow')" :disabled="disableForm.ID"></el-input>
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
          <el-form-item :label="$t('__processing')+$t('__date')+'：'" prop="OrderDate">
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
      <!-- 選定BOM商品 -->
      <el-form-item
        v-if="buttonsShow.new && buttonsShowUser.new"
        :label="$t('__storagePurpose')">
        <el-col :span="2">
          <el-form-item>
            <el-input
              v-model="ProcessingItem.Purpose">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__processing')+$t('__product')">
            <el-select
              default-first-option filterable clearable
              v-model="ProcessingItem.ProductID"
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
        </el-col>
        <el-col :span="4">
          <el-form-item :label="$t('__set')">
            <el-input-number
              :min="1"
              v-model="ProcessingItem.Set">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 備註 -->
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" type="textarea" rows="2" maxlength="100" show-word-limit
            :disabled="disableForm.OrderDate"></el-input>
      </el-form-item>
    </el-form>
    <!-- 明細 -->
    <processing-order-detail
      ref="processingOrderDetail"
      v-if="form.OrderDate"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :orderID="form.ID"
      :fromOrderStatus="form.Status"
      :fromProductID="ProcessingItem.ProductID"
      :fromPurpose="ProcessingItem.Purpose"
      :fromSet="ProcessingItem.Set"
      @bringProcessingItem="bringProcessingItem"></processing-order-detail>
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
import processingOrderDetail from './processingOrderDetail'

export default {
  name: 'ProcessingOrderNewForm',
  components: {
    processingOrderDetail
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    processingOrder: { type: Object },
    parent: { type: String, default: 'ProcessingOrder' },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        OrderDate: '',
        Status: '1',
        CreateID: this.$store.state.userID,
        Memo: '',
        Prefix: 'PR'
      },
      ProcessingItem: {
        Purpose: '',
        ProductID: '',
        Set: 1
      },
      batchInsert: false, // 開啟批次新增
      rules: {
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
        ID: false,
        OrderDate: false
      },
      myTitle: '',
      // 以下為下拉式選單專用
      originDDLSubList: [],
      ddlSubList: [],
      ddlOrderStatus: []
    }
  },
  mounted () {
    // 不是從上層選單進入, 而是其他不允許路徑
    if (this.processingOrder === undefined) {
      this.cancel()
      return
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__processingOrder')
        this.disableForm.ID = true
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
        this.myTitle = this.$t('__edit') + this.$t('__processingOrder')
        this.form = JSON.parse(JSON.stringify(this.processingOrder))

        // 帶入原始單據狀態, 開啟或關閉
        switch (this.form.Status) {
          case '0':
          case '4':
            // 是否允許修改
            this.disableForm.ID = true
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
    // 子=>父: 帶入明細主要商品
    bringProcessingItem: function (fromItem) {
      let { Purpose, ProductID, Set } = fromItem
      this.ProcessingItem.Purpose = Purpose
      this.ProcessingItem.ProductID = ProductID
      this.ProcessingItem.Set = Set
    },
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.orders.getDropdownList({ type: 'productsForOrderDetail' })
      this.originDDLSubList = response.data.result
      // 只要扣庫存 & BOM表結構
      this.originDDLSubList = this.originDDLSubList.filter(item => item.Inventory === 1 && item.BOM === '1')

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

      response = this.$api.local.getDropdownList({ type: 'ProcessingStatus' })
      this.ddlOrderStatus = response
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      await this.$refs['form'].validate((valid) => { isSuccess = valid })
      if (!isSuccess) { return }

      // 檢查ProcessingItem
      if (!this.ProcessingItem.ProductID) {
        this.$message.error(this.$t('__plzChoice') + this.$t('__processing') + this.$t('__product'), this.$t('__warning'))
        return
      }

      // 檢查明細資訊
      isSuccess = await this.$refs['processingOrderDetail'].checkValidate()
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
        isSuccess = await this.$refs['processingOrderDetail'].beforeSave()
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
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__processingOrder'), this.$t('__delete'))

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
          let responseUpdate = await this.$api.stock.processingOrderUpdate({ form: this.form })
          if (responseUpdate.headers['code'] === '200') {
            isSuccess = true
            this.form.ID = responseUpdate.data.result[0].ID
            this.updateMessage = responseUpdate.data.result[0].message
          }
          break
        case 'delete':
          let responseDelete = await this.$api.stock.processingOrderDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseDelete.data.result[0].message
          }
          break
      }

      return isSuccess
    }
  }
}
</script>
