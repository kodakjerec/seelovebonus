<template>
  <div class="announcement" @click.prevent="clickAnnouncement">
    <div class="header">
      {{$t('__anzaOrder')}}
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
      <div>
        <el-button type="danger" v-if="item.alarmAnza" class="caption">{{$t('__notAnza')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmAnza" :key="keyIndex" class="text">
          {{row.AnzaOrderID}}
        </div>
      </div>
      <div>
        <el-button v-if="item.alarmYuanman" class="caption">{{$t('__yuanman')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmYuanman" :key="keyIndex" class="text">
          {{row.AnzaOrderID}}
        </div>
      </div>
      <div>
        <el-button type="info" v-if="item.alarmRenew" class="caption">{{$t('__anzaRenew')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmRenew" :key="keyIndex" class="text">
          {{row.AnzaOrderID}}
        </div>
      </div>
      <div>
        <el-button type="info" v-if="item.alarmExtend" class="caption">{{$t('__anzaExtend')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmExtend" :key="keyIndex" class="text">
          {{row.AnzaOrderID}}
        </div>
      </div>
      <div>
        <el-button v-if="item.alarmTransfer" class="caption">{{$t('__anzaTransfer')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmTransfer" :key="keyIndex" class="text">
          {{row.AnzaOrderID}}
        </div>
      </div>
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

  .caption {
    font-size: 1.2rem;
    display: block;
  }

  .text {
    font-size: 1.2rem;
    text-align: justify;
  }
}
</style>
