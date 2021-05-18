<template>
  <!-- 換狀證明交換 -->
  <el-table
    :data="subList"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="Value1"
      :label="$t('__certificate2')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new"
          default-first-option filterable clearable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          @change="(value)=>{ddlCertificate2Change(value, scope.row)}"
          style="display:block">
          <el-option v-for="item in ddlCertificate2" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="Value2"
      :label="$t('__chanyunOrderID')">
      <template slot-scope="scope">
        <el-input
          v-if="buttonsShowUser.new"
          v-model="scope.row[scope.column.property]" :placeholder="$t('__pleaseInput')"
          @change="value=>{rowChange(row)}">
        </el-input>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="Value3"
      :label="$t('__chanyun')+$t('__landCertificate')">
      <template slot-scope="scope">
        <el-input
          v-if="buttonsShowUser.new"
          v-model="scope.row[scope.column.property]" :placeholder="$t('__pleaseInput')"
          @change="value=>{rowChange(row)}">
        </el-input>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'chglandCertificate',
  props: {
    subList: { type: Array },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      // 下拉是選單
      ddlCertificate2: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.orders.getDropdownList({ type: 'certificate2ChgLandCertificate' })
      this.ddlCertificate2 = response.data.result
    },
    // 更新資料
    rowChange: function (row) {
      if (row.Status === '') {
        row.Status = 'Modified'
      }
    },
    // 檢察權狀是否重複
    ddlCertificate2Change: function (value, row) {
      let findDuplication = this.subList.find(item => { return item.Value1 === value && item.Seq !== row.Seq })

      // 沒有重複
      if (findDuplication !== undefined) {
        this.$message({
          message: value + ' ' + this.$t('__valueUsed'),
          type: 'error'
        })
        row.Value1 = ''
        if (row.Status === '') {
          row.Status = 'Modified'
        }
      }
    },
    checkValidate: function () {
      let isSuccess = true

      /*
        展雲換狀
      */
      this.subList.forEach(row => {
        if (row.Value1 === '' || row.Value2 === '' || row.Value3 === '') {
          this.$message({
            message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__extend') + this.$t('__function'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }
      })

      return isSuccess
    }
  }
}
</script>
