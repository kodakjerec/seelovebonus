<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="20%">
      <el-form-item :label="$t('__project')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
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
              format="yyyy - MM - dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__endDate')}}
        </el-col>
        <el-col :span="10">
          <el-form-item prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              format="yyyy - MM - dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__price')">
          <el-input v-model.number="form.Price"></el-input>
      </el-form-item>
      <template v-if="dialogType!=='new'">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('__project')+$t('__detail')" name="first"></el-tab-pane>
          <el-tab-pane :label="$t('__project')+$t('__performanceBonus')" name="second"></el-tab-pane>
          <el-tab-pane :label="$t('__project')+$t('__superBonus')" name="third"></el-tab-pane>
        </el-tabs>
        <bom v-show="activeName==='first'" ref="bom" :projectID="form.ID" :projectDetail="projectDetail"></bom>
        <p-bonus v-show="activeName==='second'" ref="pBonus" :projectID="form.ID" :projectPBonus="projectPBonus"></p-bonus>
        <super-bonus v-show="activeName==='third'" ref="superBonus" :projectID="form.ID" :projectSuperBonus="projectSuperBonus"></super-bonus>
      </template>
      <el-form-item v-else>{{$t('__projectDetailWarrning')}}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import bom from './projectDetail'
import pBonus from './projectPerformanceBonus'
import superBonus from './projectSuperBonus'
export default {
  name: 'ProjectNewForm',
  components: {
    bom,
    pBonus,
    superBonus
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    project: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        Name: '',
        StartDate: '',
        EndDate: '',
        Price: 0
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false
      },
      myTitle: '',
      projectDetail: [],
      projectPBonus: [],
      projectSuperBonus: [],
      activeName: 'first'
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
        break
    }
    this.preloading()
  },
  methods: {
    // 讀取預設資料
    preloading: async function () {
      const response1 = await this.$api.basic.getObject({ type: 'projectDetail', ID: this.form.ID })
      this.projectDetail = response1.data.result
      const response2 = await this.$api.basic.getObject({ type: 'projectPerformanceBonus', ID: this.form.ID })
      this.projectPBonus = response2.data.result
      const response3 = await this.$api.basic.getObject({ type: 'projectSuperBonus', ID: this.form.ID })
      this.projectSuperBonus = response3.data.result
    },
    // 檢查輸入
    checkValidate: async function () {
      // check BOM
      let isSuccess = false
      isSuccess = await this.$refs['bom'].beforeSave()
      if (!isSuccess) { return }

      // check pBonus
      isSuccess = false
      isSuccess = await this.$refs['pBonus'].beforeSave()
      if (!isSuccess) { return }

      // check superBonus
      isSuccess = false
      isSuccess = await this.$refs['superBonus'].beforeSave()
      if (!isSuccess) { return }

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
          const responseNew = await this.$api.basic.projectNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.projectEdit({ form: this.form })
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
