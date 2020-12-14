<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form label-width="10vw" label-position="right">
      <h2>{{$t('__signOffWarning')}}</h2>
      <el-tag v-for="(item, index) in signOffList" :key="index">
        {{item.OrderID}}
      </el-tag>
      <el-form-item :label="$t('__signOff') + $t('__memo')">
          <el-input v-model="signOffReason" type="textarea" rows="2" autocomplete="off" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="save">{{$t('__ok')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'signOffDialog',
  props: {
    dialogShow: { type: Boolean, default: false },
    signOffList: { type: Array },
    signOffChoice: { type: Number }
  },
  data () {
    return {
      signOffReason: '',
      myTitle: this.$t('__signOff')
    }
  },
  watch: {
    signOffChoice: function (newValue) {
      switch (newValue) {
        case 1:
          this.myTitle = this.$t('__signOff') + this.$t('__signOffAgree')
          break
        case 0:
          this.myTitle = this.$t('__signOff') + this.$t('__signOffDeny')
          break
      }
    }
  },
  methods: {
    save: async function () {
      let resultMessage = ''
      for (let index = 0; index < this.signOffList.length; index++) {
        let row = this.signOffList[index]
        let form = {
          OrderID: row.OrderID,
          Type: row.Type,
          Prefix: row.Prefix,
          Status: row.Status,
          ID: this.$store.state.userID,
          SignResult: this.signOffChoice,
          Memo: this.signOffReason
        }
        let responseSignOff = await this.$api.signOff.assign({ form: form })
        if (responseSignOff.headers['code'] === '200') {
          resultMessage += row.OrderID + ' ' + responseSignOff.data.result[0].message + '<br/>'
        }
      }
      if (resultMessage !== '') {
        resultMessage = this.$t('__signOffResultMessage') + '<br/>' + resultMessage
        this.$alert(resultMessage, {
          dangerouslyUseHTMLString: true
        })
      }
      this.$emit('finish')
    },
    cancel: function () {
      this.$emit('cancel')
    }
  }
}
</script>
