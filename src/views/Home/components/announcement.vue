<template>
  <div class="announcement">
    <div class="header">
      {{$t('__announcement')}}
    </div>
    <el-collapse v-model="activeName" accordion>
      <template v-for="(item, keyIndex) in list">
        <el-collapse-item :name="item.ID" :key="keyIndex">
          <template slot="title">
            <span class="captionDate">{{$t('__date')}}：{{formatterDate(item.StartDate)}}~{{formatterDate(item.EndDate)}}</span>
            <span class="caption">{{item.Caption}}</span>
          </template>
          <span class="text">
          <div v-html="item.Text"></div>
          </span>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script>
import { formatDate, newLineToBr } from '@/setup/format.js'
export default {
  name: 'Announcement',
  data () {
    return {
      activeName: '1',
      list: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (cellValue) {
      return formatDate(cellValue)
    },
    preLoading: async function () {
      const responseRecords = await this.$api.settings.getDropdownList({ type: 'announcement' })
      this.list = responseRecords.data.result
      if (this.list.length > 0) {
        this.activeName = this.list[0].ID

        // 替換\n => <br/>
        this.list.forEach(item => {
          item.Text = newLineToBr(item.Text)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.announcement {
  background-color: lightgray;
  border-radius: 4px;
  border: 1px solid lightgray;

  .header{
    font-size: 2vw;
  }
  .captionDate {
    color: lightcoral;
  }
  .caption {
    font-size: 2vw;
    font-weight: 1000;
    padding-left: 1vw;
    text-align: start;
  }

  .text {
    font-size: 1vw;
    text-align: justify;
  }
}
</style>
