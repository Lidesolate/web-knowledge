## web安全

### XSS

XSS的原理是恶意攻击者往Web页面里插入恶意可执行网页脚本代码,当用户浏览该页面时,嵌入其中的Web里面的脚本代码会被执行,从而可以达到攻击者盗取用户信息或其他侵犯用户安全隐私的目的。XSS的攻击方式一般分为以下几种类型

1. 非持久性XSS:

非持久性XSS漏洞,也叫反射型XSS漏洞,一般是通过别人发送带有恶意脚本代码参数的URL,当URL地址被打开时,特有的恶意代码参数被HTML解析,执行

例如:

```
<select>
  <script>
    document.write(''
      + '<option value=1>'
      + location.href.substring(location.href.indexOf('default=') + 8)
      + '</option>'
    );
    document.write('<option value=2>English</option>');
  </script>
</select>
```

攻击这可以直接通过URL(`http://example.com?default=<script>alert</script>`)

非持久性XSS漏洞攻击有以下特点特征:

+ 即时性,不经过服务器存储,直接通过HTTP的GET和POST请求就能完成一次攻击,拿到用户隐私数据
+ 攻击者需要诱骗点击
+ 反馈率低,所以较难发现和响应修复
+ 盗取用户敏感保密信息


为了防止出现非持久性XSS漏洞,需要确保这么几件事情:

+ WEB页面渲染的所有内容或者渲染的数据都必须来自于服务端
+ 尽量不要从`URL`,`document.referrer`,`document.forms`等这种DOM API中获取数据直接渲染
+ 尽量不要使用`eval`,`new Function`,`document.write()`,`document.writeln()`,`window.setInterval()`,`window.setTimeout()`,`innerHTML`,`document.createElement()`等可执行字符串的方法
+ 如果做不到以上几点,也必须对涉及DOM渲染的方法传入的字符串参数做escape转义
+ 前端渲染的时候对任何字段都需要做escape转义编码

> escape转义的目的是将一些构成HTML标签的元素转义比如`<`, `>`, `空格`等,转义成`&lt;`,`&gt;`,`&nbsp;`等显示转义字符

2. 持久型XSS

持久性XSS漏洞,也被称为存储型XSS漏洞,一般存在于Form表单提交等交互功能,如发帖留言,提交文本信息等,黑客利用的XSS漏洞,将内容经正常功能提交进入数据库持久保存,当前端页面获得后端从数据中读出的注入代码时,恰好将其渲染执行

主要注入页面方式和非持久型XSS漏洞类似,只不过持久型的不是类源于URL,refferer,forms等,而是来源于后端从数据库中读出来的数据。持久型XSS攻击不需要诱骗点击,黑客只需要在提交表单的地方完成注入即可,但是这种XSS攻击的成本相对还是很高。攻击成功需要同时满足以下几个条件；

+ POST请求提交表单后端没做转义直接入库

+ 后端从数据库中取出数据没做转义直接输出给前端

+ 前端拿到后端数据没做转义直接渲染成DOM

持久性XSS有以下几个特点:

+ 持久性,植入在数据库中

+ 危害面广,甚至可以让用户及其变成DDoS攻击的肉鸡

+ 前端在渲染页面DOM的时候应该选择不相信任何后端数据,任何字段都需要做转义处理

3. 基于字符集的XSS

其实现在很多的浏览器以及各种开源库都专门针对了XSS进行转义处理,尽量默认抵御绝大多数XSS攻击,但是还是有很多方式都可以绕过转义规则,让人防不胜防,比如基于字符集的XSS攻击,就是绕过这些转义处理的一种攻击方式,比如有些Web页面字符集不固定,用户输入非期望字符集的字符,有时会绕过转义过滤规则

以基于utf-7的XSS为例
utf-7是可以将所有的unicode通过7bit来表示的一种字符集(但现在已经从Unicode规格中移除)
这个字符集为了通过7bit来表示所有文字,除去数字和一部分的符号,其他的符号都将以base64编码为基础的方式呈现

```
<script>alert('xss')</script>
```
可以形成基于字符集的XSS攻击的原因是由于浏览器在`meta`没有指定`charset`的时候有自动识别编码的机制,所以这类攻击通常就是发生在没有指定或者没来得及指定`meta`标签的`charset`的情况下。

所以我们有什么办法避免这种XSS呢

+ 记住指定`<meta charset="utf-8">`

+ XML中不仅要指定字符集为utf-8,而且标签要闭合

4. 未经验证的跳转XSS

有一些场景是后端需要对一个传进来的待跳转的URL参数进行一个302跳转,可能其中会带有一些用户的敏感信息。如果服务器端做302跳转,跳转的地址来自用户的输入,攻击者可以输入一个恶意的跳转地址来执行脚本。解决的方式是:

+ 对待跳转的URL参数做白名单或者某种规则过滤

+ 后端注意对敏感消息的保护,比如`cookie`使用来源验证

### CSRF

CSRF即跨站请求伪造攻击,那么CSRF到底能够干嘛呢,攻击者可以盗用你的登陆信息,以你的身份模拟发送各种请求,攻击者只要借助少许的社会工程学的轨迹,例如通过QQ等聊天软件发送的链接(有些还伪装成短域名,用户无法分辨),攻击者就能迫使Web应用的用户去执行攻击者预设的操作。例如,当用户登陆网络银行去查看器存款余额,在它没有退出时,就点击了一个QQ好友发来的链接,那么该用户银行账户中的资金就有可能被转移到攻击者指定的账户中。

所以遇到CSRF攻击时,将对终端用户的数据和操作指令构成严重的威胁。当受攻击的终端用户具有管理员账户的时候,CSRF将危及整个Web应用程序

#### CSRF原理

![](https://zoumiaojiang.com/article/common-web-security/csrf.jpg)

可以理解为有一个小偷在你配钥匙的地方得到了你家的钥匙,然后拿着要是去你家想偷什么偷什么

完成CSRF攻击必须要有三个条件:

1. 用户已经登陆了站点A,并在本地记录了`cookie`

2. 在用户没有登出站点A的情况下(也就是cookie生效的情况下),访问了恶意攻击提供的引诱危险站点B(B站点要求访问站点A)

3. 站点A没有任何CSRF防御

#### 预防CSRF

CSRF的防御可以从服务器和客户端两方面着手,防御效果是从服务端着手效果比较好,现在一般的CSRF也都在服务端进行。服务端的预防CSRF攻击的方式方法有多种,但思路上都是差不多的,主要从以下两个方面入手:

+ 正确使用GET,POST请求和`cookie`

+ 在非GET请求中增加Token

一般而言,普通的Web应用都是以GET,POST请求为主,还有一种请求时`cookie`方式。我们一般都是按照如下规则设计应用的请求:

+ GET请求常用在查看,列举,展示等不需要改变资源属性的时候(数据库`query`查询的时候)

+ POST请求常用在From表单提交,改变一个资源的属性或者做其他一些事情(数据库有`insert`,`update`,`delete`的时候)

当正确的使用了GET和POST请求之后,剩下的就是非GET方式的请求中增加随机数,这个大概有三种方式来进行

+ 为每个用户生成一份唯一的cookie token,所有表单都包含同一个伪随机值,这种方案最简单。因为攻击者不能获得第三方的`cookie`,所以表单中的数据也就构造失败,但是由于用户的`cookie`很容易由于网站的XSS漏洞而被盗取,所以这个方案必须要在没有XSS的情况下才安全。

+ 每个POST请求使用验证码,这个方案算是比较完美的,但是需要用户多次输入验证码,用户体验比较差,所以不适合在业务中大量使用

+ 渲染表单的时候,为每一个表单包含一个cerfToken,提交表单的时候,带上csrfToken,然后在后端做csrfToken验证

### SQL注入

造成SQL注入的原因是因为程序没有有效的转义过滤用户的输入,使攻击者成功的向服务器提交恶意的SQL查询代码,程序在接收后错误的将攻击者的输入作为查询语句的一部分执行,导致原始的查询逻辑被改变,额外的执行了攻击者精心构造的恶意代码

#### SQL注入原理

考虑以下简单的管理员登陆表单

```
<form action="/login" method="POST">
  <p>UserName: <input type="text" name="username"></p>
  <p>Pssword: <input type="password" name="password"></p>
  <p><input type="submit" value="登陆"></p>
</form>
```

后端的SQL语句可能使如下这样的

```
let querySql = `
  SELECT * FROM user WHERE username = ${username} AND psw = '${password}'
`
```

如果一个恶意攻击者输入的用户名是`zoumiaojiang OR 1 = 1--`密码随意输入,就可以直接登入系统， 
因此会变成如下形式
```
SELECT * FROM user WHERE username = 'zoumiaojiang' OR 1 = 1 -- 'AND psw='xxxx'';
```
在SQL中,`--`是注释后面的内容的意思,这条SQL的查询条件永远为真。所以恶意攻击者不用用户的密码,就可以登陆我的账号。然后可以在里面为所欲为。

#### 如何预防SQL注入

防止SQL注入主要是不能允许用户输入的内容影响正常的SQL语句的逻辑,当用户的输入的信息将要用来拼接SQL语句的话,我们应该永远选择不相信,任何内容都必须进行转义过滤,当然做到这个还是不够的,下面列出防御SQL注入的几点注意事项

+ 严格限制WEB应用的数据库的操作权限,给此用户提供仅仅能够满足其工作的最低权限,从而最大限度地减少注入攻击对数据库地危害

+ 后端代码检查输入地数据是否符合预期,严格限制变量地类型,例如使用正则表达式进行一些匹配处理

+ 对进入数据库地特殊字符等进行转义处理,或编码转换,基本上所有地后端语言都有对字符串进行转义地方法

+ 所有地查询语句建议使用数据库提供地参数化查询接口,参数化地语句使用参数而不是将用户输入变量嵌入到SQL语句中,既不要直接拼接SQL语句。

+ 在应用发布之前建议使用专业地SQL注入检测工具进行检测

+ 避免网站打印出SQL错误信息

+ 不要过于细化返回的错误信息

