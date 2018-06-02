<!-- TOC -->

* [CSS 基础](#css-基础)
  * [CSS 选择器](#css-选择器)
  * [css 优先级](#css-优先级)
  * [css 继承](#css-继承)
  * [盒子模型](#盒子模型)
    * [content，padding, border, margin](#contentpadding-border-margin)
    * [垂直外边距折叠](#垂直外边距折叠)
    * [box-sizing 属性](#box-sizing-属性)
    * [BFC](#bfc)
  * [清除浮动的方式](#清除浮动的方式)
  * [定位](#定位)

<!-- /TOC -->

## CSS 基础

### CSS 选择器

* 通配选择器: `*`
* 元素选择器: `E`
* id 选择器: `#elementID`
* 类选择器: `.class`
* 伪类选择器:
  * 链接历史伪类: `:link`
  * 用户操作伪类: `:active / :hover / :focus`
  * 结构伪类: `:first-child / :emty / :last-child / :only-child / :first-of-type / :last-of-type / :only-of-type / :nth-child(n) / :nth-last-child(n) / :nth-of-type(n) / :nth-last-of-type(n)`
  * 目标位类: `:target`
  * 否定伪类: `:not(s)`
  * 启用和禁用伪类: `:enabled / :disabled`
  * 选择选项伪类: `:checked`
* 组合选择器:
  * 后代组合: `E F`
  * 子代组合: `E > F`
  * 相邻兄弟组合: `E + F`
  * 一般兄弟组合: `E ~ F`
* 属性选择器: `[foobar] / [attribute='value'] / [foo~='bar'] / [foo]='en' / [foo^='bar'] / [foo$='bar'] / [foo*='bar']`

### css 优先级

一个选择器具有的权重是用四种不同的值来衡量的,他们可以被认为是千位,百位,十位和个位

1.  千位: 声明在`style`属性中
2.  百位: 含有 ID 选择器
3.  十位: 含有类选择器,属性选择器,伪类选择器
4.  个位: 含有元素选择器或者位元素
    **注**: 可以利用`!important`将优先级提到最高

### css 继承

只有少数 CSS 属性可以被继承:

* text color
* font(family, size, style, weight)
* line-height

控制继承的四种通用属性值

* `inherit`: 该值将应用到选定元素的属性值设置为于其父元素一样。
* `initial`: 该值将应用到选定元素的属性值设置为于浏览器默认样式表中该元素设置的值一样。如果浏览器默认样式表中没有设置值,并且该属性是自然继承的,则该属性被设置为`inherit`
* `unset`: 该值将属性重置为其自然值,如果属性是自然继承的,那么他就表现得像`inherit`,否则就是表现得像`initial`
* `revert`: 如果当前的节点没有应用任何样式,则将该属性会恢复到她所拥有的值。换句话说,属性值被设置成自定义样式所定义的属性

### 盒子模型

在屏幕上呈现的 html 元素都是一个框,他们有两种形式: 块级盒子和内联盒子

![](https://internetingishard.com/html-and-css/css-box-model/inline-vs-block-boxes-f3e662.png)

块级盒子和内联盒子的区别

* 块级元素总是出现在前面的块级元素下面。这是 HTML 文档呈现时的自然流
* 块级盒子宽度是基于他们的父容器的宽度的自动设定的。
* 块级盒子的默认高度取决于其包含的内容
* 内联盒子不会影响垂直间距,他们不用于确定布局,他们是用于在一个块内部设计样式的东西
* 内联盒子的宽度取决于其包含的内容,而不是父元素的高度

#### content，padding, border, margin

CSS 盒子模型是一组规则,用于确定网页中每个元素的尺寸。他给出了每个元素的四个属性

* content: 盒子中的文本,图像或其他媒体内容
* padding: 盒子的内容和边框之间的空间
* border: 盒子的填充和边距之间的空间
* margin: 盒子和周围盒子之间的空间

![](https://internetingishard.com/html-and-css/css-box-model/css-box-model-73a525.png)

**注**:

* 内联盒子的 margin： 内联盒子完全忽略盒子的顶部和底部`margin`

#### 垂直外边距折叠

css 盒子模型有个怪癖是垂直外边距折叠,当有两个垂直边距彼此相邻的盒子时,他们就会折叠,并不会两个边距添加,而只显示最大边距

例如我们设置

```
p {
  padding: 20px 0 20px 10px;
  margin-top: 25px;
  margin-bottom: 50px;
}
```

通常我们认为`p`元素之间的距离有`75px`但是在页面呈现的效果却是`50px`。因为较小的顶部边距折叠进了较大的底部边距。

![](https://internetingishard.com/html-and-css/css-box-model/vertical-margin-collapse-bba78e.png)

通常产生外边距折叠的三种基本情况是

* 相邻元素之间
* 父元素于其第一个或最后一个子元素之间: 如果在父元素与其第一个元素之间不存在边框,填充,行内内容,也没有创建`BFC`,或者清除浮动将两者的`margin-top`分开;或者在父元素于其 最后一个子元素之间不存在边框,填充,行内内容,`height`,`min-height`,`max-height`将两者的`margin-bottom`分开。那么这两对外边距会产生折叠。此时子元素的外边距会溢出到父元素的外面
* 空的块级元素: 如果一个块级元素中不包含任何内容，并且在其`margin-top`与`margin-bottom`之间没有边框、内边距、行内内容、`height`、`min-height`将两者分开，则该元素的上下外边距会折

解决方法就是:

1.  触发 BFC
2.  在两者之间填入一个非零高度的 div

#### box-sizing 属性

在 width 和 height 属性只能定义一个盒子的内容大小。如果你设置了填充和边框都会添加到盒子总宽度中去

![](https://internetingishard.com/html-and-css/css-box-model/box-sizing-content-box-09f48a.png)

也就意味着此时盒子的宽度计算是: `content-width`
这样会给开发人员造成困惑。因此我们可以使用`box-sizing`属性去更改盒子的总宽度,默认情况下他的值为`content-box`这会导致上述行为,如果我们把它改为`border-box`

![](https://internetingishard.com/html-and-css/css-box-model/box-sizing-border-box-ace2be.png)

此时盒子的宽度计算是 `padding + border + content-width`;

#### BFC

BFC 是 css 渲染的一部分,是布局过程中生成块级盒子的区域,也是浮动与元素与其他元素的交互限定区域

BFC 布局规则:

* BFC 的区域不会与浮动元素重叠
* BFC 不会影响外部元素
* BFC 内部元素会发生外边距折叠
* 计算 BFC 的高度时,浮动元素也参与计算

以下方式会创建块格式化上下文

* 根元素或包含根元素的元素
* 浮动元素(元素的`float`不是`none`)
* 绝对定位元素(元素的`position`为`absolute`或`fixed`)
* 行内块元素(元素的`display`为`inline-block`)
* 表格单元格(元素的`display`为`table-cell`)
* 表格标题(元素的`display`为`tab-caption`)
* 匿名表格单元格元素
* `overflow`值不为`visible`的块元素
* `display`值为`flow-root`的元素
* 弹性元素(`display`为`flex`或`inline-flex`的直接子元素)
* 网格元素(`display`为`grid`或`inline-grid`的直接子元素)
* 多列容器(元素的`column-count`或`column-width`不为`auto`)

BFC 能够解决:

* 解决设置浮动导致父元素高度塌陷
* 解决外边距重叠

### 清除浮动的方式

* 空 div 方法: `<div style='clear: both'></div>`
* 溢出方法: 依赖于在父元素设置`overflow`属性。如果此属性设置为`auto`或者`hidden`在父元素上。父元素将包含浮动元素
* 伪元素方法: 利用伪元素方法来清除浮动

```
.clearfix:after{
  content: " ";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both
}
```

### 定位

* relative: 相对于他们出现在页面的静态流中的位置移动
* absolute: 相对于其祖先元素中`position`的值不为`static`的元素移动,如果祖先没有被定位,则会回落到浏览器相关的位置
* fixed: 相对于整个浏览器窗口,关键的区别是定位的元素不会随页面的其余部分一起滚动
* sticky; 它允许定位元素像其相对定位一样行动,知道他被滚到某个阈值点,之后她变得固定
