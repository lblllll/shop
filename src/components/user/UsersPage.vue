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
      <el-input placeholder="请输入内容">
      <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <!-- 这是添加按钮 -->
      <el-col :span="4">
        <el-button type="primary">添加用户</el-button>
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
  </div>
</template>
<!-- 行为区域 -->
<script>
export default {
  data() {
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
      total: 0
    }
  },
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
    userStateChanged(userInfo) {
      console.log(userInfo)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
