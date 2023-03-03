<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

<!-- 卡片区域 -->
<el-card >
  <el-row :gutter="20">
    <el-col :span="9">
    <!-- 搜索与添加区域 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
    </el-col>
    <!-- 这是添加按钮 -->
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true ">添加用户</el-button>
    </el-col>
    </el-row>
    <!-- 用户列表区域 -->
<el-table :data="userlist" border stripe >
      <el-table-column label='＃' type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" :enterable="false">
        <template >
            <!-- 三个按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="medium"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
  <!-- 添加用户的对话框 -->
  <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
  <!-- 内容主体区域 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <!-- 这是底部的按钮区域 -->
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<!-- 行为区域 -->
<script>
export default {
  data() {
    // 邮箱验证规则
    var cheackEmail = (rule, value, cb) => {
    // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
      // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合理的邮箱'))
    }
    // 电话号码验证规则
    var cheackMobile = (rule, value, cb) => {
    // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]18[0-9]14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
      // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合理的手机号'))
    }
    return {
    // 获取用户列表参数对象 queryInfo
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少的数据
        pagesize: 3
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 这是添加用户表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '请用户名的长度在 3 ~ 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 10, message: '请登陆密码的长度在 6 ~ 10个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheackEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期函数
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // get参数用params指定
      // get函数辉返回一个promise对象 ，简化用关键字，应为await，就会得到一个数据对象在进行结构
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听swich开关状态的改变
    async userStateChanged(userInfo) {
      console.log(userInfo)
      //   调用api接口保存用户最新的状态
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('用户状态更新成功')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
