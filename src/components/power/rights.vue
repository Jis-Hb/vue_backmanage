<template>
  <div class="rights-content">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" label="权限名称" prop="authName"></el-table-column>
        <el-table-column align="center" label="路径" prop="path"></el-table-column>
        <el-table-column align="center" label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights-contents',
  data() {
    return {
      // 所有权限列表
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')

      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped></style>
