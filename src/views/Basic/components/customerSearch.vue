<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel" append-to-body>
    <el-form label-width="10vw" label-position="right">
      <!-- 個資 -->
      <!-- 關鍵字 -->
      <!-- 住址 -->
      <el-form-item :label="$t('__keyword')">
        <el-input v-model="form.keyword" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <!-- 性別 -->
      <el-form-item :label="$t('__gender')">
        <el-col :span="4">
          <el-select v-model="form.Gender" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlGender" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__home')+$t('__tel')">
            <el-input v-model="form.TelHome"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__mobile')+$t('__tel')">
            <el-input v-model="form.TelMobile"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 出生日期 -->
      <el-form-item :label="$t('__birth')">
        <el-col :span="10">
          <el-form-item>
            <el-date-picker
              v-model="form.Birth"
              type="daterange"
              unlink-panels
              range-separator="To"
              :start-placeholder="$t('__startDate')"
              :end-placeholder="$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__lunarDate')+'('+$t('__lunarCalendar')+')'">
            <el-date-picker
              v-model="form.BirthLunarDate"
              type="daterange"
              unlink-panels
              range-separator="To"
              :start-placeholder="$t('__startDate')"
              :end-placeholder="$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__lunarTime')">
        <el-select v-model="form.BirthLunarTime" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlLunarTime" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value + '(' + item.Memo + ')' }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="search">{{$t('__search')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomerSearch',
  props: {
    dialogShow: { type: Boolean, default: false }
  },
  data () {
    return {
      form: {
        keyword: '',
        Gender: null,
        BirthStart: null,
        BirthEnd: null,
        BirthLunarStart: null,
        BirthLunarEnd: null,
        LunarTime: null
      },
      CustomerID: '',
      myTitle: this.$t('__search') + this.$t('__customer'),
      // 下拉是選單
      ddlLunarTime: [],
      ddlGender: [],
      ddlCountry: [],
      ddlCity: [],
      ddlPost: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: function () {
      let response = this.$api.local.getDropdownList({ type: 'LunarTime' })
      this.ddlLunarTime = response
      response = this.$api.local.getDropdownList({ type: 'Gender' })
      this.ddlGender = response
      response = this.$api.local.getDropdownList({ type: 'District' })
      this.postData = response
      response = this.$api.local.getDropdownList({ type: 'Country' })
      this.ddlCountry = response
      response = this.$api.local.getDropdownList({ type: 'City' })
      this.ddlCity = response
      // 郵遞區號
      this.ddlCityChange()
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
    },
    // 搜尋可能用戶
    search: async function () {

    },
    save: async function () {
      this.$emit('dialog-save', {
        ID: this.CustomerID
      })
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    }
  }
}
</script>
