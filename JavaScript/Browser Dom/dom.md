## DOM

### 简述

对于用户而言浏览器显示的是一个web文档,而对于浏览器而言浏览器文档只是表面的东西,其幕后的东西是一种层次结构,这个层次结构被称为文档对象模型,我们称之为DOM

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/browser-dom-7.png)

DOM实际上是由HTML元素和其他的多种类型组成的。所有组成DOM的东西称为DOM节点

这些节点可以是元素,属性,文本内容,注释,文档相关的内容以及其他的东西

我们访问的每个HTML元素都有一个与之相关联的特定类型,并且所有这些类型都从组成所有节点的节点基础扩展

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/browser-dom-8.png)

### window对象

由于JavaScript是一种多平台的平台,因此不同的平台会提供不同的对象和函数,而在web浏览器中则会给JavaScript中提供`window`对象

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/browser-dom-5.png)

这是一个根对象,他又两个角色

+ 首先,他是JavaScript代码的全局对象
+ 其次,他代表了浏览器窗口,并提供了控制它的方法

`window`对象表示一个包含DOM文档的窗口,其`document`属性指向窗口中的`DOM`文档。在标签浏览器中,每个标签具有自己的`window`对象,也就是说同一窗口的标签之间不会共享一个`window`对象。其次,`window`对象有很多对应的方法,属性和事件。

### document对象

document对象时所有HTML元素的网关,这些元素构成了`WEB`页面显示的内容。要记住的是,`document`对象并不仅仅表示`HTML`文档的只读版本

### DOM树

根据文档对象模型(即: DOM),每个HTML标签事实上都是一个对象。嵌套的标签称之为元素(或子标签)。除此之外,标签内的文本也是一个对象。而这些对象都可以使用JavaScript对象访问,这种对象模型类似一棵树。例如

```
<html>
  <head>
    <title>about elks</title>
  </head>
  <body>
    the truth about elks
  </body>
</html>
```


![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/dom-tree-4.png)


### 找到元素的方式

在我们找到元素并与他们做一些事情之前,你首先需要了解元素的位置。来自DOM顶部的视图由`window`,`document`和`html`元素组成:

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/dom-tree-17.png)

由于这三样东西的重要性,DOM为你提供了通过`window`,`document`和`document.documentElement`访问他们的方法。需要注意的一点是,`window`和`document`都是全局属性。不必要明确的声明他们,可以直接从容器拿出来用就行了。往往,最顶层的树节点可以直接作为`document`属性使用,比如:

```
<html> = document.documentElement
```

顶部文档节点`document.documentElement`,其对应的就是`<html>`的DOM节点。另外一个广泛使用的DOM节点是`<body>`元素,其对应的是`document.body`

```
<body> = docuemnt.body
```

同样的,`<head>`标签可以用`document.head`

事实上,一旦你进入HTML元素级别,你的DOM将开始分支并变得更有趣,在这一点上,你有几种获取DOM的方式。通过使用`querySelector`和`querySelectorAll()`可以帮助你精确的获取你想要获取的DOM元素。

但是有时候光靠`querySelector`和`querySelectorAll()`是有局限的,例如我们要获取一个元素的兄弟元素。这时候这两种方法就不行了。

能够帮助你的是知道所有的DOM元素都至少有一个组合,包括父母(parent),兄弟姐妹(siblings)和子元素(children)

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/dom-tree-18.png)

为此,DOM中提供了一些对应的属性(这些属性具有一定的依赖关系)。包括: `firstChild`,`lastChild`,`parentNode`,`children`,`previousSibling`和`nextSlibing`。这几个属性结合在一起将构建一个`DOM`遍历连接图,允许在DOM节点间找到你想要找到的DOM:

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/dom-tree-19.png)

### 兄弟姐妹和父母打交道

在这些DOM属性中,最容易处理的是父母和兄弟姐妹。对应的属性有`parentNode`,`previousSibling`和`nextSibling`。

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/dom-tree-20.png)

### 子元素打交道

DOM还提供一些属性可以访问元素的子元素,比如`firstChild`,`lastChild`和`children`。

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1805/dom-tree-21.png)

在DOM中获取子节点,除了前面提到的三个属性之外,还有一个`childNodes`属性,不过它和`children`有一个很明显的区别: **`children`之获取子节点(即子元素),而`childrenNodes`除了获取的子节点还包括文本节点**

除此之外,还有一个特殊的函数`hasChildNodes()`可以用来判断某个元素是否包含子节点

### getElement* 和 querySelector*

#### getElementBy*

+ `document.getElementById(id)`
+ `document.getElementsByTagName(tag)`
+ `document.getElementsByClassName(className)`
+ `document.getElementByName(name)`

上面的三个方法对应的是通过元素的id名,标签名, 类名和属性来获取想要的元素节点。

所有方法`getElementBy*`返回的是一个动态集合。这样的集合总是反映文档的当前状态,并在更改时自动更新

#### querySelector*

咱们来看`querySelector()`和`querySelectorAll()`方法怎么来获取想要的DOM元素。例子

```
var element = document.querySelector('<CSS Selector>')
```

相比于`querySelector`,`querySelectorAll`返回的是一个数组。而且他们的返回的是一个静态集合,是一个固定的元素数组。

### DOM节点属性

每个DOM节点属于某个类。这些类构成一个DOM树。所有的属性和方法都将被继承,主要的DOM节点属性有:

+ `nodeType`: 我们可以从DOM对象类中获取`nodeType`。我们通常需要查看他是否是文本或元素节点,使用`nodeType`属性很好,他可以获取对应的常数值,其中`1`表示元素节点,`3`表示文本节点。另外,该属性是一个只读属性
+ `nodeName / tagName`: `tagName`只用于元素节点,对于非元素节点使用`nodeName`来描述,他们也是只读属性
+ `innerHTML`: 获取HTML元素的内容(包括元素标签自身),其可以被修改
+ `outerHTML`: 获取元素完整的HTML,`outerHTML`并没有触及元素自身,相反他被外部环境中的新HTML所取代
+ `nodeValue / data`: 非元素节点的内容(文本, 注释)。这两个几乎一样的
+ `textContent`: 获取元素内容的文本,基本上是HTML减去所有的标签,它也具有写入特性,可以将文本放入元素中,所有特殊的字符和标记都被精确的处理为文本

### 修改DOM

