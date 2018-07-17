## 冒泡和捕获

一个例子开始,我们将处理程序分配给`div`,但如果您单击任何嵌套标记(<em>),也会运行该处理程序

```
<div onclick="alert('the handler')">
  <em> if you click on em the handler on DIV on<em>
</div>
```

这是因为点击`em`会冒泡到`div`,·而`div`含有点击事件。

### 冒泡

冒泡原理: 当一个事件发生在一个元素上时,他首先在它上面运行处理程序,然后在它得父代上运行,然后一直运行在其他祖先上。

例如,我们由三个嵌套元素`FROM > DIV > P`,每个元素都有一个处理程序:

```
<form onclick="alert('from')">
  FROM
  <div onclick="alert('div')">
    DIV
    <p onClick="alert('p')">p</p>
  </div>
```

点击内部`<p>`第一次运行`onclick`:

1.  现在`p`运行
2.  然后冒泡到`div`
3.  冒泡到`form`
4.  直到`document`对象停止

![](https://javascript.info/article/bubbling-and-capturing/event-order-bubbling.png)

因此,如果我们点击`<p>`,会看到 3 个弹窗: `p->div->form`
这个过程称之为冒泡,因为事件从内部元素冒泡到父元素中。

### event.target

父元素的处理程序始终可以获取有关事件发生的详细信息。

导致该事件的最深嵌套元素为目标元素,可以用`event.target`去访问。

注意与`this(=event.currentTarget)`的区别

- `event.target`是启动事件的目标元素,他不会通过冒泡过程进行更改
- `this`: 是当前元素,它具有当前正在运行的处理程序。

### 停止冒泡

一个冒泡事件直接从目标元素出发。通常情况下,它向上冒泡到`html`,然后到`docuemnt`对象。有些事件甚至到达`window`,调用路径上的所有处理程序。

但任何处理程序都可能决定事件已经完全处理并停止冒泡

他的方法是`event.stopPropagation()`

> `event.stopPropagaation`停止向上移动,但相同事件的其他处理程序将运行,要停止冒泡并阻止当前元素的处理程序运行,如果在一次这样的调用中`event.stopImmediatePropagation()`被调用，则不会调用其余的监听器。

### 捕获

还有另一个称为`捕获`的事件处理阶段。他在实际代码中很少使用,但有时可能很有用。

标准的 DOM 事件描述事件传播的 3 个阶段:

1.  捕捉阶段-事件归结为元素
2.  目标阶段-事件到达目标元素
3.  冒泡阶段-事件从元素中冒出来

![](https://javascript.info/article/bubbling-and-capturing/eventflow.png)

捕获阶段很少使用,通常他对我们是不可见的

使用`on<event>-property`或使用`HTML`属性或使用`HTML`添加的处理程序`addEventListener(event, handler)`不知道有关捕获的任何内容,他们呢只能在第二阶段和第三阶段运行

要想知道捕获阶段的事件,我们需要设置`addEventListener`的第三个参数为`true`

这个可选的最后一个参数由两个可能的值

- `false`: 该处理程序设置在冒泡阶段
- `true`: 该处理程序将设置在捕获阶段

### 事件委托

捕获和冒泡使我们能够实现事件委托这种事件处理模式

我们的想法是: 如果我们有很多类似的方式来处理元素,那么我们就不用每个元素分配一个处理程序,而是在他们的共同祖先上防止一个处理程序。我们可以根据处理程序中的`event.target`,查看事件实际发生的位置并处理它。

```
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>

// js

let ul = document.querySelector('#ul');
ul.addEventListener('click',(e)=>{
  if(e.target.tagName === 'LI'){
    console.log(e.target.innerHTML);
  }
})
```

### 标记操作

事件委托可以用于优化事件处理。我们使用单个处理程序来处理许多元素的类似操作。但是我们也可以使用单个处理程序作为许多不同事物的入口点。

例如我们制作一个带有保存,加载,搜索等按钮的菜单,并且都有与之对应的方法。我们可以为整个菜单添加一个处理程序,并用`data-action`为要调用方法的按钮添加属性。

```
<div id="menu">
  <button data-action="save">Save</button>
  <button data-action="load">Load</button>
  <button data-action="search">Search</button>
</div>

// js
class Menu {
  constructor(elem) {
    this._elem = elem;
    elem.onclick = this.onClick.bind(this); // (*)
  }

  save() {
    alert('saving');
  }

  load() {
    alert('loading');
  }

  search() {
    alert('searching');
  }

  onClick(event) {
    let action = event.target.dataset.action;
    if (action) {
      this[action]();
    }
  };
}

new Menu(menu);
```
