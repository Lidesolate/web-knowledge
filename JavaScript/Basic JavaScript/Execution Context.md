## 执行上下文

**概述**:

为执行 JS 代码,并跟踪其运行时求值,JavaScript 规范定义了执行上下文的概念。从逻辑上讲,执行上下文是用栈来维护的,栈与调用栈这个通用概念有关

JavaScript 有几种类型: 全局代码,函数代码,`eval`代码和模块代码;每种代码都在其执行上下文中求值。不同的代码类型及其对应的对象可能会影响执行上下文的结构: 比如`generator`函数将其`generator`对象保存在上下文中

考虑下面的一个递归函数调用

```
function recursive(flag){
  if(flag === 2){
    return;
  }

  recursive(++flag);
}

recursive(0);
```

当函数被调用的时,就创建了一个新的执行上下文,并被压到栈中-此时他变成一个活动的执行上下文。当函数返回时,其上下文被从栈中弹出

调用另一个上下文的上下文被称为调用者(caller)。被调用的上下文相应地被称为被调用者(callee)。在我们的例子中,`recursive`函数在递归调用他本身时,同时扮演了这两个角色: 既是调用者,又是被调用者

**执行上下文堆栈**: 执行上下文栈是一种 LIFO(后进先出)结构,用于维护控制流程和执行顺序

![](http://www.xiaojichao.com/static/upload/20171215/pVd7fNaNvTzy_r_jWCk3.png)

我们还可以了解到,全局上下文总是在栈的底部,他是由之前任何其他上下文的执行创建的

通常一个上下文的代码会一直运行到结束,不过正如我们上面提到过的,有些对象,比如`generator`,可能会违反栈的 LIFO 顺序,一个`generator`函数可能会挂起其正在执行的上下文的,并在其结束前将其从栈中删除。一旦`generator`再次激活,他上下文就被恢复,并再次压入栈中

```
function *gen(){
  yield 1;
  return 2;
}

let g = gen();

console.log(
  g.next().value; 1
  g.next().value; 2
)
```

这里的`yield`语句将值返回给调用者,并弹出上下文。在第二个`next`调用时,同一个上下文被再次压入栈中,并恢复。这样的上下文可能会比创建他的调用者活的长,所以会违反 LIFO 结构

### 作用域

每个执行上下文都一个相关联的词法环境。

**词法环境**: 词法环境是一种用于定义出现在上下文中的标识符于其值之间的关联的结构。每个环境有一个对可选的父环境的引用

所以,环境就是定义在一个作用域中的变量,函数和类的存储

从技术上讲,环境是由一对环境记录(一个将标识符映射到值的实际存储表)以及对父的引用可能是`null`组成的

对于如下代码:

```
let x = 10;
let y = 20;

function foo(z){
  let x = 100;
  return x + y + z;
}

foo(30);
```

全局上下文以及`foo`函数的上下文的环境结构看起来会像下面这样

![](http://www.xiaojichao.com/static/upload/20171215/_4_iCT4i2nWck7DXOB3_.png)

变量查找的时候会产生变量屏蔽的规则: 如果一个变量在自己的环境中找不到,就试着在父环境,父环境中的父环境中查找他,以此类推,直到查完整个环境链。这就解释了我们为什么还可以去访问变量 y,因为他是在父环境中找到的。

环境记录根据类型而用所不同。有对象环境记录和声明式环境记录。在声明式记录上,还有函数环境记录和模块环境记录。每种类型的记录都有其特定的属性。不过标识符解析的通用机制对于所有环境都是通用的,并且不依赖于记录的类型

全局环境的记录就是对象环境记录的一个例子。这样的记录也有关联的绑定对象,该对象会存储一些来自该记录的属性,但是不会存储来自其他记录的属性反之亦然。绑定对象也可以被提供`this`值

```
var x = 10;
let y = 20;

console.log(
  x, // 10
  y  // 20
)

// 只有x被添加到绑定对象
// 全局环境的绑定对象相当于`this`

console.log(
  this.x // 10
  this.y // undefined
)

// 绑定对象可以存储一个名成,该名称不添加到环境记录

this['not valid ID'] = 30;

console.log(
  this['not valid ID'], // 30
)
```

![](http://www.xiaojichao.com/static/upload/20171215/tJEx2IUIGj7bocEq3rL3.png)

注意,绑定对象的存在是为了涵盖以前的构造(比如`var`声明和`with`语句),这种构造也将其对象作为绑定对象提供。

### 变量查询

在 JavaScript 中,变量的赋值操作会执行两个动作,首先编译器会在当前作用域中声明一个变量(如果之前没有声明过),然后在运行时引擎会在作用域中查找该变量,如果能找到就会对他进行赋值。查找的过程由作用域进行协助,但是引擎执行怎样的查找,会影响最终的查找结果。
而在这个声明语句中`var a = 2`引擎会为变量`a`进行`LHS`查询,另外一个查找的类型叫做`RHS`。当变量出现在赋值操作的左侧时进行`LHS`查询,出现在右侧时进行`RHS`查询。更准确一点，
**RHS 查询与简单的查找某个变量的值别无二至,而 LHS 查询则是试图找到变量的容器本身,从而可以对其及进行赋值**
考虑下面的程序,其中既有`LHS`也有`RHS`引用

```
function foo(a){
  console.log(a); //2
}

foo(2);
```

最后一行`foo(...)`函数的调用需要对`foo`进行`RHS`引用,意味着去找到 foo 的值,并把他给我。而当`2`被当作参数传递给`foo(...)`函数时,`2`会被分配给参数`a`。为了参数`a`(隐式的)分配值,需要进行一次`LHS`查询,这里还有对 a 进行的`RHS`引用,将得到的值传给了`console.log(...)`。`console.log(...)`本身也需要一个引用能够执行,因此会对`console`对象进行`RHS`查询,并且检查得到的值中是否有一个叫做`log`的方法。

### 变量提升

在 JavaScript 中存在变量提升的现象,如下

```
console.log(a); // undefiend

var a = 2;
```

至于为什么会造成这个现象,会将声明语句`var a = 2`看成两个声明: `var a`和`a = 2`。第一个定义声明是在编译阶段进行的,第二个赋值声明会被留在原地等待执行阶段,具体的处理如下

1.  遇到`var a`编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合当中。如果是,编译器会忽略该声明,继续进行编译,否则他会要求作用域的集合中声明一个新的变量。并命名为`a`
2.  接下来编译器会为引擎生成运行时所需的代码,这些代码被用来处理`a = 2`这个赋值操作。引擎运行时会首先询问作用域,在当前的作用域集合中是否存在一个叫做`a`的变量,如果是,引擎就会使用那个变量,如果否,引擎会随着作用域链继续查找该变量。如果最终找到该变量,就会将`2`赋值给他。否则引擎会继续查找该变量。
    **总结: 包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理**
    因此之前的代码片段会进行这样的处理

```
var a;
console.log(a);
a = 2;
```

值得注意的是,函数声明会提升,函数表达式却不会被提升

```
foo(); // TypeError
var foo = function bar(){...}
```

函数声明和变量声明都会提升，但是一个值得注意的细节是函数首先会被提升,然后才是变量

```
foo(); //1
var foo;
function foo(){
  console.log(1);
}
foo = function(){
  console.log(2);
}
```

### 块作用域

在 ES6 之前 JavaScript 是没有块作用域,因此会造成某些问题

```
if(true){
  var a = 3;
}
console.log(a); // 3
```

我们只想变量`a`在`if`语句块内使用,然而他却会绑定在外部作用域中。这会造成一个结果,开发者需要小心的检查自己的代码,以防止在作用域外意外的使用某些变量。

而在 ES6 新的变量声明`let`和`const`关键字解决了这个问题。
`let`和`const`关键字可以将变量绑定到所在的任意作用域中(通常是`{...}`内部),也就意味着`let`为其声明的变量隐式的劫持了所在的块作用域。

```
if(true){
  let a = 3;
}
console.log(a); // referenceError;
```

而`let`另一个优势就是在循环中,例如

```
var a = [];
for(var i = 0; i < 10; i++){
  a[i] = function(){
    console.log(i);
  }
}
a[0](); // 10
```

由于`i`是由`var`声明的,因此全局作用域都有效,而全局只有一个变量`i`,因此每当执行函数,`RHS`查询都查询最后一次循环所改变的变量`i`。
在`let`关键字之前我们为了规避这种现象,通常使用自执行函数来形成独自的作用域。

```
var a = [];
for(var i = 0; i < 10; i++){
  (function(i){
    a[i] = function(){
      console.log(i)
    }
  })(i)
};
a[2]() // 2
```

而新出现的`let`关键字的特性不仅将`i`绑定到了 for 循环的块中,事实上将其重新绑定到了循环的每一个迭代中,确保使用上一个循环迭代结束时的值重新进行赋值

```
let a = [];
for(let i = 0; i < 10; i++){
  a[i] = function(){
    console.log(i)
  }
}
a[10]() // 10
```

此外在`let`和`const`还有区别于`var`的地方

- 不存在变量提升:

`var`变量会发生变量提升现象,即变量可以在声明之前使用,值为`undefeind`。不过这种现象会导致某些问题。为了纠正这种现象
`let`命令改变了语法行为,他所声明的变量一定要在声明后使用,否则报错。

```
console.log(foo); // 输出undefined
var foo = 2;

// let的情况
console.log(bar); // 报错
let bar = 2;
```

- 暂时性死区:

只要块级作用域存在`let`命令,他所声明的变量就绑定这个区域,不在受外部的影响

```
var temp = 123;
if(true){
  temp = 'abc'; // ReferenceError;
  let temp
}
```

ES6 明确规定,如果区块中存在`let`和`const`命令,这个区对这些命令声明的变量,从一开始就形成了封闭作用域,凡是在声明之前就使用这些变量,就会报错。我们称之为暂时性死区

```
if(true){
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```

- 不允许重复声明

`let`不允许在相同作用域内,重复声明同一个变量

```
// error
function func(){
  let a = 10;
  var a = 1;
}
// error
function func(){
  let a = 10;
  let a = 1;
}
```

因此不能在函数内部重新声明参数

```
function func(arg){
  let arg // error
}
function func(arg){
  {
    let arg; // 不报错
  }
}
```

- `const`值的常量性:

`const`声明一个只读的常量,一旦声明,常量的值就不能改变。不过是相对于基本类型而言,而对于引用类型来说却不一样

```
const PI = 3.14;
PI = 3; // TypeError

const foo = {};
foo.a = 1;
foo = {}; // TypeError
```

`const`的本质,并不是变量的值不得改动,而是变量指向的那个内存地址不得改动。对于引用类型而言,`const`能保证的是这个指针的是固定的,至于他指定的数据结构是不是可变的,就完全不能控制的。
而如果我们需要将一个对象完全不可变,我们需要用到`Object.freeze()`函数。

```
let constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object'){
      constantize(obj[key])
    }
  })
}
```

### 闭包

**定义: 当前函数可以记住并访问所在的词法作用域时, 就产生了闭包,即使函数实在当前词法作用域之外执行**

我们用一个例子来展示闭包的工作原理

```
function makeCounter(){
  let count = 0;
  return function(){
    return count++;
  }
}
```

1.  当脚本刚开始执行的时候,只有全局词汇环境

![](https://javascript.info/article/closure/lexenv-nested-makecounter-1.png)

所有声明的函数都会有一个隐含的属性`[[environment]]`也就是上文提到的词法环境它是一个包含函数作用域内标识符映射到值的存储表和对父作用域的引用的属性

这里的`makeCounter`是在全球词法环境中创建的,因此`[[environment]]`其中的对父作用域的引用指向全局作用域

2.  代码执行,并且调用`makeCounter()`,下面是执行在第一行的时刻的快照`makeCounter()`

![](https://javascript.info/article/closure/lexenv-nested-makecounter-2.png)

在调用`makeCOunter`的那一刻,词法环境被创造出来,用来保持其变量和参数和对父作用域的引用

所以我们现在由两个词法环境:第一个是全局的,第二个是当前的`makeCounter`调用,外部引用是全局的。

3.  在执行过程中`makeCounter`,会创建一个嵌套函数

函数算是否使用函数声明或者函数表达式创建并不重要。所有函数都会通过`[[Enviroment]]`引用他们所在的词法环境的属性。所以我们新的嵌套函数也可以得到他

对于我们新的嵌套函数,他的词法环境中包含对`makeCounter`词法环境的引用

![](https://javascript.info/article/closure/lexenv-nested-makecounter-3.png)

4.  随着执行的继续,调用`makeCounter()`完成,结果嵌套函数被分配给全局变量

![](https://javascript.info/article/closure/lexenv-nested-makecounter-4.png)

该函数只有一行: `return counst++`,当我们运行时它会被执行

5.  当`counter()`被调用时,会为他创建一个空的词法环境,它本身没有局部变量,但是其中函数有的`[[Environment]]`属性存在对`makeCounter`词法环境的引用,所以他可以访问创建他的前一个调用的变量

![](https://javascript.info/article/closure/lexenv-nested-makecounter-5.png)

现在,如果它访问一个变量,他首先搜索他自己的词法环境(空白),然后搜索前一个`makeCounter`调用的词法环境,然后搜索全局变量

当它寻找`count`,他会在`makeCounter`的词法环境中找到变量

**注意: 虽然`makeCounter()`前一段时间调用完成,但其词法环境仍保留在内存中,因为嵌套函数中的`[[Environment]]`引用它的词法环境**

通常,只要有可能使用他的函数,词法环境对象就会激活,只有当没有引用他的函数的时候,他才会被清除

6.  调用`counter()`不仅返回值`count`,而且还增加他的值,请注意,该值`count`会在发现他的环境中完全修改

![](https://javascript.info/article/closure/lexenv-nested-makecounter-6.png)

### this

`this`值是一个动态并隐式传给上下文的代码的特殊对象。我们可以把它当作是一个隐式的额外形参,能够访问,但是不能修改

`this`值的用途是为多个对象执行相同的代码

**定义：`this`是一个隐式的上下文对象,可以从一个执行上下文的代码中访问,从而可以为多个对象应用相同的代码**

而因为`this`是动态的,所以他实在函数调用的时候被绑定的。所以这完全取决于函数的调用位置

通常`this`的绑定规则有四种,在 ES6 后又出现了第 5 种规则

- 默认绑定:

首先要介绍的是最常用的函数调用类型,独立函数调用,可以把这条规则看作是无法应用其他规则的默认规则,如下代码

```
var a = 2;
function foo(){
  console.log(this.a);
}
foo() // 2;
```

我们看到当调用`foo()`时,`this.a`被解析成了全局变量`a`。这是因为函数调用时应用了`this`的默认绑定,因此`this`指向全局对象。
可以通过分析调用位置来看看`foo()`时如何调用的。在代码中,`foo()`是直接使用不带任何修饰的函数引用进行调用的,因此只能使用默认绑定,无法应用其他规则。

而 ES6 后,因为出现新的变量声明关键字`let`和`const`,用他们声明的变量将不会挂载到全局对象上,例如

```
lat a = 2;
function foo(){
  console.log(this.a);
}
foo(); // undefined
```

- 隐式绑定:

另一条需要考虑的规则是调用位置是否有上下文对象,或者说是否被某个对象拥有或者包含。例如

```
function foo(){
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}
obj.foo(); // 2
```

调用位置会使用 obj 上下文来引用函数,当函数引用有上下文对象时,隐式绑定规则会把函数调用中的`this`绑定到上下文对象。因为调用`foo()`时`this`绑定到`obj`,因此`this.a`和`obj.a`是一样的。。

对象属性引用链中只有上一层或者说最后一层在调用位置中起作用。

```
function foo(){
  console.log(this.a)
}

var obj2 = {
  a: 42,
  foo: foo
}

var obj1 = {
  a: 2,
  obj2: obj2
}

obj1.obj2.foo(); // 42
```

**隐式丢失:**

一个最常见的`this`绑定问题就是被隐式绑定的函数会丢失绑定对象,也就是说他会应用默认绑定,从而把`this`绑定到全局对象或者`undefiend`上,取决于是否是严格模式

```
function foo(){
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};

var bar = obj.foo; // 函数别名
var a = 'window';
bar(); // window
```

虽然`bar`是`obj.foo`的一个引用,但是实际上,它引用的是`foo`函数本身,因此此时的`bar()`其实是一个不带任何修饰的函数调用,因此应用了默认绑定。而这种现象也会出现在传参中

```
function foo(){
  console.log(this.a);
}

function doFoo(fn){
  // fn = obj.foo 隐式赋值
  fn();
}

var obj = {
  a: 2,
  foo: foo
}

var a = 'window';
doFoo(obj.foo); // 'window'
```

- 显式绑定:

隐式绑定的规则是,我们必须在一个对象内部包含一个指向函数的属性,并通过这个属性简介引用函数,从而把`this`间接(隐式)绑定到这个对象。但是我们也可以用`call`和`apply`方法来将`this`强制绑定到对象上,我们称之为显示绑定

```
function foo(){
  console.log(this.a);
}

var obj = {
  a: 2
}

foo.call(obj); // 2
```

通过`foo.call(...)`,我们可以在调用`foo`时强制把他的`this`绑定到`obj`上。而且用这种方法也可以解决隐式绑定的问题

```
function bind(fn, obj){
  return function(){
    return fn.call(obj);
  }
}
function foo(){
  console.log(this.a);
}
var obj = {
  a: 2
}
bar = bind(foo, obj);
bar(); //2
```
我们称这种方式为硬绑定,由于硬绑定是一种常用的方法,所以`ES5`中提供了内置方法`bind()`,他会返回一个硬编码的新函数,他会把你指定的参数设置为`this`上下文并调用原始函数。

+ new绑定:

我们使用`new`来调用函数,或者发生构造函数调用的时候,会自动执行下面的操作
1. 创建一个全新的对象
2. 这个对象的`[[protottype]]`连接到构造函数的原型对象上
3. 这个新对象会绑定到函数调用的`this`
4. 如果函数没有返回其他对象,那么`new`表达式中的函数调用会自动返回这个新对象。
```
function foo(a){
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```

+ 箭头函数绑定:

箭头函数不使用`this`的四种标准规则,而是根据外层(函数或全局)作用域来决定`this`。
```
function foo(){
  return (a) => {
    console.log(this.a);
  }
}

var obj1 = {
  a: 2
}
var obj2 = {
  a: 3
}

var bar = foo.call(obj1);
bar.call(obj2); // 2
```
`foo()`内部创建的箭头函数会捕获调用时`foo()`的`this`。由于`foo()`的`this`绑定到`obj1`,`bar`的`this`也会绑定到`obj1`。箭头函数的绑定无法被修改(new也不行)
