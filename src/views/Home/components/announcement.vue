<template>
  <div class="announcement">
    <div class="header">
      {{$t('__announcement')}}
    </div>
    <el-collapse v-model="activeNames">
      <template v-for="(item, keyIndex) in list">
        <el-collapse-item :name="item.ID" :key="keyIndex">
          <template slot="title">
            <span class="captionDate">{{$t('__date')}}：{{formatterDate(item.StartDate)}}~{{formatterDate(item.EndDate)}}</span>
            <span class="caption">{{item.Caption}}</span>
          </template>
          <div class="text" v-html="item.Text">
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script>
import { formatDate, newLineToBr, spaceToNBSP } from '@/setup/format.js'
export default {
  name: 'Announcement',
  data () {
    return {
      activeNames: [],
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
      let responseRecords = await this.$api.settings.getDropdownList({ type: 'announcement' })
      this.list = responseRecords.data.result
      if (this.list.length > 0) {
        // 替換\n => <br/>
        this.list.forEach(item => {
          if (item.Active === 1) {
            this.activeNames.push(item.ID)
          }
          item.Text = newLineToBr(item.Text)
          item.Text = spaceToNBSP(item.Text)
        })
      }
    }
  }
}
</script>
