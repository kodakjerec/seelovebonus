<template>
  <el-form>
    <el-form-item>
      <el-button-group class="defineCSS_ButtonGroup">
        <el-button icon="el-icon-setting" @click.prevent="showFormSettingsType('new')">{{$t('__systemSettingsSettingsType')}}</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      </el-button-group>
    </el-form-item>
    <el-form-item :label="$t('__systemSettingsCategory')">
      <el-col :span="8">
        <el-select style="width:100%" v-model="form.category" value-key="value" :placeholder="$t('__plzChoice')" @change="selectChange">
          <el-option v-for="item in ddlCategory" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value+'('+item.Memo+')'}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('__systemSettingsLanguage')">
          <el-select v-model="form.language" value-key="value" :placeholder="$t('__plzChoice')" @change="selectChange">
            <el-option v-for="item in ddlLanguages" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-table
      :data="settings"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="Category"
        :label="$t('__systemSettingsCategory')">
      </el-table-column>
      <el-table-column
        prop="ParentCategory"
        :label="$t('__systemSettingsParentCategory')">
      </el-table-column>
      <el-table-column
        prop="ParentID"
        :label="$t('__systemSettingsParentID')">
      </el-table-column>
      <el-table-column
        prop="ID"
        :label="$t('__systemSettingsID')">
      </el-table-column>
      <el-table-column
        prop="Value"
        :label="$t('__systemSettingsValue')">
      </el-table-column>
      <el-table-column
        prop="Language"
        :label="$t('__systemSettingsLanguage')">
      </el-table-column>
      <el-table-column
        prop="Memo"
        :label="$t('__memo')">
      </el-table-column>
    </el-table>
    <new-form
      v-if="dialogShow"
      :dialog-type="dialogType"
      :dialog-show="dialogShow"
      :category="form.category"
      :systemSettings="systemSettings"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/systemSettingsNewForm'

export default {
  name: 'SystemSettings',
  components: {
    newForm
  },
  data () {
    return {
      form: {
        category: 'Country',
        language: 2
      },
      dialogType: 'new',
      dialogShow: false,
      systemSettings: {},
      // 以下為下拉式選單專用
      settingsOrigin: [],
      settings: [],
      ddlCategory: [],
      ddlLanguages: [
        { ID: 1, Value: this.$t('__language1') },
        { ID: 2, Value: this.$t('__language2') }]
    }
  },
  async mounted () {
    await this.preLoading()

    this.form.category = this.ddlCategory[0].ID
    this.form.language = this.ddlLanguages[1].ID

    this.selectChange()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      let response = await this.$api.settings.getDropdownList({ type: 'systemSettings' })
      this.settingsOrigin = response.data.result

      let response2 = await this.$api.settings.getDropdownList({ type: 'settingsType' })
      this.ddlCategory = response2.data.result
    },
    // 篩選
    selectChange: function () {
      this.settings = this.settingsOrigin.filter(item => item.Category === this.form.category).filter(item => item.Language === this.form.language)
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.systemSettings = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.user = row
    },
    // 開啟表單
    showForm: function (eventType) {
      this.dialogType = eventType
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: async function () {
      this.dialogShow = false
      await this.preLoading()

      this.selectChange()
    },
    showFormSettingsType: function (eventType) {
      // 切換成 settingsType
      this.form.category = this.ddlCategory.find(item => item.ID === 'SettingsType').ID
      this.selectChange()

      this.showForm(eventType)
    }
  }
}
</script>
<style lang="scss" scoped>
.defineCSS_ButtonGroup {
  position: absolute;
  left:10px;
}
</style>
