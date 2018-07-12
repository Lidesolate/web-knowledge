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

#### 创建新节点的方法

+ `document.createElement(tag)`: 创建一个HTML元素
+ `document.createTextNode(value)`: 创建一个文本节点
+ `elem.cloneNode(deep)`: 克隆节点,其中`deep`是一个布尔值

上面创建的元素和节点,如果不去做插入的操作,是不是在DOM中渲染,所以在DOM还有一个写插入和删除节点的DOM API。先来看父节点做的相关操作

+ `parent.appendChild(node)`
+ `parent.insertBefore(node, nextSibling)`
+ `parent.removeChild(node)`
+ `parent.replaceChild(newElem, node)`

上面这些方法都是返回`node`。再来看看给定一个节点和字符串的相关操作

+ `node.append(...nodes or strings)`
+ `node.prepend(...nodes or strings)`
+ `node.before(...nodes or strings)`
+ `node.after(...node or string)`
+ `node.replaceWith(...nodes or string)`
+ `node.remove()`

除此之外,还可以根据把给出的一段HTML,通过`elem.insertAdjaceentHTML(where, html)`方法和下面的API,指定HTML片段插入的位置

+ `beforebegin`
+ `afterbegin`
+ `beforeend`
+ `afterend`

### 样式和类

+ 通过`DOM Element`对象的`getAttribute()`,`setAttribute()`和`removeAttribute()`等方法修改元素的`style`属性
+ 通过对元素节点的`style`来读写行内CSS样式
+ 通过`style`对象的`cssText`属性来修改全部的`style`属性
+ 通过`style`对象的`setProperty()`,`getPropertyValue()`,`removeProperty()`等方法来读写行内CSS样式
+ 通过`window.getComputedStyle()`方法获得浏览器最终计算的样式规则
+ 通过`className`或`classList`给元素添加或删除类名,配合样式文件来修改元素样式

### 获取元素位置和尺寸

#### offsetParent, offsetLeft和offsetTop

`offsetParent`,`offsetLeft`和`offsetTop`三个属性是最外层的几何结构的属性,因此我们从这几个属性着手开始学习

`offsetParent`: 返回一个指向最近的包含该元素的定位元素,如果没有定位的元素,则`offsetParent`为最近的`table`元素对象或根对象。当元素的`style.display`设置为`none`或`postion`为`fixed`时,`offsetParent`返回`null`

在大多数实际情况下,可以使用`offsetParent`获取最近的CSS位置的祖先。而其中`offsetLeft`和`offsetTop`提供相对于左上角的`x`和`y`坐标

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1806/dom-size-position-6.png)

特别注意的是,有几种情况下,`offsetParent`返回的值为`null`

+ 不可见的元素(比如元素设置`display: none`或元素就不在`document`中)
+ `<body>`和`<html>`元素
+ `position: fixed`的元素

#### offsetWidth和offsetHeight

+ `offsetWidth`: 一个元素的布局宽度,`offsetWidth`是测量包含元素的边框,水平线上的内边距,竖直方向滚动条以及CSS设置的宽度的值
+ `offsetHeight`: 元素的像素高度,高度包含该元素的垂直内边距和边框,且是一个整数。通常,元素的`offsetHeight`是一种元素CSS高度的衡量标准,包括元素的边框,内边距和元素的水平滚动条(如果存在且渲染的话),不包含`:before`或`:after`等伪类元素的高度。

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1806/dom-size-position-7.png)

在实际使用中,不显示的元素是其几何结构属性的值为`0`或`null`,也就是说,几何结构属性只对可见的元素进行计算

#### clientTop和clientLeft

前面提到过`offsetLeft`和`offsetTop`没有考虑`border`,为了测量`border`的大小,我们使用`clientLeft`和`clientTop`来获取。比如上面的示例

+ `border-left`的宽度: `clientLeft = 25`
+ `border-top`的宽度: `clientTop = 25`;

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1806/dom-size-position-8.png)

#### clientWidth和clientHeight

`clientWidth`和`clientHeight`属性可以用来获取元素边框内区域的大小。它们包括了内容的宽度和`padding`,打不包括滚动条的宽度和`border`的宽度

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1806/dom-size-position-10.png)

#### scrollLeft和scrollTop

`scrollLeft`和`scrollTop`属性可以获取或设置滚动元素隐藏部分的宽度和高度

`scrollLeft`可以读取或设置元素滚动条到元素左边的距离。如果这个元素的内容排列方向是`right-to-left`,那么滚动条会位于最右侧,并且`scrollLeft`值为`0`。此时,当你从右到左拖动滚动条时,`scrollLeft`会从`0`变为负数。

`scrollTop`可以获取或设置一个元素的内容垂直滚动的像素数。一个元素的`scrollTop`值是这个元素的顶部到它的最顶部可见内容(的顶部)的距离的度量。当一个元素的内容没有产生垂直方向的滚动条,那么它的`scrollTop`值为`0`

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1806/dom-size-position-12.png)

#### scrollWidth和scrollHeight

`clientWidth`和`clientHeight`仅负责元素的可见部分。而属性`scrollWidth`和`scrollHeight`还会包括不可见(隐藏)的部分。

`scrollWidth`返回该元素区域宽度和自身宽度中较大的一个,若自身宽度大于内容宽度(存在滚动条),那么`scrollWidth`将大于`clientWidth`。需要注意的是,该属性返回的是四舍五入后的整数值,如果需要小数,则需要使用`getBoundClienRect()`。

`scrollHeight`返回该元素内容高度。包括被`overflow`隐藏的部分,包含`padding`,但不包含`margin`，和`scrollWidth`类似,如果需要小数,则需要使用`getBoundingClienRect()`。

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1806/dom-size-position-13.png)

### 视窗,设备,滚动条和文档尺寸

#### ViewPort

`ViewPort`指的是网页的显示区域,也就是不借助滚动条的情况下,用户可以看到的部分网页大小,正常情况下,`viewport`和浏览器的显示窗口是一样大小的。

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1807/viewport-device-scroll-document-size-2.png)

#### 屏幕分辨率和尺寸

如果我们要测量屏幕的分辨率,可以使用下面这两队属性:

+ `window.screnn.width`和`window.screen.height`指的是显示器屏幕的宽度和高度,包括工具栏,状态栏等
+ `window.screen.availWidth`和`window.screen.availHeight`指的是浏览器窗口在屏幕上可占用的空间(宽度和高度)

`window.screen.width`和`window.screen.height`理论上返回的屏幕完整的分辨率

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1807/viewport-device-scroll-document-size-7.png)

这两个属性没有考虑到屏幕(比如任务栏)占用的空间,所以他们不能准确的知道要处理多少像素。如果要知道屏幕实际由多大尺寸,应该使用`window.screen.availWidth`和`window.screen.availHeight`

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1807/viewport-device-scroll-document-size-8.png)

#### 滚动条尺寸

与滚动`scroll`相关的方法主要有`window`对象下的`scrollX`,`scrollY`,`scrollTo`和`scroll`;`Element`对象上的`scrollWidth`,`scrollHeight`,`scrollLeft`和`scrollTop`

而在JavaScript中有两个特殊属性:

+ `window.pageXOffset`: 是`scrollX`的别名,返回文档/页面水平方向滚动的像素值
+ `window.pageYOffset`: 是`scrollY`的别名,返回文档在垂直方向已滚动的像素值

除了上述提到的有关于滚动条的属性之外,还有`window.scrollTop()`,`window.scroll()`和`window.scrollBy()`等属性

`window.scrollTo`方法用于将文档滚动到指定位置。他接受两个参数,表示滚动后位于窗口左上角的页面坐标

```
window.scrollTo(x-coord, y-coord)
```
它也可以接收一个配置对象作为参数

```
window.scrollTo(options)
```
配置对象`options`有三个属性:

+ `top`: 滚动后页面左上角的垂直坐标,即`Y`坐标
+ `left`: 滚动后页面左上角的水平坐标,即`x`坐标
+ `behavior`: 字符串,表示滚动的方式,有三个可能值(`smooth`,`instant`, `auto`)默认值`auto`

`scrollBy()`方法用于将将网页滚动指定距离(单位像素),他接受两个参数： 水平向右滚动的元素,垂直向下滚动的像素

```
window.scrollBy(0, wibdow.innerHeight)
```

如果不是要滚动整个文档,而是要滚动某个元素,可以使用下面三个属性和方法

+ `Element.scrollTop`
+ `Element.scrollLeft`
+ `Element.scrollIntoView()`

其中scrollIntoView()是HTML5新增的一个功能：元素滚动的API，功能是类似于锚点。