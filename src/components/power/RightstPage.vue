<template>
    <div>
        <!-- m面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card >
        <el-table :data="rightList" border>
            <el-table-column label='＃' type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                <el-tag  type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
                <el-tag  type="danger" v-else>三级权限</el-tag>
              </template>
            </el-table-column>
        </el-table>
    </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
    // 权限列表
      rightList: []
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.rightList = res.data
      console.log(this.rightList)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
