<template>
  <el-form>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" disabled icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      </el-button-group>
    </el-form-item>
    <el-form-item :label="$t('__systemSettingsCategory')">
      <el-col :span="8">
        <el-select v-model="form.category" value-key="value" :placeholder="$t('__plzChoice')" @change="selectChange">
          <el-option v-for="item in categories" :key="item.ID" :label="item.Value" :value="item.ID"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="el-form-item__label">
        {{$t('__systemSettingsLanguage')}}
      </el-col>
      <el-col :span="8">
        <el-select v-model="form.language" value-key="value" :placeholder="$t('__plzChoice')" @change="selectChange">
          <el-option v-for="item in languages" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
      </el-select>
      </el-col>
    </el-form-item>
    <el-table
      :data="settings"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="Category"
        :label="$t('__systemSettingsCategory')">
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
    </el-table>
  </el-form>
</template>

<script>
export default {
  name: 'SystemSettings',
  data () {
    return {
      form: {
        category: 'Country',
        language: 2
      },
      categories: [],
      languages: [
        { ID: 1, Value: this.$t('__language1') },
        { ID: 2, Value: this.$t('__language2') }],
      settingsOrigin: [],
      settings: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.settings.getSetting({ type: 'systemSettings' })
      this.settingsOrigin = response.data.result

      let arrayDistinctCategory = [...new Set(this.settingsOrigin.map(item => item.Category))]
      arrayDistinctCategory.forEach(value => {
        this.categories.push({ ID: value, Value: value })
      })
      this.form.category = this.categories[0].ID
      this.form.language = this.languages[1].ID

      this.selectChange()
    },
    // 篩選
    selectChange: function () {
      this.settings = this.settingsOrigin.filter(item => item.Category === this.form.category).filter(item => item.Language === this.form.language)
    }
  }
}
</script>
