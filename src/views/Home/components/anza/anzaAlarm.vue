<template>
  <div class="announcement">
    <div class="header">
      {{$t('__anzaOrder')}}
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" v-if="item.alarmAnza">
        <template slot="title">
          <span class="captionDate">{{$t('__notAnza')}}</span>
          <span class="caption">{{item.alarmAnza.length}}</span>
        </template>
        <el-table
          :data="item.alarmAnza"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="AnzaOrderID"
            :label="$t('__anzaOrder')">
          </el-table-column>
          <el-table-column
            prop="ScheduledDate"
            :label="$t('__anzaScheduledDate')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="2" v-if="item.alarmYuanman">
        <template slot="title">
          <span class="captionDate">{{$t('__yuanman')}}</span>
          <span class="caption">{{item.alarmYuanman.length}}</span>
        </template>
        <el-table
          :data="item.alarmYuanman"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="AnzaOrderID"
            :label="$t('__anzaOrder')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="item.alarmRenew">
        <template slot="title">
          <span class="captionDate">{{$t('__anzaRenew')}}</span>
          <span class="caption">{{item.alarmRenew.length}}</span>
        </template>
        <el-table
          :data="item.alarmRenew"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="AnzaOrderID"
            :label="$t('__anzaOrder')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="4" v-if="item.alarmTransfer">
        <template slot="title">
          <span class="captionDate">{{$t('__anzaTransfer')}}</span>
          <span class="caption">{{item.alarmTransfer.length}}</span>
        </template>
        <el-table
          :data="item.alarmTransfer"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="AnzaOrderID"
            :label="$t('__anzaOrder')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'AnzaAlarm',
  data () {
    return {
      activeNames: [],
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
  .captionDate {
    color: lightcoral;
  }
  .caption {
    font-size: 2rem;
    font-weight: 1000;
    padding-left: 1vw;
    text-align: start;
  }
}
</style>
