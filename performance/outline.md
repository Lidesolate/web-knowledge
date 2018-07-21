## web性能优化

### 编码优化

#### 数据读取速度

+ 字面量与局部变量的访问速度最快,数组元素和对象成员相对较慢
+ 变量从局部作用域到全局作用的搜索过程越长速度越慢
+ 对象嵌套的越深,读取速度就越慢
+ 对象在原型链中存在的位置越深,找到它的速度就越慢

推荐做法是缓存对象成员值,将对象成员值缓存到局部变量中会加快访问速度

#### DOM

应用在运行时,性能的平静主要在于DOM操作的代价非常昂贵,下面列出一些有关于DOM操作相关提升性能的建议

+ 在JS中对DOM进行访问的代价非常高,请尽可能减少访问DOM的次数(建议缓存DOM属性和元素,把DOM集合的长度缓存到变量中并在迭代中使用,读变量比读DOM的速度要快很多)
+ 重排与重绘的代价非常昂贵。如果操作需要进行多次重排与重绘,建议先让元素脱离文档流,处理完毕再让元素回归文档流,这样浏览器只会进行两次重排与重绘(脱离时和回归时)
+ 善于使用事件委托

#### 流程控制

+ 避免使用`for...in`(他能枚举到原型,所以很慢)
+ 在JS中倒序循环会略微提升性能
+ 减少迭代的次数
+ 基于循环的迭代比基于函数的迭代快8倍
+ 用Map表代替大量的`if-eles`和`switch`会提升性能

### 静态资源优化

#### 使用`Brotil`或`Zopfli`进行纯文本压缩

在最高级别的压缩下`Brotil`会非常慢(但较慢的压缩最终会得到更高的压缩率)以至于服务器在等待动态资源压缩的事件会抵消掉高压缩率带来的好处,但他非常适合静态文件压缩,因为它的解压速度很快

#### 图片优化

+ 尽可能通过`srcset`,`sizes`和`<picture>`元素使用响应式图片。还可以通过`<picture>`元素使用Webp格式的图像
+ 模糊图片中不重要的部分以减小文件大小,使用自动播放与循环的HTNL5视频替换GIF图,因为视频比GIF还小,因为视频比GIF文件还小

### 交付优化

#### 异步无阻塞加载JS

JS的加载与执行会阻塞页面渲染,可以将script标签放到页面的最底部。但是更好的做法是异步无阻塞加载JS。有多种无阻塞加载JS的方法: `defer`和`async`,动态创建`script`标签,使用XHR异步请求JS代码并注入到页面

更推荐的做法是使用`defer`或`async`。如果使用`defer`或`async`,如果使用`defer`或`async`请将script标签放到`head`标签中,以便浏览器更早的发现

#### 使用`Intersection Observer`实现懒加载

懒加载是一个比较常用的性能优化收端,下面列出了一些常用的做法

+ 可以通过`Intersection Observer`延迟加载图片,视频,广告脚本,或任何其他资源
+ 可以先加载低质量或模糊的图片,当图片加载完毕后在使用完整版图片替换他

#### 优先加载关键的CSS

CSS资源的加载对浏览器渲染的影响很大,默认情况下浏览器只有在完成`<head>`标签中CSS的加载与解析之后才会渲染页面。如果CSS文件很大,用户需要等待很长的事件才能看到渲染结果。针对这种情况可以将首屏渲染必须用到的CSS提取出来内嵌到`<head>`中,然后再将剩余部分的CSS用异步的方式加载,可以通过Critical做到这一点。

#### 资源提示

Resource Hints定义了HTML中的Link元素与`dns-prefetch`,`preconnect`,`prefetch`与`prerender`之间的关系。他可以帮助浏览器决定应该连接到那些资源,以及应该获取与预处理那些资源来提升页面性能。

##### dns-prefetch

`dns-prefetch`可以指定一个用于获取资源所需的源,并提示浏览器应该尽可能早的解析。

```
<link rel="dns-prefetch" href="//example.com">
```

##### preconnect

`preconnect`用于启动预链接,其中包含DNS查找,TCP握手,以及可选的TLS协议,允许浏览器减少潜在的建立连接的开销

```
<link rel="preconnect" href="//example.com">
<link rel="preconnect" href="//cdn.example.com" crossigin>
```

##### prefetch

`prefetch`用于标识下一个导航可能需要的资源,浏览器会获取该资源,一旦将来请求该资源,浏览器可以提供更快的响应

```
<link rel="prefetch" href="//example.com/next-page.html" as="html" crossorigin="use-credntials">
<link rel="prefetch" href="/library.js" as="script">
```

##### prerender

`preender`用于标识下一个导航可能需要的资源。浏览器会获取并执行,一旦将来请求该资源,浏览器可以提供更快的响应
```
<link rel="prerender" href="//example.com/next-page.html">
```
浏览器会预加载页面相关的资源并执行来预处理HTML响应

##### preload

通过一个现有元素(例如: `img`, `script`, `link`)声明资源会将获取与执行耦合在一起。然而应用可能只是想要先获取资源,当满足某些条件时在执行资源

preload提供了获取资源的能力,可以将获取资源的行为从资源执行中分离出来,因此preload可以构建自定义的资源加载与执行

例如,应用可以使用preload进行CSS资源的预加载,并且同时具备: 高优先级,不阻塞渲染等特性,然后应用程序在合适的时间使用CSS资源

```
<!-- 通过声明性标记预加载 CSS资源 -->
<link rel="preload" href="/style/other.css" as="style">

<!-- 或，通过JavaScript预加载 CSS 资源 -->

<script>

var res = document.createElement("link");

res.rel = "preload";

res.as = "style";

res.href = "styles/other.css";

document.head.appendChild(res);

</script>

<!-- 使用HTTP头预加载 -->

Link: <https://example.com/other/styles.css>; rel=preload; as=style
```

##### 快速响应的用户界面

JS执行100毫秒以上用户就会明显觉得网页变卡了,所以要严格限制每个JS任务执行时间不能超过100毫秒

解决方案是可以将一个大人物拆分成多个小任务分布在不同的`macrotask`中执行,或者适应WebWorkers,他可以在UI线程外执行

### 构建优化

#### 使用Tree-shaking, Scope hoisting, Code-splitting

Tree-shaking是一种在构建过程中清除无用代码的技术。使用Tree-shaking可以减少构建后文件的体积

`Scope Hoisting`的原理是检查`import`链,并尽可能地将散乱地模块放到一个函数中,前提是不能造成代码冗余。所以只有被引用了一次才会被合并。使用`Scope Hoisting`可以让可以让代码体积更小并且可以降低代码在运行时的内存开销,同时运行速度更快.

`code-splitting`是Webpack中最引人注目的特性之一。此特性能够把代码分离到不同的`bundle`中，然后可以按需加载或并行加载这些文件。`code-splitting`可以用于获取更小的bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

#### 使用`import`函数动态导入模块

使用`import`函数可以运行时动态的加载ES2015模块,从而实现按需加载的需求。

#### 使用HTTP缓存头

正确设置`exprise`,`cache-control`和其他HTTP缓存头

推荐使用`Cache-control immutable`避免重新验证。
