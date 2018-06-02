## HTML

### HTML 语义化

语义 HTML 是指所有的 HTML 都应该表达你的内容的基本含义而你不是其外观。例如使用`<strong>`而不是`<b>`,但是有一整套元素旨在网页的整体布局增加更多的意义。

![](https://internetingishard.com/html-and-css/semantic-html/html-sectioning-elements-00c3fd.png)

使用这些替代`<div>`元素是现代 web 开发的一个重要方面,因为他使用搜索引擎,屏幕阅读器和其他机器更能容易识别您网站的不同部分。而且从网站结构上更加利于开发人员维护

![](https://internetingishard.com/html-and-css/semantic-html/semantic-html-ffab7c.png)

### 常用 meta 标签

+ Doctype:

```
<!-HTML5->
<!doctype html>
```

+ charset:

```
<!-为文档设置字符编码->
<meta charser="utf-8">
```

+ viewport:

```
<!-用于响应式网页设计的视口>
<meta name="viewport" content="width-device-width, initial-scale=1, viewport-fit=cover">
```

+ title:

```
<!-文档标题->
<title>页面标题少于55个字符</title>
```

+ description:

```
<meta name="description" content="页面描述少于150个字符">
```
