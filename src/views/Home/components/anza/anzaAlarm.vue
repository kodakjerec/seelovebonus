<template>
  <div class="announcement" @click.prevent="clickAnnouncement">
    <div class="header">
      {{$t('__anzaOrder')}}
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
      <div>
        <el-button type="danger" v-if="item.alarmAnza !== ''" class="caption">{{$t('__notAnza')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmAnza" :key="keyIndex" class="text">
          {{row.AnzaOrderID}}
        </div>
      </div>
      <div>
        <el-button type="success" v-if="item.alarmRenew !== ''" class="caption">{{$t('__installmentRenew')}}</el-button>
        <div v-for="(row, keyIndex) in item.alarmRenew" :key="keyIndex" class="text">
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
      let responseRecords = await this.$api.settings.getDropdownList({ type: 'anzaAlarm' })
      this.item = responseRecords.data.result[0]

      if (this.item.alarmAnza) {
        this.item.alarmAnza = JSON.parse(this.item.alarmAnza)
      }
      if (this.item.alarmRenew) {
        this.item.alarmRenew = JSON.parse(this.item.alarmRenew)
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
