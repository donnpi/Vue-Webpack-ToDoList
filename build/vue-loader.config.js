module.exports = (isDev) => {
    return {
        // 把template标签中文字后面的空格去掉
        preserveWhitespace: true,
        // 根据ExtractPlugin把所有css单独打包一个的文件里，整个应用的所有样式都是到一起一次性加载的
        // 如果没有这么设置，vue会自己采用异步加载模块的方法，每个模块的css只有在那个模块需要被显示时才加载，可以提高首屏加载的速度
        extractCSS: !isDev, //开发环境下不需要
        cssModule: {},
        // hotReload: false //热重载是否开启会自动根据环境变量切换
        // loader:{}, //vue可自定义模块（js/html/style以外的），并在此配置相应的loader，默认的模块也可指定对应模块
        // preLoader:{}, //在使用vue指定的loader，如js使用babel-loader前，现在这里解析 如使用TS时
        // postLoader:{}
    }
}