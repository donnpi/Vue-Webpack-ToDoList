
# 项目搭建文档(每步代码配置带有详细注释)

### 1.1 项目基本配置

## 初始化一个npm项目 npm init

## webpack
webpack用于将不同类型静态资源，打包成一个js，在html引用时可以运行
优点：
1. 把所有零碎的js打包在一起，减少了http请求
2. 利于模块化的实现
3. 可以加载前端的所有资源（图片/css等）

## webpack配置文件：
1. 设置编译入口entry：声明我们的入口文件，如index.js
index.js是啥:
很多文件类型如.vue不能被浏览器编译，不能直接挂载到html中去的,需要在index.js中挂载再由webpack编译
2. 设置编译出口output：出口文件名（bundle.js）以及存放路径

webpack.config.js同样设置出口文件bundle.js及存放路径

## 设置脚本
在package.json中配置build脚本
--config 指定打包时调用的webpack配置文件，否则将会调用全局的webpack，使用默认的打包方式

### 1.2 静态资源的加载
webpack只能处理js文件,且只识别ES5的语法。当有其他格式的文件时，需要在module中配置rules规则，为不同文件指定对应loader，处理完之后可以直接在js代码里import

### 1.3 webpack-dev-server的配置
webpack-dev-server和webpack用的是同一个配置文件，但在开发环境中会带来不同的效果
```
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server --config webpack.config.js"
```
由于开发环境和生产环境都使用一个配置文件，那么需要设置一个环境变量，是配置文件可以根据不同的环境变量，来返回不同的配置项
不同的平台（linux/window/mac）中设置环境变量的方式不同，为了兼容可以安装cross-env
```
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
```
在webpack.config.js配置好测试环境后，还需要引入一个html-webpack-plugin，用于将打包好后的js挂载到一个html中，才能在网页中显示。

完成webpack.config.js中后,你便可以使用npm run dev见证奇迹的时刻了

## 项目业务
详见源码

## 配置css单独分离打包及其他一些测试和生产环境的区别
安装extract-text-webpack-plugin
npm i extract-text-webpack-plugin@3.0.2

## 打包类库代码及hash优化

##### 开始项目
进入项目目录
    npm run dev

