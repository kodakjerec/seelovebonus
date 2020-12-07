<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__storageAddress')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__limit') + $t('__itemCategory')">
        <template slot="label">
          {{$t('__limit')}}{{$t('__itemCategory')}}<br/><span style="color: red">{{$t('__noChoiceNoLimit')}}</span>
        </template>
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
      <el-form-item>
        <template slot="label">
          {{$t('__storageAddress')}}{{'(' + $t('__building') + '-' + $t('__floor') + '-' + $t('__area') + ')'}}
        </template>
        <el-col :span="8">
          <el-form-item prop="Building">
            <el-select v-model="form.Building" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlBuildingChange">
              <el-option v-for="item in ddlBuilding" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="Floor">
            <el-select v-model="form.Floor" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlFloorChange">
              <el-option v-for="item in ddlFloor" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="Area">
            <el-select v-model="form.Area" value-key="value" :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlArea" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          {{$t('__volume')}}{{'(' + $t('__length') + '-' + $t('__width') + '-' + $t('__height') + ')'}}<br/><span style="color: red">{{$t('__noChoiceNoLimit')}}</span>
        </template>
        <el-col :span="8">
          <el-input-number v-model="form.Length" :min="0"></el-input-number>
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="form.Width" :min="0"></el-input-number>
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="form.Height" :min="0"></el-input-number>
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
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" autocomplete="off" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-show="dialogType === 'edit' &&  buttonsShowUser.delete" type="danger" @click="deleteItem">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'StockNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    storageAddress: { type: Object },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        Building: '',
        Floor: '',
        Area: '',
        Direction: '',
        Category1: '',
        Category2: '',
        Category3: '',
        Length: 0,
        Width: 0,
        Height: 0,
        Status: '1'
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Building: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Floor: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Area: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
      ddlBuilding: [],
      ddlFloorOrigin: [],
      ddlFloor: [],
      ddlAreaOrigin: [],
      ddlArea: []
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__storageAddress')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__storageAddress')
        this.form = JSON.parse(JSON.stringify(this.storageAddress))
        this.disableForm.ID = true
        break
    }
    await this.preLoading()

    this.isLoadingFinish = true
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
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

      let resBuilding = await this.$api.basic.getDropdownList({ type: 'building' })
      this.ddlBuilding = resBuilding.data.result
      let resFloor = await this.$api.basic.getDropdownList({ type: 'floor' })
      this.ddlFloorOrigin = resFloor.data.result
      let resArea = await this.$api.basic.getDropdownList({ type: 'area' })
      this.ddlAreaOrigin = resArea.data.result
      this.ddlBuildingChange()
      this.ddlFloorChange()
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      await this.$refs['form'].validate((valid) => { isSuccess = valid })
      if (isSuccess) {
        this.save(this.dialogType)
      }
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 刪除
    deleteItem: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__storageAddress'), this.$t('__delete'))

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
          let responseUpdate = await this.$api.basic.storageAddressUpdate({ form: this.form })
          if (responseUpdate.headers['code'] === '200') {
            this.$alert(responseUpdate.data.result[0].message, responseUpdate.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.storageAddressDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          } else {
            this.$alert(responseDelete.data.result.message, responseDelete.data.result.code)
            isSuccess = false
          }
          break
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
    },
    // 儲位棟別變更
    ddlBuildingChange: function () {
      this.ddlFloor = this.ddlFloorOrigin.filter(item => item.ParentID === this.form.Building)
      if (this.isLoadingFinish) {
        this.form.Floor = null
        this.form.Area = null
      }
    },
    // 儲位樓層變更
    ddlFloorChange: function () {
      this.ddlArea = this.ddlAreaOrigin.filter(item => item.ParentID === this.form.Floor)
      if (this.isLoadingFinish) {
        this.form.Area = null
      }
    }
  }
}
</script>
