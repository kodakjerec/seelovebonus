<template>
  <div>
    <el-button @click="goBack">{{$t('__goback')}}</el-button>
    <h1>{{myTitle}}</h1>
    <el-steps direction="vertical">
      <el-step v-for="(item, index) in steps" :key="index"
        :status="item.SignResult===1?'success':'error'">
        <h4 slot="title">
          {{item.SignResult===1?$t('__signOffAgree'):$t('__signOffDeny')}}<br/>
          {{ $t('__status') + ': ' + item.Value}}
        </h4>
        <h2 slot="description">
          {{ $t('__operator') + ': ' + item.ID +' '+ item.Name}}<br/>
          {{ $t('__logTime') + ': ' + formatterDate(item.CreateDate)}}
        </h2>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import { formatDateTime } from '@/setup/format.js'
export default {
  name: 'OrderSignOffLog',
  props: {
    ID: { type: String }
  },
  data () {
    return {
      steps: [],
      myTitle: this.ID + ' ' + this.$t('__signOffLog')
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (cellValue) {
      return formatDateTime(cellValue)
    },
    preLoading: async function () {
      let response = await this.$api.signOff.getObject({ type: 'orderSignOffLog', ID: this.ID })
      this.steps = response.data.result
    },
    goBack: function () {
      this.$router.push({
        name: 'Orders'
      })
    }
  }
}
</script>
