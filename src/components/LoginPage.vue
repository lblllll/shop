<template>
    <div class="login_container">
     <div class="login_box">
        <!-- 这是头像区 -->
        <div class="avatar-box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 这是表单区 -->
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="login_form">
        <!-- 这是用户名 -->
        <el-form-item label="" prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
         </el-form-item>
         <!-- 这是密码 -->
         <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
         </el-form-item>
         <!-- 按钮区域 -->
         <el-form-item class="btns">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="restloginForm">重置</el-button>
         </el-form-item>
    </el-form>
    </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 这是登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 这是重置按钮，重置登录表单
    restloginForm () {
    //   console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 将登录成功的token保存到sssionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台主页，地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box {
        position: absolute;
        width: 400px;
        height: 400px;
        background-color: #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
   .avatar-box{
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    width: 130px;
    height: 130px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
   }
   .avatar-box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
   }
   .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
   }
   .btns {
    display: flex;
    justify-content: flex-end;

   }
</style>
