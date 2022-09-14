// 导入中间件
const {
  src,      // gulp 注入
  dest,     // gulp 输出
  series,   // gulp 串行
  parallel, // gulp 并行
  watch     // gulp 监听
} = require('gulp');
const del = require('del'); // 删除文件
const gulpSass            = require('gulp-sass');             // 处理 sass
const gulpLess            = require('gulp-less');             // 处理 less
const gulpCssnano         = require('gulp-cssnano');          // 压缩 css
const gulpBabel           = require("gulp-babel");            // babel 【依赖 @babel/core @babel/preset-env 】
const gulpUglify          = require("gulp-uglify");           // 压缩 js
const gulpImagemin        = require("gulp-imagemin");         // 压缩 img
const gulpHtmlmin         = require('gulp-htmlmin');          // 压缩 html
const gulpConcat          = require('gulp-concat');           // 合并（添加在css/js就是合并css/js）
const browserSync         = require("browser-sync").create(); // 静态服务
const reload              = browserSync.reload;               // 服务重启
const gulpRev        = require('gulp-rev');         // 生成 files-version.json 配置文件
const gulpJSONEditor = require("gulp-json-editor"); // 编辑 files-version.json 配置文件
const gulpRewRewrite = require('gulp-rev-rewrite'); // 根据 files-version.json 替换 html 里面的路径
const offset = 5;                         // 凯撒加密偏移量
const config = require("./package.json"); // 引入配置文件

//删除 dist 文件夹
const clean = () => del("./dist");

// 复制相关静态资源【包含: json , public 文件夹下静态资源 】
const staticTask = () => {
  return src(
    [
      './download.json',     // 相关地址
      './resource/lib/**/*', // 静态资源
      './resource/video/*',  // 视频
    ],
    { allowEmpty: true, base: '.' }
  )
  .pipe(dest('./dist/'));
}

// 处理 sass
const sassTask = () => {
  return src(['./resource/sass/*.scss'])
  .pipe(gulpSass())
  .pipe(dest('./dist/resource/css/'))
}

// 处理 less
const lessTask = () => {
  return src('./resource/less/*.less')
  .pipe(gulpLess())
  .pipe(dest('./dist/resource/css/'))
}

// 处理 css
const cssTask = () =>{
  return src(['./dist/resource/css/*.css'])
    .pipe(gulpConcat('main.css')) // 合并
    .pipe(gulpCssnano({
      zindex: false               // 解决重新计算z-index
    }))                           // 压缩 css
    .pipe(dest('./dist/resource/css/'))    // 把压缩的 css 文件复制到 dist/css 文件夹内【不带 hash 值】
}

// 处理 img
const imageTask = () => {
  return src(['./resource/image/*', './resource/image/**/*'])
  .pipe(gulpImagemin()) // 压缩 img
  .pipe(dest('./dist/resource/image/'))
}

// 处理 js
const jsTask = () =>{
  return src(['./resource/js/*.js'])
  .pipe(gulpBabel({
    presets: [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": false,
        }
      ]
    ], // 使用预设环境编译
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          "absoluteRuntime": false,
          "corejs": false,
          "helpers": false,
          "regenerator": true,
          "useESModules": false
        }
      ]
    ],
    minified: true,          // 压缩代码【默认是false】
  }))                        // babel
  .pipe(gulpUglify({
    compress: {
      drop_console: true,    // 过滤 console
    }
  }))                        // 压缩 js
  .pipe(dest('./dist/resource/js/'))  // 把压缩的 js 文件复制到 dist/js 文件夹内【不带 hash 值】
}

// 给 css/js/img 文件添加版本号【注意逗号之间没有空格】
const setVersion = () => {
  return src([
    './dist/resource/*.*',
    './dist/resource/**/*.*',
  ])
  .pipe(gulpRev())                                // 给 css/js/img 文件添加 hash 值，此处不添加到文件名上，只写进配置文件
  .pipe(gulpRev.manifest("./files-version.json")) // 把 css/js/img 原文件和生成 hash 值的关系，写进配置文件
  .pipe(dest('./'))
}

// 处理版本配置文件 files-version.json
const rename = () => {
  return src("./files-version.json")
  .pipe(gulpJSONEditor(function(json) {
    let tempKeys   = Object.keys(json);
    let tempValues = Object.values(json);
    let newJson = {};
    if(tempValues.length) {
      tempValues.forEach((element, index) => {
        name = element.replace(/\-(?!.*-).*?(?=\.)/,'');                       // 删除字符串最后一个中横线至小数点之间的数据【 gulpRev 生成的随机值】
        newJson[tempKeys[index]] = config.cdn + name + '?v=' + config.version; // 根据 key 更新 value 值
      });
    }
    return newJson;
  }))
  .pipe(dest("./"));
}

// 处理 html
const htmlTask = () => {
  const manifest = src('./files-version.json');          // 配置文件
  return src(['./view/*.html'])
  .pipe(gulpHtmlmin({
    removeComments: true,                // 清除 HTML 注释
    collapseWhitespace: true,            // 压缩空格
    collapseBooleanAttributes: true,     // 省略布尔属性的值 <input checked="true"/> => <input checked>
    removeEmptyAttributes: true,         // 删除所有空格作属性值 <input id=""> => <input>
    removeScriptTypeAttributes: true,    // 删除 <script>的 type="text/javascript"
    removeStyleLinkTypeAttributes: true, // 删除 <style>和 <link>的type="text/css"
    minifyJS: true,                      // 压缩页面JS
    minifyCSS: true                      // 压缩页面CSS
  }))                                    // 压缩 html
  .pipe(gulpRewRewrite({ manifest }))    // 替换html地址
  .pipe(dest('./dist/'));                // 输出到 Browsersync 服务目录[输出到打包目录（这里定义的是 page ）]
}

// 监听文件变化
const watchFiles = () => {
  watch('./resource/lib/**/*', staticTask).on("change", reload);                   // 监听 public 文件夹变化【使用 staticTask 编译再重启服务】
  watch('./resource/sass/*.scss', series(sassTask, cssTask)).on("change", reload); // 监听 scss   文件夹变化【串行先执行 sass  编译再执行 cssTask 编译最后重启服务】
  watch('./resource/less/*.less', series(lessTask, cssTask)).on("change", reload); // 监听 less   文件夹变化【串行先执行 less  编译再执行 cssTask 编译最后重启服务】
  watch('./resource/js/*.js', jsTask).on("change", reload);                        // 监听 js     文件夹变化【使用 jsTask     编译再重启服务】
  watch('./resource/image/*', imageTask).on("change", reload);                     // 监听 image  文件夹变化【使用 imageTask  编译再重启服务】
  watch('./resource/css/*.css', cssTask).on("change", reload);                     // 监听 css    文件夹变化【使用 cssTask    编译再重启服务】
  watch('./view/*.html', htmlTask).on("change", reload);                  // 监听 html   文件夹变化【使用 htmlTask   编译再重启服务】
  return;
}

// 创建静态服务
const server = () => {
  browserSync.init({
    server: "./dist", // 服务指向文件夹
    port: 8300,       // 端口
  });                 // browser-sync 启动静态服务
  return;
}

// 默认使用 gulp 启动项目
exports.default = series(
  clean,                                    // 清除 dist 文件夹
  parallel(staticTask, sassTask, lessTask), // 并行复制静态资源，编译 sass 和 less
  parallel(cssTask, jsTask, imageTask),     // 编译 css, js, img
  setVersion,                               // 根据文件生成版本号
  parallel(rename),                         // 更新配置文件
  parallel(htmlTask),                       // 编译 html
  parallel(watchFiles, server)              // 监听文件变化+启动服务
);
