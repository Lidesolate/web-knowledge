## 1. 什么是跨域
在前端项目中,我们往往会遇到跨域问题,也就是从一个域名下请求另一个域名下的资源请求。而当这种情况发生时,通常浏览器会根据同源策略来对这些请求进行约束。这些交互通常分为三类
+ 通常允许跨域写操作(Cross-origin write)。例如链接(links),重定向以及表单提交
+ 通常允许跨域资源嵌入。例如 `img`嵌入图片,`script`标签嵌入跨域脚本。`video`和`audio`嵌入多媒体资源
+ 通常不允许跨域读操作。例如 ajax,js，DOM对象的获取
而我们通常要解决的就是第三类情况

### 1.1 为什么要有同源策略限制跨域
我们需要明白为什么要有同源策略来限制不用域之间的交互
来一个场景: 假设用户正在访问一个银行网站并且没有注销,然后用户转到另一个网站,该网站在后台运行一些恶意JavaScript代码,该代码从银行网站请求数据。由于用户仍然登陆在银行网站上,恶意代码可以做任何用户在银行网站上可以做的事情。这是因为浏览器可以根据银行网站的域名向银行网站发送和接受会话cookie。银行网站确认无误,返回用户数据。而且一切都在后台,用户感受不到
### 1.2 同源策略
**同源定义**: 如果两个页面的协议,端口(如果有指定)和域名都相同,则两个页面具有相同的源,例如对于`http://www.example.com/1.html`的同源检测
```
URL                                           说明                                  是否允许通信

http://www.example.com/2.html                 同一协议,同一域名, 不同路径             允许

https://www.example.com/2.html                不同协议                               不允许

http://www.example1.com/2.html                不同域名                               不允许

http://www.example.com:1234/2.html            不同端口                               不允许
```
### 1.3 跨域解决方案
常用跨域解决方案一般分为四种
+ 利用`docuemnt.domain`来设置相同主域,实现跨域请求
+ 利用JavaScript的apis中某些可以允许文档间直接相互引用
+ 利用同源政策来允许跨域资源嵌入的方式巧妙进行读取访问
+ 服务器代理或设置cors

1. **document.domain实现跨域访问**
应用场景在相同主域名下,不同子域跨域访问
```
父窗口: (www.example.com)

<iframe src="http://child.example.com/domain1.html" frameborder="0"></iframe>
<script>
  document.domain = 'example.com';
  var message = 'cross-domain is success';
</script>

子窗口: (www.child.example.com)

<script>
  document.domain = 'example.com';
  alert(window.parent.message);
</script>
```
注意: 

**如果页面修改了document.domain,则它包含的iframe也必须设置iframe**

**如果修改了document.domain，则在某些机器上的IE678里，获取location.href有权限异常。**

2. **window.name + iframe 实现跨域**
```
function crossName(targetUrl, proxyUrl){
  let isFirst = true;
  let iframe = document.createElement('iframe');
  iframe.src = targetUrl;
  iframe.onload = loadUrl;

  document.body.appendChild(iframe);

  function loadUrl(){
    if(isFirst){
      iframe.src = proxyUrl;
      isFirst = false;
    }else{
      const data = iframe.contentWindow.name;
      console.log(data);
      iframe.contentWindow.close();
      document.body.removeChild(iframe);
      iframe = null
    }
  }
}
crossName('http://localhost:4001/name2.html','http:localhost:4000/proxy.html')
```
注意:

**浏览器兼容性好, window.name能存储很长的值(2MB)**

3. **JSONP**

原理: 用同源策略允许跨域资源嵌入的方法,动态添加一个`script`标签,并提供处理响应数据的函数,之后在当前域名下处理传入的数据
```
function jsonp(url, data = {}, callback){
  const script = document.createElement('script');
  for(let [key, value] of Object.entries(data)){
    url += `${key}=${value}&`;
  }
  url += `callback=${callback}`
  script.src = url;
  document.body.appendChild(script);
}  

jsonp('http://localhost:4001?', {
  user: '123',
  name: '4546'
  }, 'onSuccess');

function onSuccess(data){
  console.log(data);
}

```
注意:

**只能用于get一种请求,不过可以通过增加query的方式间接实现post方法**

4. CORS

​​​cors通过服务器添加HTTP首部`Access-Control-Allow-origin`来让浏览器判断是否能够接受这个域下的资源。而面对简单请求和非简单请求的方式是不一样的。对于简单请求,浏览器直接发出CORS请求,就是在头信息之中添加一个`Origin`字段。让服务器判断是否在许可范围。
而如果是非简单请求,会先进行一次预检请求,浏览器会询问服务器当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。
```
const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');

app.use(static(__dirname));
app.use(ctx=>{
  ctx.response.set('Access-Control-Allow-Origin', 'http://localhost:4000')
  ctx.response.body = 'cross domain is success'
})
app.listen(4001);
```
5. **postMessage**
> MDN： window.postMessage() 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为https），端口号（443为https的默认值），以及主机  (两个页面的模数 Document.domain设置为相同的值) 时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

```
<iframe src="http://localhost:4001/postMessage2.html" frameborder="0" id="frame"></iframe>
<script>
  const iframe = document.querySelector('#frame');
  function post(){
    iframe.contentWindow.postMessage('收到信息', 'http://localhost:4001/postMessage2.html');
  }
  function receiveMessage(event){
      
  if(event.origin !== 'http://localhost:4001'){
    return;
  }
  console.log(event.data);
}
  iframe.onload = post
  window.addEventListener('message', receiveMessage, false);
```
