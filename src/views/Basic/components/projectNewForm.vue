<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__project')+$t('__id')" prop="ID">
        <el-col :span="10">
          <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__projectOrderPrefix')" prop="Prefix">
            <el-input v-model="form.Prefix" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__project')+$t('__name')" prop="Name">
          <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
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
          <el-input-number v-model.number="form.Price"></el-input-number>
          <span>{{$t('__dollar')}}</span>
      </el-form-item>
      <el-form-item :label="$t('__pv')">
          <el-input-number v-model.number="form.PV" :precision="2" :min="0"></el-input-number>
          <span>{{$t('__100PercentInput100')}}</span>
      </el-form-item>
      <template v-if="dialogType!=='new'">
        <el-divider>{{$t('__project')+$t('__detail')}}</el-divider>
        <bom ref="bom" :projectID="form.ID" :projectDetail="projectDetail"></bom>
      </template>
      <el-form-item v-else>{{$t('__projectDetailWarrning')}}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import bom from './projectDetail'
export default {
  name: 'ProjectNewForm',
  components: {
    bom
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    project: { type: Object },
    buttonsShowUser: { type: Object }
  },
  data () {
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
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Prefix: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false
      },
      myTitle: '',
      projectDetail: [],
      projectPBonus: [],
      projectSuperBonus: []
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
        this.form = JSON.parse(JSON.stringify(this.project))
        this.disableForm.ID = true
        this.disableForm.Prefix = true
        break
    }
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response1 = await this.$api.basic.getObject({ type: 'projectDetail', ID: this.form.ID })
      this.projectDetail = response1.data.result
    },
    // 檢查輸入
    checkValidate: async function () {
      if (this.dialogType !== 'new') {
      // check BOM
        let isSuccess = false
        isSuccess = await this.$refs['bom'].beforeSave()
        if (!isSuccess) { return }
      }

      // 檢查主表單
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
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
          let responseNew = await this.$api.basic.projectNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.projectEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
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
