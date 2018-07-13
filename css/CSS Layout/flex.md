#### flexbox
flexbox是一种一维的布局, 是因为一个flexbox一次只能处理一个维度上元素布局, 一行或者一列, 作为对比的是另外一个二维布局Grid Layout能同事处理行和列上的布局
#### 1. felxbox的两根轴线
当使用felx布局时,首先要想到的是两根轴线——主轴和垂直轴,主轴有`flex-direction`定义, 另一根轴垂直于它, 我们使用felxbox的所有属性都跟这两根轴线有关。
**主轴**: 主轴由`flex-direction`定义,可以取4个值
+ `row`
+ `row-reverse`
+ `column`
+ `column-reverse`
如果选择了`row`或者`row-reverse`你的主轴将沿着**inline**方向延伸

![](https://mdn.mozillademos.org/files/15614/Basics1.png)

选择`column`或者`column-reverse`时, 你的主轴沿着上下方向延伸也就是**block**排列的方向

![](https://mdn.mozillademos.org/files/15615/Basics2.png)

**交叉轴**: 交叉轴是垂直于主轴的那根轴, 所以如果你的`flex-direction`(主轴)设成了`row`或者`row-reverse`的话, 交叉轴的方向就是沿着列的向下的

![](https://mdn.mozillademos.org/files/15616/Basics3.png)

如果主轴设成了`column`或者`column-reverse`, 交叉轴就是水平方向

![](https://mdn.mozillademos.org/files/15617/Basics4.png)

##### 1.1 flexbox容器
使用flexbox放置的文档元素被成为**flex容器**，要创建felx容器,我们需要将该元素的`display`属性的值设置为`flex`或`inline-flex`。我们这样设置后,这个元素内的直接子元素就会变成flex容器的, 与css中的所有属性一样定义了一些初始值
+ 项目显示在一行中(flex-direction属性的默认值是row)
+ 这些项目会从主轴的起始边缘开始
+ 项目不在主轴伸展,但可以伸缩
+ 这些项目将伸展用来填充交叉轴的大小
+ 该`flex-basis`属性设置为`auto`
+ 该`flex-wrap`属性设置为`nowrap`

![](https://cask.scotch.io/2015/04/flexbox-flex-direction-row.jpg)

**felx-direction**
将`flex-direction`属性添加到felx容器使得我们可以更改felx项目显示的方向。
```
.flex-container {
  flex-direction: row;
}
```

![](https://cask.scotch.io/2015/04/flexbox-flex-direction-row.jpg)

```
.flex-container{
  flex-direction: row-reverse;
}
```

![](https://cask.scotch.io/2015/04/flexbox-flex-direction-row-reverse.jpg)

```
.flex-container{
  flex-direction: column
}
```

![](https://cask.scotch.io/2015/04/flexbox-flex-direction-column.jpg)

```
.flex-container{
  flex-direction: column-reverse;
}
```

![](https://cask.scotch.io/2015/04/flexbox-flex-direction-column-reverse.jpg)

**felx-wrap**
虽然felxbox是一维模型,但是我们可以通过`flex-wrap`属性来将felx项目变成多行
```
.flex-container{
  flex-wrap: nowrap;
}
```
felx项目显示在一行中, 默认情况下他们会缩小以适应felx容器的宽度

![](https://cask.scotch.io/2015/04/flexbox-flex-wrap-nowrap.jpg)

```
.flex-container{
  flex-wrap: wrap;
}
```
如果需要, flex项目以多行显示, 从左到右和从上到下

![](https://cask.scotch.io/2015/04/flexbox-flex-wrap-wrap.jpg)

```
.flex-container{
  flex-wrap: wrap-reverse;
}
```
如果需要, flex项目以多行显示,从左到右和从下到上

![](https://cask.scotch.io/2015/04/flexbox-flex-wrap-wrap-reverse.jpg)

**默认值**: `nowrap`

**flex-flow**
此属性是设置`flex-direction`和`flex-wrap`属性的简写
```
.flex-container{
  flex-flow: row nowrap; // 默认值
}
```
**justify-content**
这个属性沿着flex容器当前行的主轴对齐flex项目。
```
.flex-container{
  justify-content: flex-start;
}
```
flex项目与flex容器的左侧对齐

![](https://cask.scotch.io/2015/04/flexbox-justify-content-flex-start.jpg)

```
.flex-container{
  justify-content: flex-end;
}
```

flex项目与flex容器的右侧对齐

![](https://cask.scotch.io/2015/04/flexbox-justify-content-flex-end.jpg)

```
.flex-container{
  justify-content: center;
}
```
felx项目在flex容器的中心对齐

![](https://cask.scotch.io/2015/04/flexbox-justify-content-center.jpg)

```
.flex-container{
  justify-content: space-between;
}
```
flexx项目以相等的间距显示,第一个和最后一个flex项目与flex容器的边缘对齐

![](https://cask.scotch.io/2015/04/flexbox-justify-content-space-between.jpg)

```
.flex-container{
  justify-content: space-around;
}
```
flex项目在每个flex项目周围以相等的间距显示，即使第一个和最后一个flex项目也是如此

![](https://cask.scotch.io/2015/04/flexbox-justify-content-space-around.jpg)

**默认值**: `flex-start`

**align-items**
flex可以在交叉轴上对齐,类似与`justify-content`。
```
.flex-container{
  aligin-items: stretch;
}
```
felx项目从flex容器的交叉轴开始到交叉轴末端的整个高度或宽度

![](https://cask.scotch.io/2015/04/flexbox-align-items-stretch.jpg)

```
.flex-container{
  align-items: flex-start;
}
```
flex项目被堆叠到flex容器的交叉开始处

![](https://cask.scotch.io/2015/04/flexbox-align-items-flex-start.jpg)

```
.flex-container{
  align-items: flex-end;
}
```

flex项目被堆叠到felx容器的交叉末端

![](https://cask.scotch.io/2015/04/flexbox-align-items-flex-end.jpg)

```
.flex-container{
  align-items: center;
}
```

flex项目堆叠放在flex容器交叉轴的中心

![](https://cask.scotch.io/2015/04/flexbox-align-items-center.jpg)

```
.flex-container{
  align-items: baseline;
}
```
flex项目以其基线的方式对齐

![](https://cask.scotch.io/2015/04/flexbox-align-items-baseline.jpg)

**align-content**
`align-content`在交叉轴上有额外空间时,属性会在flex的交叉轴对齐flex项目
```
.flex-container{
  align-content: stretch;
}
```

flex项目在每行flex项目之后以分布式形式显示

![](https://cask.scotch.io/2015/04/flexbox-align-content-stretch.jpg)

```
.flex-container{
  align-content: flex-start;
}
```

flex项目堆叠在flex容器的交叉轴开始处

![](https://cask.scotch.io/2015/04/flexbox-align-content-flex-start.jpg)

```
.flex-container{
  align-content: flex-end;
}
```

flex项目朝向flex容器的交叉轴结尾端堆叠

![](https://cask.scotch.io/2015/04/flexbox-align-content-flex-end.jpg)

```
.flex-container{
  align-content: center;
}
```
flex项目堆叠在flex容器的交叉轴的中心

![](https://cask.scotch.io/2015/04/flexbox-align-content-center.jpg)

```
flex-container{
  align-content: space-between
}
```

flex项目的行以相等的间距显示, 第一行和最后一行与flex容器的边缘对齐。

![](https://cask.scotch.io/2015/04/flexbox-align-content-space-between.jpg)

```
.flex-container{
  align-content: space-around;
}
```
flex项目在felx项目的每一行周围以相等的间距显示

![](https://cask.scotch.io/2015/04/flexbox-align-content-space-around.jpg)

**注意**: 此属性只有在多行flex容器内才有效
##### 1.2 felxbox的项目属性

**order**
order属性控制flex容器的子项目出现在flex容器内的顺序
```
.flex-item{
  order: <number> 
}
```

![](https://cask.scotch.io/2015/04/flexbox-order.jpg)

**flex-grow**
此属性可以用于按比例分配主轴上的可用空间
```
.flex-item{
  flex-grow: <number>
}
```

![](https://cask.scotch.io/2015/04/flexbox-flex-grow-1.jpg)

第二个flex项目相比于其他flex项目的大小占用更多空间

![](https://cask.scotch.io/2015/04/flexbox-flex-grow-2.jpg)

**注**: 负数无效

**flex-shrink**
flex-shrink是flex-grow相对属性,代表收缩空间。
```
.flex-item{
  flex-shrink: <number>
}
```
默认情况下所有的flex项目都可以收缩,但是我们将其设置为0的时候，他将保持原始大小。

![](https://cask.scotch.io/2015/04/flexbox-flex-shrink.jpg)

**注**: 负数无效

**flex-basis**
此属性采用`width`和`height`属性相同的值,并制定flex项目的初始大小,然后根据弹性空间分配可用空间
```
.flex-item{
  flex-basic: auto | ;
}
```

![](https://cask.scotch.io/2015/04/flexbox-flex-basis.jpg)

**flex**
此属性是简写`flex-grow`,`flex-shrink`和`flex-basis`的属性

**align-self**
此属性会将`align-items`的属性覆盖
```
.flex-item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

![](https://cask.scotch.io/2015/04/flexbox-align-self.jpg)
