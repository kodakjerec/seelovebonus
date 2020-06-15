<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="帳號" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="密碼" prop="pwd">
        <el-input v-model="form.pwd"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submit">主要按钮</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        id: '',
        pwd: ''
      },
      rules: {
        id: [
          { required: true, message: '請輸入帳號', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '請輸入密碼', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
