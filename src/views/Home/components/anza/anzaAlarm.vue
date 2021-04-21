<template>
  <div class="announcement" @click.prevent="clickAnnouncement">
    <div class="header">
      {{$t('__anzaOrder')}}
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <p></p>
        <div v-if="item.alarmAnza">
          <el-badge :value="item.alarmAnza.length">
            <el-button type="danger">{{$t('__notAnza')}}</el-button>
          </el-badge>
        </div>
        <p></p>
        <div v-if="item.alarmYuanman">
          <el-badge :value="item.alarmYuanman.length">
            <el-button>{{$t('__yuanman')}}</el-button>
          </el-badge>
        </div>
        <p></p>
        <div v-if="item.alarmRenew">
          <el-badge :value="item.alarmRenew.length">
            <el-button type="info">{{$t('__anzaRenew')}}</el-button>
          </el-badge>
        </div>
        <p></p>
        <div v-if="item.alarmExtend">
          <el-badge :value="item.alarmExtend.length">
            <el-button type="info">{{$t('__anzaExtend')}}</el-button>
          </el-badge>
        </div>
        <p></p>
        <div v-if="item.alarmTransfer">
          <el-badge :value="item.alarmTransfer.length">
            <el-button>{{$t('__anzaTransfer')}}</el-button>
          </el-badge>
        </div>
        <p></p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'AnzaAlarm',
  data () {
    return {
      activeNames: ['1'],
      item: {}
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      let responseRecords = await this.$api.orders.anzaAlarm({})
      this.item = responseRecords.data.result[0]

      if (this.item.alarmAnza) {
        this.item.alarmAnza = JSON.parse(this.item.alarmAnza)
      }
      if (this.item.alarmYuanman) {
        this.item.alarmYuanman = JSON.parse(this.item.alarmYuanman)
      }
      if (this.item.alarmRenew) {
        this.item.alarmRenew = JSON.parse(this.item.alarmRenew)
      }
      if (this.item.alarmExtend) {
        this.item.alarmExtend = JSON.parse(this.item.alarmExtend)
      }
      if (this.item.alarmTransfer) {
        this.item.alarmTransfer = JSON.parse(this.item.alarmTransfer)
      }
    },
    // 按下公告
    clickAnnouncement: function () {
      this.$router.push({
        name: 'AnzaOrderShow'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.announcement {
  background-color: lightgray;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin: 5px 5px 5px 5px;

  .header{
    font-size: 2rem;
  }
}
</style>
