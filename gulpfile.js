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
const autoprefixer        = require('gulp-autoprefixer');     // 添加 css 兼容前缀
const gulpCssnano         = require('gulp-cssnano');          // 压缩 css
const gulpBabel           = require("gulp-babel");            // babel 【依赖 @babel/core @babel/preset-env 】
const gulpJshint          = require('gulp-jshint');           // 检测 js 【依赖 jshint 】
const gulpUglify          = require("gulp-uglify");           // 压缩 js
const gulpImagemin        = require("gulp-imagemin");         // 压缩 img
const gulpHtmlmin         = require('gulp-htmlmin');          // 压缩 html
const browserSync         = require("browser-sync").create(); // 静态服务
const reload              = browserSync.reload;               // 服务重启
const gulpRev        = require('gulp-rev');         // 生成 files-version.json 配置文件
const gulpJSONEditor = require("gulp-json-editor"); // 编辑 files-version.json 配置文件
const gulpRewRewrite = require('gulp-rev-rewrite'); // 根据 files-version.json 替换 html 里面的路径
const offset = 5;                         // 凯撒加密偏移量
const config = require("./package.json"); // 引入配置文件

// 凯撒加密
function do_encrypt(key, plain) {
  var ctext = "";
  key = Number(key);
  plain = String(plain);
	for(var i = 0; i < plain.length; i++) {
		var pcode = plain.charCodeAt(i);
		var ccode = pcode;
		if(pcode >= 65 && pcode <= 90) {
			ccode = ((pcode - 65) + key * 1) % 26 + 65;
		}
		if(pcode >= 97 && pcode <= 122) {
			ccode = ((pcode - 97) + key * 1) % 26 + 97;
		}
		ctext += String.fromCharCode(ccode);
  }
	return ctext;
}

//删除 dist 文件夹
const clean = () => del("./dist");

// 复制相关静态资源【包含: json , public 文件夹下静态资源 】
const staticTask = () => {
  return src(
    [
      './tt.json',           // 白名单+下载地址
      './static/public/**/*' // 静态资源
    ],
    { allowEmpty: true, base: '.' }
  )
  .pipe(dest('./dist/'));
}

// 处理 sass
const sassTask = () => {
  return src(['./static/sass/*.scss', '!./static/sass/base.scss'])
  .pipe(gulpSass())
  .pipe(dest('./static/css/'))
}

// 处理 less
const lessTask = () => {
  return src('./static/less/*.less')
  .pipe(gulpLess())
  .pipe(dest('./static/css/'))
}

// 处理 css
const cssTask = () =>{
  return src(['./static/css/*.css', '!./static/css/base.css'])
  .pipe(autoprefixer())             // 格式化
  .pipe(gulpCssnano({
    zindex: false                   // 解决重新计算z-index
  }))                               // 压缩 css
  .pipe(dest('./dist/static/css/')) // 把压缩的 css 文件复制到 dist/css 文件夹内【不带 hash 值】
}

// 处理 img
const imageTask = () => {
  return src(['./static/images/*', './static/images/**/*'])
  .pipe(gulpImagemin()) // 压缩 img
  .pipe(dest('./dist/static/images/'))
}

// 处理 js
const jsTask = () =>{
  return src(['./static/js/*.js'])
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
  .pipe(gulpJshint())        // 检测 js
  .pipe(gulpUglify({
    compress: {
      drop_console: true,    // 过滤 console
    }
  }))                        // 压缩 js
  .pipe(dest('./dist/static/js/'))  // 把压缩的 js 文件复制到 dist/js 文件夹内【不带 hash 值】
}

// 加密 js
const encryptJsTask = () => {
  return src('./static/dist/js/*.js')
  .on('data', function(file){
    if(file.basename !== 'base.js' && file.contents) {
      const newString = new Buffer.from(file.contents, 'utf-8').toString(); // 把 buffer 转换成字符串
      const encrypt = do_encrypt(offset, newString);                        // 把字符串使用凯撒加密算法进行加密
      const spliceEncrypt = `eval(do_decrypt(5,\'` + encrypt + `\'));`;     // 在加密文件外面添加解密方法
      const newBuffer = new Buffer.from(spliceEncrypt);                     // 把包含解密算法的加密文件转成 buffer 文件
      file.contents = newBuffer;
      return file;
    }
  })
  .pipe(dest('./static/dist/js/'))
}

// 给 css/js/img 文件添加版本号【注意逗号之间没有空格】
const setVersion = () => {
  return src([
    './dist/*.*',
    './dist/**/*.*',
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
  return src(['./pages/*.html'])
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
  .pipe(dest('./dist/page/'))            // 输出到打包目录（这里定义的是 page ）
  .pipe(dest('./dist/'));                // 输出到 Browsersync 服务目录
}

// 监听文件变化
const watchFiles = () => {
  watch('./static/public/**/*', staticTask).on("change", reload);                // 监听 public 文件夹变化【使用 staticTask 编译再重启服务】
  watch('./static/sass/*.scss', series(sassTask, cssTask)).on("change", reload); // 监听 scss   文件夹变化【串行先执行 sass  编译再执行 cssTask 编译最后重启服务】
  watch('./static/less/*.less', series(lessTask, cssTask)).on("change", reload); // 监听 less   文件夹变化【串行先执行 less  编译再执行 cssTask 编译最后重启服务】
  watch('./static/js/*.js', jsTask).on("change", reload);                        // 监听 js     文件夹变化【使用 jsTask     编译再重启服务】
  watch('./static/images/*', imageTask).on("change", reload);                    // 监听 image  文件夹变化【使用 imageTask  编译再重启服务】
  watch('./static/css/*.css', cssTask).on("change", reload);                     // 监听 css    文件夹变化【使用 cssTask    编译再重启服务】
  watch('./pages/*.html', htmlTask).on("change", reload);                       // 监听 html   文件夹变化【使用 htmlTask   编译再重启服务】
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
  encryptJsTask,                            // 加密 js
  parallel(rename),                         // 更新配置文件
  parallel(htmlTask),                       // 编译 html
  parallel(watchFiles, server)              // 监听文件变化+启动服务
);
