<template>
    <header :class="$style.mainHeader">
      <!-- 使用cssModules编译的类名-->
        <h1>Todo</h1>
    </header>
</template>

<script>
export default {
  computed:{
    // vue-loader配置文件中，cssModules的运行机制
    // $style(){
    //   return{
    //     mainHeader:''// 生成一个mainHeader的属性，其值是cssModules配置的，该文件独有的class名
    //     // 与scope的区别:可以自定class名称，开发时可以很快定义到class名所在处，而正式环境中去掉前面的路径，又能保证私密性
    //   }
    // }
  }
}
</script>

<style lang="stylus" module>
// 使用cssModules，要把scope改为module
.main-header
    text-align center
    h1
        font-size 100px
        color rgba(175,47,47,0.4)
        font-weight 400
        margin 20px
</style>
