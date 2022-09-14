// 导入中间件
const {
  // gulp 注入
  src,
  // gulp 输出
  dest,
  // gulp 串行
  series,
  // gulp 并行
  parallel,
  // gulp 监听
  watch
} = require('gulp');
// 删除文件
const del = require('del');
// 处理 sass
const gulpSass = require('gulp-sass');
// 处理 less
const gulpLess = require('gulp-less');
// 压缩 css             
const gulpCssnano = require('gulp-cssnano');
// babel 【依赖 @babel/core @babel/preset-env 】          
const gulpBabel = require("gulp-babel");
// 压缩 js            
const gulpUglify = require("gulp-uglify");
// 压缩 img           
const gulpImagemin = require("gulp-imagemin");
// 压缩 html         
const gulpHtmlmin = require('gulp-htmlmin');
// 合并（添加在css/js就是合并css/js）          
const gulpConcat = require('gulp-concat');
// 静态服务           
const browserSync = require("browser-sync").create();
// 服务重启 
const reload = browserSync.reload;
// 生成 files-version.json 配置文件               
const gulpRev = require('gulp-rev');
// 编辑 files-version.json 配置文件         
const gulpJSONEditor = require("gulp-json-editor");
// 根据 files-version.json 替换 html 里面的路径 
const gulpRewRewrite = require('gulp-rev-rewrite');
// 凯撒加密偏移量 
const offset = 5;
// 引入配置文件                         
const config = require("./package.json");

//删除 dist 文件夹
const clean = () => del("./dist");

// 复制相关静态资源【包含: json , public 文件夹下静态资源 】
const staticTask = () => {
  return src(
    [
      // 相关配置地址
      'download.json',
      // 静态资源 
      'src/lib*/**/*',
      // 视频   
      'src/video*/**/*',
    ],
    {
      // 允许空文件
      allowEmpty: true,
    }
  )
    .pipe(dest('dist'));
}

// 处理 sass
const sassTask = () => {
  return src(['src/sass/*.scss'])
    .pipe(gulpSass())
    .pipe(dest('src/css/'))
}

// 处理 less
const lessTask = () => {
  return src('src/less/*.less')
    .pipe(gulpLess())
    .pipe(dest('src/css/'))
}

// 处理 css
const cssTask = () => {
  return src(['src/css/*.css'])
    // 合并压缩
    .pipe(gulpConcat('main.css'))
    // 解决重新计算z-index
    .pipe(gulpCssnano({
      zindex: false
    }))
    // 把压缩的 css 文件复制到 dist/css 文件夹内【不带 hash 值】
    .pipe(dest('dist/css/'))
}

// 处理 img
const imageTask = () => {
  return src(['src/image/*', 'src/image/**/*'])
    // 压缩 img
    .pipe(gulpImagemin())
    .pipe(dest('dist/image/'))
}

// 处理 js
const jsTask = () => {
  return src(['src/js/*.js'])
    // babel
    .pipe(gulpBabel({
      // 使用预设环境编译
      presets: [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": false,
          }
        ]
      ],
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
      // 压缩代码【默认是false】
      minified: true,
    }))
    // 压缩 js       
    .pipe(gulpUglify({
      compress: {
        // 过滤 console
        drop_console: true,
      }
    }))
    // 把压缩的 js 文件复制到 dist/js 文件夹内【不带 hash 值】          
    .pipe(dest('dist/js/'))
}

// 给 css/js/img 文件添加版本号【注意逗号之间没有空格】
const setVersion = () => {
  return src([
    'dist/*.*',
    'dist/**/*.*',
  ])
    // 给 css/js/img 文件添加 hash 值，此处不添加到文件名上，只写进配置文件
    .pipe(gulpRev())
    // 把 css/js/img 原文件和生成 hash 值的关系，写进配置文件                            
    .pipe(gulpRev.manifest("files-version.json"))
    .pipe(dest('./'))
}

// 处理版本配置文件 files-version.json
const rename = () => {
  return src("files-version.json")
    .pipe(gulpJSONEditor(function (json) {
      let tempKeys = Object.keys(json);
      let tempValues = Object.values(json);
      console.log('tempKeys', tempKeys)
      console.log('tempValues', tempValues)
      let newJson = {};
      if (tempValues.length) {
        tempValues.forEach((element, index) => {
          // 删除字符串最后一个中横线至小数点之间的数据【 gulpRev 生成的随机值】
          let name = element.replace(/\-(?!.*-).*?(?=\.)/, '');
          // 根据 key 更新 value 值
          newJson[tempKeys[index]] = config.cdn + name + '?v=' + config.version;
        });
      }
      return newJson;
    }))
    .pipe(dest("./"));
}

// 处理 html
const htmlTask = () => {
  // 配置文件
  const manifest = src('files-version.json');
  return src(['src/*.html'])
    .pipe(gulpHtmlmin({
      // 清除 HTML 注释
      removeComments: true,
      // 压缩空格             
      collapseWhitespace: true,
      // 省略布尔属性的值 <input checked="true"/> => <input checked>            
      collapseBooleanAttributes: true,
      // 删除所有空格作属性值 <input id=""> => <input>     
      removeEmptyAttributes: true,
      // 删除 <script>的 type="text/javascript"         
      removeScriptTypeAttributes: true,
      // 删除 <style>和 <link>的type="text/css"    
      removeStyleLinkTypeAttributes: true,
      // 压缩页面JS 
      minifyJS: true,
      // 压缩页面CSS                      
      minifyCSS: true
    }))
    // 压缩 html                                    
    .pipe(
      // 替换html地址
      gulpRewRewrite({ manifest })
    )
    // 输出到 Browsersync 服务目录[输出到打包目录（这里定义的是 page ）]
    .pipe(dest('dist/'));
}

// 监听文件变化
const watchFiles = () => {
  // 监听 public 文件夹变化【使用 staticTask 编译再重启服务】
  watch('src/lib/**/*', staticTask).on("change", reload);
  // 监听 scss 文件夹变化【串行先执行 sass  编译再执行 cssTask 编译最后重启服务】                   
  watch('src/sass/*.scss', series(sassTask, cssTask)).on("change", reload);
  // 监听 less 文件夹变化【串行先执行 less  编译再执行 cssTask 编译最后重启服务】 
  watch('src/less/*.less', series(lessTask, cssTask)).on("change", reload);
  // 监听 js 文件夹变化【使用 jsTask     编译再重启服务】 
  watch('src/js/*.js', jsTask).on("change", reload);
  // 监听 image 文件夹变化【使用 imageTask  编译再重启服务】                        
  watch('src/image/*', imageTask).on("change", reload);
  // 监听 css 文件夹变化【使用 cssTask    编译再重启服务】                     
  watch('src/css/*.css', cssTask).on("change", reload);
  // 监听 html 文件夹变化【使用 htmlTask   编译再重启服务】                     
  watch('src/*.html', htmlTask).on("change", reload);
  return;
}

// 创建静态服务
const server = () => {
  // browser-sync 启动静态服务
  browserSync.init({
    // 服务指向文件夹
    server: "dist",
    // 端口 
    port: 8300,
  });
  return;
}

// 默认使用 gulp 启动项目
exports.default = series(
  // 清除 dist 文件夹
  clean,
  // 并行复制静态资源，编译 sass 和 less                                    
  parallel(staticTask, sassTask, lessTask),
  // 编译 css, js, img 
  parallel(cssTask, jsTask, imageTask),
  // 根据文件生成版本号     
  setVersion,
  // 更新配置文件                               
  parallel(rename),
  // 编译 html                         
  parallel(htmlTask),
  // 监听文件变化+启动服务                       
  parallel(watchFiles, server)
);
