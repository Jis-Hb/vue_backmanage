<template>
  <div class="home-content">
    <el-button @click="back" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
