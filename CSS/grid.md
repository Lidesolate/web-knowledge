#### CSS Grid Layout
##### 简介
CSS网格布局是一个二维的基于网格的布局系统, 其目的在于完全改变我们设计基于网络的用户界面的方式。CSS一直用来布局我们的网页, 但是他从来没有做过很好的工作, 最开始我们使用表格,然后`float`, `position`和`inline-block`。但是这些本质上是css的hack, 并且遗漏了很多重要的功能(例如垂直居中),后来flexbox出现了, 但是他的目的只是为了更简单的一维布局, 而不是复杂的二维布局。网格是第一个专门为解决布局问题而创建的CSS模块
在浏览器兼容性方面,可以看一下caniuse的数据

![](https://github.com/SGAMERyu/Basic-front-end/blob/master/Basic%20knowledge/Image/grid.png)

##### 网格容器
在元素中应用`display: grid`。这是所有网格布局的直接父元素, 在这个例子中`container`是网格容器
```
<div class="container">
  <div class="item item-1"></div>
  <div class="item item-2"></div>
  <div class="item item-3"></div>
</div>
```
##### 网格项目
网格容器的小孩(例如直接子元素),这里的`item`元素是网格项目,但`sub-item`不是
```
<div class="container">
  <div class="item"></div>
  <div class="item">
    <div class="sub-item"></div>
  </div>
  <div class="item"></div>
</div>
```
##### 网格线
构成网格结构的分界线, 他们既可以是垂直的(列)也可以是水平的(行)。这里的黄线是一个列网格线的例子

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-line.png)

##### 网格轨道
两个相邻网格线之间的空间。你可以把它们想象成网格的列或行。这是第二行和第三行网格线之间的网格轨道

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-track.png)

##### 网格单元格
两个相邻的行和两个相邻的列网格线之间的空间,也就是网格中的一个单元,这是行网格线1和2之间的网格单元, 以及列网格线2和3

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-cell.png)

##### 网格空间
四个网格线包围的总空间,网格空间可以由任意数量的网格单元组成。这里是行网格线1和3之间的网格空间, 以及列网格线1和3

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-area.png)

#### 网格容器的属性
##### display
将元素定义为网格容器, 并未其内容建立新的网格格式上下文
值：
+ gird: 生成块级网格
+ inline-grid: 生成内联网格
+ subgrid: 如果你的网格容本身是一个网格项目(即嵌套网格), 你可以使用这个属性来表明你想继承他父母的行/列而不是他自己的。
```
.container{
  display: grid | inline-grid | subgrid
}
```
##### grid-template-columns, grid-template-rows
使用空格分隔的值列表来定义网格的列和行。这些值表示轨道大小,他们之间的空间表示网格线
值: 
+ <track-size>: 可以是网格中的空闲空间的长度,百分比, 或分数
+ <line-name>: 线的名称
例如, 在网格轨迹之间流出空白区域时, 网格线会自动分配数字名称
```
.container{
  display: grid;
  grid-template-columns: 40px 50px auto 50px;
  grid-template-rows: 25% 100px auto;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-numbers.png)

但是你可以选择明确命名行,请注意行名称的括号语法

```
.container{
  grid-template-columns: [first] 40px [line2] 50px [line2] auto [line3] auto [col4-start] 50px [five] 5px; 
  grid-template-rows: [row1-start] 25% [row1-end] 100px [thrid-line] auto [last-line];
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-names.png)

请注意,一行/列可以有多个名字,例如这里第二列将有两个名字
```
.contaienr{
  grid-template-rows: [row1-start] 25% [row1-end row2-start] 25% [row2-end]
}
```
如果您的定义包含重复的部分,您可以使用repeat()符号来简化
```
.container{
  grid-template-columns: repeat(3, 20px [col-start]) 5%;
}
```
相当于这个
```
.container{
  grid-template-columns: 20px [col-start] 20px [col-start] 20px [col-start] 5%;
}
```
设置单位为`fr`网格会允许您设置的网格轨道大小为网格容器的自由空间的一小部分,例如,这会将每个项目设置为容器宽度的三分之一
```
.container {
  grid-template-columns: 1fr 1fr 1fr;
}
```
可用空间是在任何非弹性项目之后计算的,在这个例子中,`fr`单元可用空间的总量不包括50px
```
.container{
  grid-template-columns: 1fr 50px 1fr 1fr;
}
```
##### grid-template-areas
通过应用`grid-area`属性指定网格空间的名称来定义网格模板。
值: 
+ <gird-area-name>: 指定的网格空间的名称`grid-area`
+ .: 表示一个空的网格单元
+ none: 没有定义网格空间

```
.container{
  grid-template-areas: "<grid-area-name> | . | none | ...";
}
```
例子
```
.container{
  display: grid;
  grid-template-columns: repeat(4, 50px);
  grid-template-rows: auto;
  grid-template-areas: 
    "header header header header"
    "main main . slidebar"
    "footer footer footer footer"
}
.item-a{
  grid-area: header;
}
.item-b{
  grid-area: main;
}
.item-c{
  grid-area: slidebar;
}
.item-d{
  grid-area: footer;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-template-areas.png)

注意: 你不是用这个语法命名行只是空间, 当你使用这种语法时, 空间两端的行实际上是自动命名的,如果你的网格空间名字是foo,那么这个空间的起始行和起始列的名字就是foo-start,最后一列和最后一行就是foo-end;

##### grid-template
一个简短设置`grid-template-rows`, `grid-template-columns`和`grid-template-areas`在一起的声明
```
.container {
  grid-template: none | subgrid | <grid-template-rows> <grid-area-name>/ <grid-template-columns>;
}
```
由于`grid-template`不会重置隐式网格属性(`grid-auto-columns`, `grid-auto-rows`, `grid-auto-flow`),这可能是您在大多数情况下所要做的,所以建议使用`grid`属而不是`grid-template`。
##### grid-column-gap grid-row-gap
指定网格线的大小
值: 
+ <line-size>: 长度值
```
.container{
  grid-column-gap: <line-size>;
  grid-row-gap: <line-size>;
}
```
```
.container{
  display: grid;
  grid-template-columns: repeat(4, 50px);
  grid-template-rows: repeat(4, 80px);
  grid-column-gap: 10px;
  grid-row-gap: 15px;
}
```
![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-column-row-gap.png)

##### grid-gap
一种速记`grid-row-gap`和`grid-column-gap`
值:
+ <grid-row-gap><grid-column-gap>: 长度值
```
.container {
  grid-gap: <grid-row-gap><grid-column-gap>
}
```
##### justify-items
沿着行轴对齐网格内的内容(而不是`align-items`沿着列轴对齐),适用于所有网格容器内的网格项目
值: 
+ start: 将内容对齐到网格区域的左端
+ end: 将内容对齐到网格区域的右端
+ center: 将网格区域中心的内容对齐
+ stretch: 填充网格区域的整个宽度
```
.container{
  justify-items: start | end | center | stretch
}
```
例子

```
.container{
  justify-items: start;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-items-start.png)

```
.container{
  justify-items: end;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-items-end.png)

```
.container{
  justify-items: center;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-items-center.png)

```
.container{
  justify-items: stretch;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-items-stretch.png)

此行为也可以通过`justify-self`在个别网格项目上设置

##### align-items
沿列轴对齐网格的内容(而不是`justify-items`沿着行轴对齐)。该值适用于容器内的所有网格项目
值:
+ start: 将内容对齐到网格空间的顶部
+ end: 将内容对齐到网格空间的底部
+ center: 将内容对齐到网格空间的中心
+ stretch: 填充网格空间的整个高度
```
.container {
  align-items: start | end | center | stretch;
}
```
例子
```
.container {
  align-items: start;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-items-start.png)

```
.container {
  align-items: end;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-items-end.png)

```
.container {
  align-items: center;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-items-center.png)

```
.container {
  align-items: stretch;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-items-stretch.png)
此行为也可以通过`align-self`属性在个别网格项目上设置
##### justify-content
有时,网格的总大小可能小于其网格容器的大小, 如果您的所有网格项目都是用非灵活单位进行大小调整,就可能发生这种情况。这时候可以设置网格容器内的网格的对齐方式,此属性沿着行轴对齐网络
值:
+ start: 将网格对齐到网格容器的左端
+ end: 将网格对齐到网格容器的右端
+ center: 将网格对齐到网格容器的中心
+ stretch: 调整网格的大小以允许网格填充网格容器的整个宽度
+ space-around: 在每个网格项目之间分配一个均匀的空间,在两个端分配一半的空间
+ space-between: 在每个网格项目之间分配一个均匀的空间,在两个端没有分配空间
+ space-evenly:在每个网格项目之间分配一个均匀的空间,包括两个远端
例子
```
.container{
  justify-content: start;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-start.png)

```
.container{
  justify-content: end;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-end.png)

```
.container{
  justify-content: center;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-center.png)

```
.container{
  justify-content: stretch
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-stretch.png)

```
.container{
  justify-content: space-around;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-space-around.png)

```
.container{
  justify-content: space-between;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-space-between.png)

```
.container{
  justify-content: space-evenly;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-content-space-evenly.png)

##### align-content
此属性和`justify-content`一样,只不过是沿着列轴对齐网格
值:
+ start: 将网格对齐到网格容器的顶部
+ end: 将网格对齐到网格容器的底部
+ cneter: 将网格对齐到网格容器的中心
+ stretch: 调整网格项目的大小, 以允许网格项目填充网格容器的整个高度
+ space-around: 在每个网格项目之间分配均匀的空间,在两端分配一半的空间
+ sapce-between: 在每个网格项目之间分配一个均匀的空间,在两端没有空间
+ space-evenly: 在每个项目之间分配一个均匀的空间, 包括两端
例子：
```
.container{
  align-content: start;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-start.png)

```
.container{
  align-content: end
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-end.png)

```
.container{
  align-content: center;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-center.png)

```
.container{
  align-content: stretch;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-stretch.png)

```
.container{
  align-content: space-around;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-space-around.png)

```
.container{
  align-content: space-between;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-space-between.png)

```
.container{
  align-content: space-evenly;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-content-space-evenly.png)
##### grid-auto-columns grid-auto-rows
指定任何自动生成的网格轨道的大小,当你明确声明超出定义的网格空间的行或列(通过grid-template-rows / grid-template-columns)时间,会创建隐式网格轨道
值:
+ <track-size>: 可以长度, 百分比, 或分数(使用`fr`单位)
如何创建隐式网格轨道, 例子:
```
.contaienr{
  display: grid;
  grid-template-columns: repeat(2, 60px);
  grid-template-rows: repeat(2, 90px);
}
```
这样会创建一个2 X 2的网格

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-auto.png)

但现在如果你使用`grid-column`和`grid-row`定位你的网格项目是这样的
```
.item-a {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.item-b {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/implicit-tracks.png)

我们告诉`item-b`从第5行开始, 到第6行结束, 但是我们没有定义第5行或第6行, 因为我们引用了不存在的行,所以创建了宽度为0的隐式轨道来填补空白,我们可以使用`grid-auto-columns`和`grid-auto-rows`来指定这些隐式轨道的宽度
```
.container{
  grid-auto-columns: 60px;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/implicit-tracks-with-widths.png)

##### grid-auto-flow
如果您没有明确放置在网格上的网格项目,则自动分配算法会自动分配这些项目。该属性控制自动分配算法的原理
值:
+ column: 告诉自动分配算法依次填充每行,根据需要添加新行
+ row: 告诉自动分配算法一次填充每列,根据需要添加新列
+ dense: 告诉自动分配算法，如果之后出现较小的项目,则尝试在网格中尽早填充空间
**dense**可能导致您的项目出现乱序
例子：
```
<section class="container">
  <div class="item-a">item-a</div>
  <div class="item-b">item-b</div>
  <div class="item-c">item-c</div>
  <div class="item-d">item-d</div>
  <div class="item-e">item-e</div>
</section>
```
你定义了一个五行两列的网格,并设置`grid-auto-flow`为`row`
```
.container{
  display: grid;
  grid-template-columns: repeat(5, 60px);
  grid-template-rows: repeat(2, 30px);
  grid-auto-flow: row;
}
```
将项目分配在网格容器上,只能为其中的两个项目分配空间
```
.item-a {
  grid-column: 1;
  grid-row: 1 / 3;
}
.item-e {
  grid-column: 5;
  grid-row: 1 / 3;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-auto-flow-row.png)

如果将`grid-auto-flow`设置为`column`

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-auto-flow-column.png)

##### grid
简写为所有设置下列属性的单一声明: `grid-template-rows`,`grid-template-columns`, `grid-template-areas`, `grid-auto-rows`, `grid-auto-columns`和`grid-flow`。
#### 网格项目的属性
##### grid-column-start, grid-column-end, grid-row-start,grid-row-end
通过引用特定的网格线来确定网格内项目的位置。
值:
+ <line>: 可以是一个数字来引用一个编号的网格线,或者一个名称来引用一个命名的网格线
+ span <number>: 项目将跨越提供的网格轨道数量
+ span <name>: 项目将跨越, 直到与它提供的名称命中
+ auto: 自动分配

```
.item-a {
  grid-column-start: 2;
  grid-column-end: five;
  grid-row-start: row1-start
  grid-row-end: 3
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-start-end-a.png)

```
.item-b {
  grid-column-start: 1;
  grid-column-end: span col4-start;
  grid-row-start: 2
  grid-row-end: span 2
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/11/grid-start-end-b.png)

如果没有`grid-column-end`/`grid-row-end`声明, 该项目将默认跨越一个项目,项目可以相互重叠,您可以使用`z-index`来控制堆叠顺序
##### grid-column, grid-row
简写为`grid-column-start`+`grid-column-end`和`grid-row-start`+`grid-row-end`
值:
+ <start-line> / <end-line>
```
.item-c {
  grid-column: 3 / span 2;
  grid-row: third-line / 4;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-start-end-c.png)

#### grid-area
为项目提供一个名称,以便可以通过使用`grid-template-areas`属性创建的模板来引用他。或者属性可以用作`grid-row-start`+`grid-column-start`+`grid-row-end`+`grid-column-end`
值:
+ <name>: 你选择的名称
+ <row-start> / <column-start> / <row-end> / <column-end>:可以是数字或命名行
```
.item {
  grid-area:  <name> | <row-start> / <column-start> / <row-end> / <column-end>;
}
```
例子:
作为项目分配名称的一种方法
```
.item-d{
  grid-area: header;
}
```
作为`grid-row-start`+ `grid-column-start`+ `grid-row-end`+ `grid-column-end`的简写：
```
.item-d {
  grid-area: 1 / col4-start / last-line / 6
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-start-end-d.png)

##### justify-self
沿着行轴对齐网格的内容,此属性适用与单个网格项目的内容
值:
+ start: 将内容对齐到网格空间的左端
+ end: 将内容对齐到网格空间的右端
+ center: 将网格空间中心的内容对齐
+ stretch: 填充网格空间的整个宽度
```
.item {
  justify-self: start | end | center | stretch;
}
```
例子:
```
.item-a {
  justify-self: start;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-self-start.png)

```
.item-a {
  justify-self: end;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-self-end.png)

```
.item-a {
  justify-self: center;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-self-center.png)

```
.item-a {
  justify-self: stretch;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-justify-self-stretch.png)

#### align-self
沿列轴对齐网格内的内容,此值适用与单个网格项目内的内容
值
+ start: 将内容对齐到网格空间的顶部
+ end: 将内容对齐到网格空间的底部
+ center: 将网格空间中心的内容对齐
+ stretch: 填充网格空间的整个高度
```
.item {
  align-self: start | end | center | stretch;
}
```
例子:
```
.item-a {
  align-self: start;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-self-start.png)

```
.item-a {
  align-self: end;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-self-end.png)

```
.item-a {
  align-self: center;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-self-center.png)

```
.item-a {
  align-self: stretch;
}
```

![](https://cdn.css-tricks.com/wp-content/uploads/2016/03/grid-align-self-stretch.png)
