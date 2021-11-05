<template>
  <el-container class="home-content">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="left">{{ isCollapse ? '后台管理' : '炸毛小焦管理系统' }}</div>
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 侧边栏菜单 -->
      <el-menu
        :unique-opened="true"
        :collapse-transition="false"
        background-color="#4a525a"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        router
        :default-active="activePath"
      >
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconsObj[item.id]"></i>
            <!-- 文本 -->
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subitem.path"
            v-for="subitem in item.children"
            :key="subitem.id"
            @click="saveNavState('/' + subitem.path)"
          >
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subitem.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-button class="right" @click="back" type="info">退出</el-button>

        <div class="images">
          <img src="../../assets/img/logo.jpg" alt="" />
        </div>
      </el-header>
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',

  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-content {
  height: 100%;
}
.el-header {
  background-color: #2c2c2c;
  .images {
    float: right;
    width: 60px;
    margin-right: 10px;
    border-radius: 50%;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .right {
    float: right;
    margin-top: 10px;
  }
}
.el-aside {
  background-color: #4a525a;

  .left {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: #fff;
    font-size: 16px;
    text-align: center;
  }
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #3b4248;

    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
