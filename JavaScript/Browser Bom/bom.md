## BOM

### Ajax

#### 浏览器为ajax做了什么

+ 标准浏览器通过`XMLHttpRequest`对象实现了ajax的功能,只需要通过一行语句便可创建一个用于发送ajax请求的对象
```
var xhr = new XMLHttpRequest();
```

+ IE浏览器通过`XMLHttpRequest`或者`ActiveObject`对象同样实现了ajax的功能

#### XMLHttpRequest属性解读

1. readyState: 
只读属性,`readyState`属性记录了ajax调用过程中所有可能的状态,他的取值简单明了

readyState | 对应常量 | 描述 |
---------- | ------- | -----|
0(未初始化) | xhr.UNSENT | 请求已建立,但未初始化(此时未调用open方法)
1(初始化)   | xhr.OPENED | 请求已建立,但未发送(已调用open方法,但未调用send方法)
2(发送数据) | xhr.HEADERS_RECEIVED | 请求已发送(send方法调用,已收到响应头)
3(数据传送中) | xhr.LOADING | 请求处理中,因响应内容不全,这时通过`responseBody`和`responseText`获取可能会出现错误
4(完成) | xhr.DONE | 数据接收完毕,此时可以通过`responseBody`和`responseText`获取完整的响应数据

注意: readState是一个只读属性,想要改变它的值是不可行

2. onreadystatechange:

`onreadystatechange`事件回调方法在`readystate`状态改变时触发,在一个收到响应的`ajax`请求周期中,`onreadystatechange`方法会被触发4次,因此可以在`onreadystatechange`方法中绑定一些事件回调

```
xhr.onreadystatechange = function(e){
  if(xhr.readystate == 4){
    var s = xhr.status;
    if(s >= 200 && s < 300 || s == 304){
      console.log(xhr.responseText)
    }
  }
}
```

3. status:

只读属性,status 表示http请求的状态,初始值为0,如果服务器没有显示的指定状态码,则status将被设置为默认值200

4. statusText:

只读属性,statusText表示服务器的响应状态信息

5. onloadstart:

onloadstart事件回调方法在ajax请求发送之前触发,触发时机在`readyState == 1`和`readyState == 2`状态之前

5. onprogress:

onprogress事件回调方法在`readyState == 3`状时开始触发,默认传入`ProgressEvent`对象,可通过`e.loaded/e.total`来计算加载资源的进度,该方法用于获取资源的下载进度。

6. onload:

onload事件回调方法在ajax请求成功后触发,触发时机在`readyState == 4`状态之后。

7. onloadend:

onloadend事件回调方法在ajax请求完成后触发,触发时机在`readyState == 4`状态之后(收到响应时)或者`readyState == 2`状态之后(未收到响应时)

8. timeout:

timeout属性用于指定ajax的超时时长,通过它可以灵活地控制ajax请求时间的上限,timeout的值满足如下规则:

+ 通常设置为0时不生效
+ 设置为字符串时,如果字符串中全部为数字,他会自动将字符串转化为数字,反之该设置不生效
+ 设置为对象时,如果该对象能够转换为数字,那么将设置为转换的数字

9. ontimeout:

ontimeout方法在ajax请求超时时触发,通过它可以在ajax请求超时时做一些后续处理

10. response responseText:

均为只读属性,response表示服务器的响应内容,相应的responseText表示服务器响应内容的文本形式

11. responseXML

只读属性,responseXML表示xml形式的响应数据

12. responseType

responseType 表示响应的类型

13. responseURL

responseURL返回ajax请求最终的URL,如果请求中存在重定向,那么responseURL表示重定向之后的URL

14. withCredentials

这是一个布尔值,默认为false,表示跨域请求中不发送cookie等消息,当他设置为true时,`cookies`,`authorization headers`或者`TLS客户端证书`都可以正常发送和接收

15. abort:

abort方法用于取消ajax请求,取消后,`readyState`状态将被设置为`0`

16. getResponseHeader

用于获取ajax响应头中执行name的值

17. getAllResponseHeaders

获取所有安全的ajax的响应头

18. setRequestHeader

设置响应头

19. onerror:

用于在ajax请求出错后执行

20. upload:

upload属性默认返回一个 XMLHttpRequestUpload 对象, 用于上传资源. 该对象具有如下方法:

+ onloadstart
+ onprogress
+ onabort
+ onerror
+ onload
+ ontimeout
+ onloadend

上述方法功能同 xhr 对象中同名方法一致. 其中, onprogress 事件回调方法可用于跟踪资源上传的进度.

21. overrideMimeType

overrideMimeType方法用于强制指定response 的 MIME 类型, 即强制修改response的 Content-Type .
