## vue

### Virtual DOM

#### 什么是Virtual DOM

Virtual DOM可以看作一棵模拟了DOM树的JavaScript树,其主要是通过vnode实现一个无状态的组件,在组件状态发生更新时,然后触发Virtual Dom数据的变化,然后通过Virtual DOM和真实DOM的对比,再对真实DOM更新,可以简单认为Virtual DOM是真实DOM的缓存

#### 为什么用Virtual DOM

这是因为当我们实现一个具有复杂状态的界面时,如果我们在每个可能发生变化的组件上都绑定事件,绑定字段数据,这样很快由于状态太多,我们需要维护的事件和字段就会越来越多,因此我们只要将视图和状态分开,只要视图发生变化,对应状态也发生变化,然后状态变化,我们再重绘整个视图。因此Virtual Dom应运而生,状态变化先反馈到Virtual Dom上,Virtual Dom找到最小更新视图,最后批量更新到真实DOM,从而达到性能的提升

基于Virtual DOM的数据更新于UI同步机制

![](https://images2015.cnblogs.com/blog/572874/201705/572874-20170505152506554-159618539.png)

所谓的Virtual DOM算法,包括几个步骤

1. 用JavaScript对象结构表示DOM树的结构;然后这个树构建一个真正的DOM树,插到文档当中
2. 当状态变更的时候,重新构造一棵新的对象树。然后用新的树和旧的数进行比较,记录两颗树差异
3. 把所记录的差异应用到步骤1所构建的真正的DOM树上,视图就更新了

#### 算法实现

1.用JS对象模拟DOM树

```
class Element {
  constructor(tagName, props, children){
    this.tagName = tagName;
    this.props = props;
    this.children = children
  }
  render(){
    let el = document.createElement(this.tagName);
    for (let propName in this.props) {
      el.setAttribute(propName, this.props[propName]);
    }
    let children = this.children || [];
    children.forEach(child => {
      let childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
      el.appendChild(childEl)
    });

    return el;
  }
}

function el(tagName, props, children){
  return new Element(tagName, props, children)
}

let ul = el('ul', {id: 'list'}, [
  el('li', {class: 'item'}, ['item1'])
])

let ulRoot = ul.render();
```

#### 2. 比较两颗虚拟DOM树的差异

比较两颗DOM树的差异是Virtual DOM算法最核心的部分,这也是所谓的Virtual DOM的diff算法,但是再前端中,你很少跨越层级的移动DOM元素,所以Virtual DOM只会对同一个层级的元素进行对比

![](https://camo.githubusercontent.com/a32766a14f6b7fbe631475ed1a186fbd9de7f2c3/687474703a2f2f6c69766f7261732e6769746875622e696f2f626c6f672f7669727475616c2d646f6d2f636f6d706172652d696e2d6c6576656c2e706e67)

在实际的代码中,会对新旧两棵树进行一个深度优先的遍历,这样每个节点都会有一个唯一的标记:

![](https://camo.githubusercontent.com/6cdc35026bcbb6aa0f8fb4aaca3596963192a7f3/687474703a2f2f6c69766f7261732e6769746875622e696f2f626c6f672f7669727475616c2d646f6d2f6466732d77616c6b2e706e67)

在深度优先遍历的时候,每遍历到一个节点就把该节点和新的树进行对比。如果差异的话就记录到一个对象里面

```
function diff(oldTree, newTree){
  let index = 0;
  let patches = {}
  dfswalk(oldTree, newTree, index, patches);
}

function dfswalk(oldTree, newTree, index, patches){
  patches[index] = [];
  diffChildren(oldTree.childredn, newTree.children, index, patches)
}

function diffChildren(oldChildren, newChildren, index, patches){
  let leftNode = null;
  let currentNodeIndex = index;
  oldChildren.forEach((child, i) => {
    let newChild = newChildren[i];
    currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1
    dfswalk(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  });
}
```

例如,上面的`div`和新的`div`有差异,当前的标记是0,那么
```
patches[0] = [{difference}, {difference}]
```

#### 差异类型

上面所说的节点差异指的是什么你,对DOM操作可能会:

1. 替换掉原来的节点,例如把上面的`div`换成了`section`
2. 移动,删除,新增子节点,例如上面`div`的子节点,把`p`和`ul`顺序互换
3. 修改了节点的属性
4. 对于文本节点,文本内容可能会改变

所以定义了几种差异类型:

```
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var Text = 3;
```

对于节点替换,很简单,判断新旧节点的`tagName`和是不是一样的,如果不一样的说明需要替换掉,例如换成`section`,就记录下
```
patches[0] = [{
  type: REPALCE,
  node: newNode
}]
```
如果给`div`新增了属性`id`为`container`,就记录下:
```
patches[0] = [{
  type: REPALCE,
  node: newNode
},{
  type: PROPS,
  props: {
    id: 'container'
  }
}]
```
如果是文本节点,如上面的文本节点2,就记录下

```
patches[2] = [{
  type: text,
  content: 'dom2'
}]
```

但是如果要是把`div`的子节点进行重新排序的话,如果按同层级进行顺序对比的话,他们都会被替换掉,这一样DOM开销就非常大。而实际上是不需要替换节点,而只需要经过节点移动就可以达到,我们只需知道怎么进行移动

#### 列表对比算法

假设现在可以英文字母唯一的标识每一个子节点:

旧的节点顺序:

```
a b c d e f g h i
```
现在最节点进行了删除,插入,移动的操作,新增`j`节点,删除`e`节点,移动`h`节点

新的节点顺序:

```
a b c h d f g i j
```
现在知道了新旧的顺序,求最小的插入,删除操作(移动可以看成是删除和插入操作的结合)。

#### 把差异应用到真正的DOM树上

因为步骤一所构建的JavaScript对象树和`render`出来真正的DOM树的信息,结构是一样的。所以我们可以对那颗DOM树也进行深度优先的遍历,遍历的时候从步骤二生成的`patches`对象中找出当前遍历的节点差异,然后进行DOM操作

```
function patch(node, patches){
  let walker = {index: 0}
  dfsWalk(node, walker, patches);
}

function dfsWalk(node, walker, patches){
  let currentPatches = patches[walker.index]
  let len = node.childNodes ? node.childNodes.length : 0
  for(let i = 0; i < len; i++){ // 深度遍历子节点
    let child = node.childNodes[i];
    walker.index++;
    dfsWalk(child, walker, patches);
  }
  if(currentPatches){
    applyPatches(node, currentPatches); // 对当前节点进行DOM操作
  }
}
```




