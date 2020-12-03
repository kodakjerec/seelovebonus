<template>
  <div>
    <el-table
      v-show="orderDetail.showExpandFunctions === 1"
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
            filterable
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')"
            @change="(value)=>{ddlCertificate2Change(value, scope.row)}"
            style="display:block">
            <el-option v-for="item in ddlCertificate2" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
          <div v-else>
            {{scope.row.Value1}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="Value2"
        :label="$t('__chanyun')+$t('__landCertificate')">
        <template slot-scope="scope">
          <el-input
            v-if="buttonsShowUser.new"
            v-model="scope.row[scope.column.property]" :placeholder="$t('__pleaseInput')"></el-input>
          <div v-else>
            {{scope.row.Value2}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'orderDetailFunctions',
  props: {
    orderDetail: { type: Object },
    buttonsShowUser: { type: Object },
    productFunctionsList: { type: Array }
  },
  data () {
    return {
      subItem: {
        OrderID: this.orderDetail.OrderID,
        DetailSeq: this.orderDetail.Seq,
        Function: '',
        Seq: 0,
        Value1: '',
        Value2: ''
      },
      subList: [],
      subListDeleted: [],
      // 下拉是選單
      ddlCertificate2: []
    }
  },
  mounted () {
    this.preLoading()
    this.bringDetail()
  },
  methods: {
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.orders.getDropdownList({ type: 'certificate2ChgLandCertificate' })
      this.ddlCertificate2 = response.data.result
    },
    // 帶入資料
    bringDetail: async function () {
      this.subList = []
      this.subListDeleted = []

      // 填入舊資料
      this.productFunctionsList.forEach(row => {
        if (row.Seq === this.orderDetail.Seq) {
          if (row.Function === 'chglandCertificate') {
            this.subList.push(row)
          }
        }
      })

      /*
        展雲換狀
      */
      // 新資料
      if (this.orderDetail.showExpandFunctions === 1) {
        let index = 0
        let loopMax = (this.orderDetail.Qty - this.subList.length)
        while (index < loopMax) {
          let newObj = JSON.parse(JSON.stringify(this.subItem))
          // find Maximum Seq
          let nextSeq = 1
          if (this.subList.length === 0) {
            nextSeq = 1
          } else {
            let amounts = this.subList.map(item => item.Seq)
            let highestSeq = Math.max(...amounts)
            nextSeq = highestSeq + 1
          }

          newObj.Function = 'chglandCertificate'
          newObj.Seq = nextSeq

          this.subList.push(newObj)
          index++
        }
      }
    },
    // 檢察權狀是否重複
    ddlCertificate2Change: function (value, row) {
      let findDuplication = this.subList.find(item => { return item.Value1 === value && item.Seq !== row.Seq })
      if (findDuplication !== undefined) {
        this.$message({
          message: value + ' ' + this.$t('__valueUsed'),
          type: 'error'
        })
        row.Value1 = ''
      }
    },
    checkValidate: function () {
      let isSuccess = false

      /*
        展雲換狀
      */
      if (this.orderDetail.showExpandFunctions === 1) {
        isSuccess = true

        this.subList.forEach(row => {
          if (row.Value1 === '' || row.Value2 === '') {
            this.$message({
              message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__extend') + this.$t('__function'),
              type: 'error'
            })
            isSuccess = false
            return isSuccess
          }
        })
      }

      return isSuccess
    },
    beforeSave: async function () {
      let isSuccess = false

      // 結合已刪除單據
      let finalResult = this.subList.concat(this.subListDeleted)

      for (let index = 0; index < finalResult.length; index++) {
        isSuccess = false
        let row = finalResult[index]
        // 錯誤處理
        if (row.Value1 === '' || row.Value2 === '') {
          continue
        }
        // 開始更新
        switch (row.Status) {
          case 'New':
            isSuccess = await this.save('new', row)
            break
          case 'Modified':
            isSuccess = await this.save('edit', row)
            break
          case 'Deleted':
            isSuccess = await this.save('delete', row)
            break
          case '':
            isSuccess = true
            break
        }
        // 檢查
        if (isSuccess === false) {
          return isSuccess
        }
      }

      return isSuccess
    },
    // ============== 父視窗使用的函數 ===============
    // 變更明細商品數量
    qtyChange: function (currentValue) {
      this.bringDetail()
    }
  }
}
</script>
