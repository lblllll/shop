<template>
    <div>
     <!-- m面包屑导航区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图 -->
    <el-card >
       <el-row>
        <er-col>
            <el-button type="primary">添加用户</el-button>
        </er-col>
       </el-row>
       <!-- 角色列表区域 -->
       <el-table :data="rolusList" border stripe >
        <!-- 这是展开列 -->
        <el-table-column  type="expand">
            <!--  eslint-disable-next-line -->
            <template slot-scope="scope">
                <el-row   type="flex" justify="center" align="middle" :class="['bdbottom', i1 === 0? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                    <!-- 渲染一级权限 -->
                    <el-col :span="5">
                        <el-tag closable  @close="removeRolusById(scope.row,item1.id)">
                            {{item1.authName}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二级和三级权限 -->
                    <el-col :span = '19'>
                         <!-- 通过for循环嵌套渲染二级权限 -->
                         <!--  eslint-disable-next-line -->
                        <el-row  :class="[i2 ===0? '' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                            <el-col :span="6">
                                <el-tag type="success" closable  @close="removeRolusById(scope.row,item2.id)">
                                    {{item2.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="18" >
                                <!--  eslint-disable-next-line -->
                                <el-tag type="danger"  v-for="(item3,i3) in item2.children" :key="item3.id" closable  @close="removeRolusById(scope.row,item3.id)">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>

                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <!-- 这是索引列 -->
            <el-table-column label='＃' type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="350px" >
                <!--  eslint-disable-next-line -->
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
                <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 这是分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="showSetRightDialogVisible"
  width="50%" @close="guanbi()">
  <!-- 树形控件 -->
  <el-tree show-checkbox :data="rightList" :props="treeProps" node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
export default {
  data() {
    // 角色列表数据
    return {
      rolusList: [],
      //   这是所有权限的数据
      rightList: [],
      // 控制分配对话框的显示与隐藏
      setRightDialogVisible: false,
      treeProps: {
        // 看到的值
        label: 'authName',
        // 说明父子节点通过什么属性来嵌套的
        children: 'children'
      },
      //   默认选中的节点id值数组
      defKeys: [],
      //   当前即将分配权限的id
      roleId: ''
    }
  },
  created() {
    // 获取所有的角色列表
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.rolusList = res.data
    },
    // 根据id删除对应的权限
    async removeRolusById(role, rightId) {
    // 首先提示客户是否删除
      const confirmResult = await this.$confirm('是否删除该权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('用户取消删除')
      }
      console.log('用户删除ok')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      //   注意这里如果调用更新列表辉重新渲染一次页面，但是data中已经包含最新的数据，所以只要吧res.data赋值给role.children就可以了
      role.children = res.data
    },
    // 这是展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 先获取所有的权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      //   把获取打欧帝尔权限数据保存到data中
      this.rightList = res.data
      console.log(this.rightList)
      //   递归获取三级权限的id,这里相当于调用该归函数
      this.getLeafKeys(role, this.defKeys)
      this.showSetRightDialogVisible = true
    },
    // 利用递归，获取角色三级权限的id，并且保存到defKeys中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      // 利用递归循环node里所有数组
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框关闭
    guanbi() {
      this.defKeys = []
    },
    // 点击确定按钮为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getUserList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
    margin: 10px;
    margin-left: 47px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
</style>
