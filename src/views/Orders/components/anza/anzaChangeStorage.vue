<template>
  <div id="orderHead">
    <h1>{{myTitle}}</h1>
    <el-steps :active="nowStep" align-center process-status="finish" finish-status="success">
      <el-step :title="$t('__choose')+' '+$t('__anzaOrder')"></el-step>
      <el-step :title="$t('__plzCheckAgain')+' '+$t('__fromStorageID')"></el-step>
      <el-step :title="$t('__choose')+' '+$t('__anzaStorageID')"></el-step>
      <el-step :title="$t('__complete')"></el-step>
    </el-steps>
    <el-form label-width="10vw" label-position="right">
      <!-- 選擇安座單號 -->
      <el-form-item :label="$t('__anzaOrder')" v-show="nowStep>=0">
        <el-col :span="12">
          <el-select
            :disabled="nowStep>0"
            v-model="form.AnzaOrderID"
            default-first-option filterable clearable
            :placeholder="$t('__plzChoice')"
            @change="ddlAnzaOrderIDChange">
            <el-option v-for="item in ddlAnzaOrderID" :key="item.ID" :label="item.ID+' '+item.CustomerID+', '+item.CustomerName" :value="item.ID">
              <span style="float: left">{{ item.CustomerID+', '+item.CustomerName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <!-- 安座位別 -->
      <el-form-item :label="$t('__fromStorageID')" v-show="nowStep>=1">
        <el-col :span="12">
          <el-input v-model="form.FromStorageID" disabled></el-input>
        </el-col>
      </el-form-item>
      <!-- 移入儲位 -->
      <el-form-item :label="$t('__anzaStorageID')" v-show="nowStep>=2">
        <el-col :span="12">
          <el-select
            remote
            default-first-option filterable clearable
            v-model="form.ToStorageID"
            :disabled="nowStep>2"
            :remote-method="remoteMethod"
            :placeholder="$t('__plzChoice')"
            style="display:block">
            <el-option v-for="item in ddlStorageID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        {{$t('__anzaOperateWarning')}}
      </el-form-item>
    </el-form>
    <!-- 底部操作按鈕 -->
    <div slot="footer">
      <br/>
      <el-button v-if="nowStep>0" @click="goPrevious">{{$t('__prev')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-if="nowStep<3" type="primary" @click="checkValidate">{{$t('__next')}}</el-button>
      <el-button v-else type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnzaChangeStorage',
  data () {
    return {
      form: {
        anzaOrderID: '',
        FromStorageID: '',
        ToStorageID: '',
        ProductID: '',
        Purpose: '',
        Qty: 0
      },
      nowStep: 0,
      myTitle: this.$t('__anzaChangeStorage'),
      // 使用者能看到的權限: 安座單異動客製化
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 0,
        search: 1
      },
      // 以下為下拉式選單專用
      ddlAnzaOrderID: [],
      ddlStorageID: [],
      // 頂部導覽
      tabActiveName: 'orderHead'
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response = await this.$api.orders.getDropdownList({ type: 'anzaOrderHead' })
      this.ddlAnzaOrderID = response.data.result
    },
    // 取得選定的安座單
    ddlAnzaOrderIDChange: async function (selected) {
      let response = await this.$api.orders.getObject({ type: 'anzaOrderDetail', keyword: selected })
      if (response.data.result.length > 0) {
        let row = response.data.result[0]
        this.form.AnzaOrderID = row.AnzaOrderID
        this.form.FromStorageID = row.ToStorageID
        this.form.ProductID = row.ProductID
        this.form.Purpose = row.Purpose
        this.form.Qty = row.Qty

        this.findStorageIDNow(this.form)
      }
    },
    // ===== 表單功能 =====
    // 即時查詢可用儲位
    remoteMethod: async function (query) {
      if (query.length >= 3) {
        // 強制轉為大寫
        query = query.toUpperCase()
        this.findStorageIDNow(this.form, query)
      }
    },
    // 安座單即時查詢庫存(注意要指定ToStorageID)
    findStorageIDNow: async function (row, storageID) {
      let queryStorageID = ''
      if (storageID) {
        queryStorageID = storageID
      } else {
        queryStorageID = row.ToStorageID
      }
      if (row.ProductID) {
        let response2 = await this.$api.stock.findStorageID({
          ProductID: row.ProductID,
          Purpose: row.Purpose,
          Qty: row.Qty,
          StorageID: queryStorageID
        })
        this.ddlStorageID = response2.data.result
      }
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      switch (this.nowStep) {
        case 0:
          // 檢查anzaOrderID
          if (this.form.AnzaOrderID) {
            isSuccess = true
          }
          break
        case 1:
          if (this.form.FromStorageID) {
            isSuccess = true
          }
          break
        case 2:
          if (this.form.ToStorageID) {
            isSuccess = true
          }
          break
        case 3:
          isSuccess = true
          break
      }
      if (!isSuccess) {
        this.checkFail()
      } else {
        switch (this.nowStep) {
          case 0:
          case 1:
          case 2:
            this.nowStep++
            this.tabClick({ name: this.tabActiveName }, null)
            break
          case 3:
            this.save()
            break
        }
      }
    },
    checkFail: function () {
      this.$message(this.$t('__plzCheckAgain'))
      this.tabClick({ name: this.tabActiveName }, null)
    },
    // 上一步
    goPrevious: function () {
      this.nowStep--
    },
    // 取消
    cancel: function () {
      this.$router.push({
        name: 'AnzaOrderShow',
        params: {
          returnType: 'cancel'
        }
      })
    },
    save: async function () {
      let response2 = await this.$api.orders.anzaChangeStorage({ form: this.form })
      if (response2.headers['code'] === '200') {
        this.$message({
          message: response2.data.result[0].message,
          type: 'success'
        })
      }
      this.$emit('dialog-save')
    },
    // ===== 頂部導覽 =====
    tabClick: function (tab, event) {
      this.tabActiveName = tab.name
      let item = document.querySelector('#' + this.tabActiveName)
      // item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })

      window.scrollTo({
        top: item.offsetTop - 80,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
