<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel" append-to-body>
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
          <el-select v-model="form.Gender" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlGender" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
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
              range-separator="~"
              :start-placeholder="$t('__startDate')"
              :end-placeholder="$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__lunarDate')+'('+$t('__lunarCalendar')+')'">
            <el-date-picker
              v-model="form.BirthLunarDate"
              type="daterange"
              unlink-panels
              range-separator="~"
              :start-placeholder="$t('__startDate')"
              :end-placeholder="$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__lunarTime')">
        <el-select v-model="form.BirthLunarTime" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlLunarTime" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
            <span style="float: left">{{ item.Value + '(' + item.Memo + ')' }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="search">{{$t('__search')}}</el-button>
      <el-divider>{{$t('__searchResult')}}</el-divider>
      <el-table
        :data="results"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="ID"
          :label="$t('__customer')+$t('__id')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="Name"
          :label="$t('__customer')+$t('__name')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="GenderName"
          :label="$t('__gender')"
          width="50">
        </el-table-column>
        <el-table-column
          width="100">
          <template slot="header">
            {{$t('__home')+$t('__tel')}}<br/>{{$t('__mobile')+$t('__tel')}}
          </template>
          <template slot-scope="scope">
            {{scope.row.TelHome}}<br/>{{scope.row.TelMobile}}
          </template>
        </el-table-column>
        <el-table-column
          prop="Birth"
          :label="$t('__birth')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="BirthLunarDate"
          :label="$t('__lunarDate')+'('+$t('__lunarCalendar')+')'"
          width="100">
          <template slot="header">
            {{$t('__lunarDate')+'('+$t('__lunarCalendar')+') '+$t('__lunarTime')}}
          </template>
          <template slot-scope="scope">
            {{scope.row.BirthLunarDate}}{{' '+scope.row.BirthLunarTimeName}}
          </template>
        </el-table-column>
        <!-- 住址 -->
        <el-table-column
          prop="Address"
          :label="$t('__address')"
          width="400">
        </el-table-column>
        <el-table-column
          fixed="right"
          width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native.stop="handleClick(scope.$index, scope.row)">{{$t('__ok')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizeList"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="originData.length">
      </el-pagination>
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
        Gender: '',
        Birth: [],
        BirthStart: '',
        BirthEnd: '',
        BirthLunarDate: [],
        BirthLunarStart: '',
        BirthLunarEnd: '',
        LunarTime: ''
      },
      originData: [],
      results: [],
      CustomerID: '',
      myTitle: this.$t('__search') + this.$t('__customer'),
      pagination: {
        currentPage: 1,
        pageSizeList: [10],
        pageSize: 10
      },
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
      if (this.form.Birth.length > 0) {
        this.form.BirthStart = this.form.Birth[0]
        this.form.BirthEnd = this.form.Birth[1]
      }
      if (this.form.BirthLunarDate.length > 0) {
        this.form.BirthLunarStart = this.form.BirthLunarDate[0]
        this.form.BirthLunarEnd = this.form.BirthLunarDate[1]
      }
      let response = await this.$api.basic.customerSearch({ form: this.form })
      this.originData = response.data.result
      this.originData.forEach(row => {
        row.Birth = new Date(row.Birth).toISOString().slice(0, 10)
        row.BirthLunarDate = new Date(row.BirthLunarDate).toISOString().slice(0, 10)
      })
      this.pagination.currentPage = 1
      this.pageChange()
    },
    // 選擇客戶ID
    handleClick: async function (index, row) {
      this.CustomerID = row.ID
      this.$emit('dialog-save', {
        ID: this.CustomerID
      })
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // ===== 分頁相關 =====
    handleSizeChange: function (val) {
      this.pagination.pageSize = val
      this.pageChange()
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val
      this.pageChange()
    },
    pageChange: function () {
      this.results = this.originData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage)
    }
  }
}
</script>
