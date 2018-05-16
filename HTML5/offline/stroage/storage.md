## 1. cookie

可以笼统的将cookie分为两类: 会话cookie和持久cookie。会话cookie是一种临时cookie。用户退出浏览器时,会话cookie就被删除了。持久cookie的生存时间更长一些,他们存储在硬盘上,浏览器退出时他们仍然存在。

会话cookie和持久cookie之间唯一的区别就是他们的过期时间。如果设置了Discard参数,或者没有设置Expires或Max-Age参数来说明扩展的过期时间,这个cookie就是一个会话cookie

### 1.1 限制

cookie在性质上是绑定在特定的域名下的。当设定了一个cookie后,在给它创建他的域名发送请求时,都会包含这个`cookie`,这个限制确保了储存在`cookie`中的信息只能让批准的接受者访问,而无法被其他域返回。

由于`cookie`是存在客户端计算机上的,还加入了一些限制确保`cookie`不会被恶意使用。同时不会占据太多磁盘空间，每个域的`cookie`总数是有限制的。当超过单个域名之后还要设置`cookie`,浏览器就会清除以前设置的`cookie`。

对于`cookie`浏览器的尺寸也是有限制,大多数浏览器为4kb。

### 1.2 cookie的构成

rfc中定义了浏览器存放每个cookie时应该包括这些字段: 
+ name,value: 由cookie正文指定
+ expriry-time: 根据cookie中的expries和Max-age指定cookie的使用期限
+ domain,path: 分别由cookie中的domain和path指定
+ creation-time, last-access-time: 由浏览器自行获得
+ persistent-flag: 持久化标记,在expirty-time未知的情况下为false
+ secure-only-flag: 在Cookie中包含secure属性时为true,表示这个cookie仅仅在https环境下才能使用
+ http-only-flag: 在Cookie中包含httponly属性时为true,表示这个cookie不允许通过JS读写
+ host-only-flag: 在Cookie中不包含Domain属性,或者Domain属性为空,或者Domain不合法(不等于页面URL中的Domain部分,也不是页面Domain的大域)时为true。如果为true时间,只有域名完全相等才可以继续后续流程,反之符合域规则的域名都可以进入后续流程。

### 1.3 JavaScript中的cookie

通过`document.cookie`来操作`cookie`,由于经过`URL`编码,所以需要通过`encodeURIComponent`编码,`decodeURIComponent`解码。

### 1.4 cookie,安全性和隐私
在实际的应用场景中,Cookie做的最多一件事就是保持身份认证的服务端状态,所以一旦泄露,服务端将无法判断这个身份是用户本人。要避免这种问题可以有以下这几种方法
+ 设置`httponly`: 不允许js去操作cookie
+ 设置`secure`: 仅仅在https环境下才能启用
+ 使用签名`cookie`: 防止篡改
+ 设定`expriseIn`和`Max-Age`: 设置有效期限

## 2. web存储机制

web storage的目的是克服由cookie带来的一些限制,当数据需要被严格控制在客户端上,无需持续的将数据发回服务器。web storage的两个主要目的是:
+ 提供一种在cookie之外存储会话数据的途径
+ 提供一种存储大量可以跨会话存在数据的机制

### 2.1 Storage类型
Storage类型提供最大的存储空间(因浏览器而异)来存储名值对儿。Storage的实例有以下方法：
+ clear(): 删除所有值
+ getItem(name): 根据指定的名字name获取对应的值
+ key(index): 获得index位置处的值的名字
+ removeItem(name, value): 删除由name指定的名值对儿
+ setItem(name, value): 为指定的name设置一个对应的值

### 2.2 sessionStorage和localStorage
web Storage包含以下两种机制
+ `sessionStorage`: 为每一个给定的源维持一个独立的存储区域,该存储区域在页面会话期间可用(即只要浏览器处于打开状态,包括页面加载和回恢复)
+ `localStorage`: 同样的功能,但是在浏览器关闭,然后重新打开后数据仍然存在。 

对于`sessionStorage`和`localStorage`的存储容量,大多数浏览器是5MB

## 3. 区别

1. 传输限制: `cookie`的数据可以在客户端和服务端互相传送,而`localStorage`和`seesionStorage`只能在客户端存储
2. 存储限制: `cookie`在每个域名下只能有20个cookie,每个cookie不能超过4kb,否则会把之前设置的cookie替代掉。而`sessionStorage`和`localStorage`则会存储5MB左右,不过当超过限制时,超限的值不会被定义
3. 时间限制: `cookie`可以通过设置`expriseIn`和`Max-Age`来控制有效期,而`localStorage`只有用户才能清空,否则一直存储在浏览器中,`sessionStorage`则会存储到浏览器关闭页面
4. 作用域限制: `sessionStorage`不在不同的浏览器页面中共享，即使是同一个页面；`localStorage` 在所有同源窗口中都是共享的；`cookie`也是在所有同源窗口中都是共享的。(可以设置host-only-flag来只让特定域名下才可以访问)
