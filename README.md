# koa-server-static
Koa 静态文件服务中间件,可以根据不同设备(pc端，移动端)动态获取资源

该中间件由[`coderlibs `](http://coderlibs.com)官方出品

## Installation
```bash
$ npm install koa-server-static
```

## API

```js
const Koa = require('koa');
const app = new Koa();
app.use(require('koa-server-static')(root, opts)); // 获取静态资源
app.listen(8080, () => {
    console.log('Server is running at http://localhost:' + port);
});
```
## Options
- facility 代表设备类型，不设置则代表不区分,值可传 pc | md
- maxage 浏览器缓存的最大年龄（以毫秒为单位）。默认为 0
- hidden 允许传输隐藏文件。默认为false
- index 默认文件名，默认为 'index.html'
- defer 如果为 true，则在 之后服务return next()，允许任何下游中间件首先响应。
- gzip 当客户端支持 gzip 并且请求的扩展名为 .gz 的文件存在时，尝试自动提供文件的 gzip 版本。默认为真。
- brotli 当客户端支持 brotli 并且请求的扩展名为 .br 的文件存在时，尝试自动提供文件的 brotli 版本（注意，brotli 只能通过 https 接受）。默认为真。
- setHeaders 函数在响应中设置自定义标头。
- extensions 当 URL 中没有足够的扩展名时，尝试从传递的数组中匹配扩展名来搜索文件。首先找到的服务。（默认为false）

## 示例1 facility
```js
const Koa = require('koa');
const app = new Koa();
const static = require('koa-server-static');
const path = require('path');
// facility代表设备类型，不设置则代表不区分
app.use(static(path.join(__dirname + '/public/pc'),{facility:'pc'})); // 当设备为电脑端时(Personal Computer)获取端静态资源

app.use(static(path.join(__dirname + '/public/app'),{facility:'md'})); // 当设备为手机端时(Mobile Device)获取端静态资源
