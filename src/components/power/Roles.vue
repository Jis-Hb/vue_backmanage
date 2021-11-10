<template>
  <div class="Roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="open">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRighById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for循环嵌套 渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag closable @close="removeRighById(scope.row, item2.id)" type="success">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeRighById(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre></pre>
          </template>
        </el-table-column>

        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
        <el-table-column align="center" label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="push(scope.row)"
              >编辑</el-button
            ><el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteroles(scope.row.id)"
              >删除</el-button
            ><el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog @close="addpushClosed" title="添加角色" :visible.sync="pushVisible" width="40%">
      <el-form :rules="jueseRules" :model="jueseList" ref="jueseRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="jueseList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="jueseList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushVisible = false">取 消</el-button>
        <el-button type="primary" @click="pushVisiclick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog @close="addroleClosed" title="修改角色" :visible.sync="roleVisible" width="50%">
      <el-form :rules="jueseRules" :model="roleList" ref="rolesRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleListClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除角色 -->
    <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
      <span>确认删除吗！将永久删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isdelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->

    <el-dialog
      @close="setRightDialogClosed"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        show-checkbox
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色的列表数据
      rolelist: [],
      pushVisible: false,
      jueseList: {},
      jueseRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '角色名称长度在2~8个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 15, message: '角色描述长度在1~15个字符之间', trigger: 'blur' }
        ]
      },
      roleVisible: false,
      roleList: {},
      deleteVisible: false,
      deleteID: 0,
      // 控制分配权限对话框
      setRightDialogVisible: false,
      // 所有权限的数组
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值
      defKeys: [],
      // 即将分配权限的ID
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 根据id删除对应的权限
    async removeRighById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data
      console.log(this.rightsList)
      // 递归获取三级节点的id
      console.log(role)

      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.rolelist = res.data
    },
    addpushClosed() {
      this.$refs.jueseRef.resetFields()
    },
    addroleClosed() {},
    open() {
      this.pushVisible = true
    },
    async pushVisiclick() {
      const { data: res } = await this.$http.post('/roles', this.jueseList)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加失败')
      this.getRoleList()
      this.$message.success('添加成功')
      this.pushVisible = false
    },
    push(value) {
      this.roleList = value
      this.roleVisible = true
    },
    async roleListClick() {
      this.$refs.rolesRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`/roles/${this.roleList.id}`, this.roleList)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.getRoleList()
        this.$message.success('修改成功')
        this.roleVisible = false
      })
    },
    deleteroles(id) {
      this.deleteVisible = true
      this.deleteID = id
    },
    async isdelete() {
      const { data: res } = await this.$http.delete(`/roles/${this.deleteID}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功!')
      this.deleteVisible = false
      this.getRoleList()
    },
    // 通过递归的形式获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed() {
      // 监听分配权限对话框的关闭事件
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(this.roleId)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      console.log(res)
      if (res.meta.status !== 200) return this.$message('分配权限失败')

      this.$message.success('分配成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
