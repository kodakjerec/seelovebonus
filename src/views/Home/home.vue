<template>
  <div>
    <el-col :span="12">
      <announcemnet/>
    </el-col>
  </div>
</template>

<script>
import announcemnet from './components/announcement'
export default {
  name: 'home',
  components: {
    announcemnet
  }
}
</script>
