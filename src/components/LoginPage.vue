<template>
    <div class="login_container">
     <div class="login_box">
        <!-- 这是头像区 -->
        <div class="avatar-box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 这是表单区 -->
    <el-form label-width="80px">
        <el-form-item label="活动名称">
            <el-input></el-input>
         </el-form-item>
    </el-form>
    </div>
    </div>
</template>
<script></script>
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
</style>
