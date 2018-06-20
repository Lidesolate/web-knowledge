## 原型

### [[prototyoe]]

JavaScript 的对象有一个特殊的`[[prototype]]`内置属性,其实就是对于其他对象的引用。几乎所有的对象在创建时`[[prototype]]`都会被赋予一个非空的值

**注意: 对象的`[[prototype]]`可以为空**

`[[property]]`引用有什么用呢,当我们试图引用对象的属性时会被触发`[[Get]]`操作,比如`myObject.a`。对于默认的`[[Get]]`操作来说。第一步是检查对象本身是否有这个属性,如果有的话使用它。但是如果无法在对象本身找到需要的属性,就会继续访问对象的`[[prototype]]`链。

```
let animal = {
  eats: tre
};
let rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.jumps); // true;
console.log(rabbit.eats);  // true
```

![](https://javascript.info/article/prototype-inheritance/proto-animal-rabbit.png)

现在`rabbit`对象的`[[prototype]]`关联到了`animal`对象，显然`rabbit`对象不存在`eats`属性,但是尽管如此,属性访问仍然成功的找到了`eats`;

如果`animal`也找不到`eats`属性,并且`[[prototype]]`链不为空的话,就会继续查找下去。

这个过程会持续找到匹配的属性名或者查找完整条`[[prototype]]`链,如果是后者的话`[[Get]]`操作的返回值是`undefeind`。

所有普通的`[[prototype]]`链最终都会指向内置的`Object.prototype`。由于所有的普通对象都源于这个`Object.prototype`对象,所以他包含 JavaScript 中许多的通用功能,而`Object.prototype`的`[[prototype]]`会指向`null`。

### 属性设置和屏蔽

给一个对象设置属性并不仅仅是添加一个新属性或者此修改已有的属性值。现在我们完整的讲解以下这个过程

```
let animal = {
  walk: function(){
    console.log('animal walk')
  }
}

let rabbit = Object.create(animal);
rabbit.walk = function(){
  console.log('rabbit walk');
}
```

如果`rabbit`对象中包含命名为`walk`的普通数据访问属性,这条赋值语句只会修改已有的属性值。如果`walk`不是直接存在于`rabbit`中,`[[prototype]]`链就会被遍历,类似`[[Get]]`操作。如果原型链上找不到`walk`,`walk`就会被直接添加到`rabbit`上。
如果属性名`walk`即出现在`rabbit`中也出现在`rabbit`的`[[prototype]]`链上层,那么就会发生屏蔽。`rabbit`中包含的`walk`会屏蔽原型链上层的所有`walk`属性,因为`rabbit.walk`总是会选择原型链中最底层的`walk`属性

![](https://javascript.info/article/prototype-inheritance/proto-animal-rabbit-walk-2.png)

对于`walk`不直接存在于`rabbit`中而是存在于原型链上层时`rabbit.walk = function(){}`会出现的三种情况

1.  如果在`[[prototype]]`链上层存在名为`walk`的普通数据访问属性,并且没有被标记为只读(`writeable: false`),那就会直接在`rabbit`中添加一个名为`walk`的属性
2.  如果在`[[prototype]]`链上层存在名为`walk`的普通数据访问属性,但是被标记为只读(`writeable: false`)
    ,那么无法修改已有属性或者在`rabbit`上创建屏蔽属性。如果运行在严格模式下,代码会抛出一个错误。否则这条赋值语句会忽略。总之,不会发生屏蔽
3.  如果在`[[prototype]]`链上层存在`walk`属性并且他是一个`setter`,那就一定会调用这个`setter`。`walk`不会添加到`rabbit`,也不会重新定义`walk`这个`setter`。例如

```
let animal = {
  set walk(value){
    console.log('animal walk');
  }
}

let rabbit = Object.create(animal);

rabbit.walk = 'true';
```

如果你希望在第二种和第三种也屏蔽`walk`,那就不能使用`=`操作符来赋值.而是使用`Object.defineProperty(...)`来向`rabbit`添加`walk`。

```
let animal = {
  set walk(value){
    console.log('animal walk');
  }
}

let rabbit = Object.create(animal);

rabbit.walk = 'true';

Object.defineProperty(rabbit, 'walk', {
  value: function(){
    console.log('rabbit walk')
  },
})

rabbit.walk();
```

### 类函数

在 JavaScript 中,无法像 java 那样创建一个真正的意义上的类,所以只能利用 JavaScript 中函数的特性去模仿类。这种特性是: **所有名为`prototype`的公有且并不可枚举的属性,他会指向 另一个对象**

```
function foo(){
  // ...
}

Foo.prototype;
```

这个对象通常被称为`Foo`对象的原型。我们之前讨论过`new`函数的作用

1.  创建一个空对象
2.  将空对象的`[[prototype]]`连接到构造函数的原型对象上
3.  这对象会绑定到函数调用的`this`上
4.  如果构造函数不返回对象上的话,则返回新创建的对象

其中第二步的连接对象就是`Foo.prototype`上。
在面向类的语言中,类可以被复制多次.就想用模具制作东西一样。但是在 JavaScript 中,并没有类似的复制机制。你不能创建一个类的多个实例,只能创建多个对象,他们`[[prototype]]`关联的是同一个对象。但是在默认情况下并不会进行复制,因此这些对象并会完全失去联系,他们是互相关联的

`new Foo()`会生成一份新对象,这个新对象的内部链接`[[prototype]]`关联的是`Foo.prototype`对象。最后我们的到了两个对象,他们之间互相关联,我们并没有从类中复制任何行为到一个对象中,只是让两个对象互相关联。而不光是`new`操作符能够实现这样的效果,`Object.create()`也可以实现。

### constructor 问题

在 JavaScript 中所有的函数都会有一个属性`prototype`,而在`prototype`指向的对象上会拥有一个指向`constructor`指向函数本身的属性的对象。

```
function Rabbit(){}

// Rabbit.prototype = { constructor: Rabbit };
```

![](https://javascript.info/article/function-prototype/function-prototype-constructor.png)

我们可以检查他

```
function Rabbit(){}

console.log(Rabbit.prototype.constructor == Rabbit); // true
```

而如果我们什么都不做改变的话,`constructor`属性是可以通过`[[prototype]]`以下方式提供给所有关联`Rabbit`函数的原型对象的对象

```
function Rabbit(){};

let rabbit = new Rabbit();

console.log(rabbit.constructor == Rabbit); // true
```

![](https://javascript.info/article/function-prototype/rabbit-prototype-constructor.png)

但是 JavaScript 中并不能确保正确的`constructor`的值

```
function Rabbit(){}
Rabbit.prototype = {
  jumps: true
}
let rabbit = new Rabbit();
console.log(rabbit.constructor === Rabbit); // false
```

### 类模式

在面向对象编程中,类是用于创建对象的可扩展程序代码模块,为状态(成员变量)和行为实现(成员函数或方法)提供初始值。而在 JavaScript 有这么几种创建对象的方式

1.  工厂模式:

```
function createRabbit(name, age, walk){
  let rabbit = Object.create(null);
  rabbit.name =  name;
  rabbit.age = age;
  rabbit.walk = walk;
  rabbit.sayName = function(){
    console.log(this.name);
  }
  return rabbit;
}

let rabbit1 = new createRabbit('foo', 29, 'jump');
rabbit1.sayName(); // 'foo'
```

这种模式的优点是解决了创建多个相似对象的问题,但缺点是没有解决对象识别的问题(知道一个对象的类型)

2.  构造函数模式

我们可以通过`new`操作符来将函数变成构造函数来调用,用构造函数将前面的例子重写

```
function createRabbit(name, age, walk){
  this.name = name;
  this.age = age;
  this.walk = walk;
  this.sayName = function(){
    console.log(this.name);
  }
}

let rabbit1 = new createRabbit('foo', 10, 'jump');
rabbit1.sayName(); // foo
rabbit1.constructor === createRabbit; // true
```

生成的对象都会通过`[[prototype]]`来访问`constructor`属性,因此对象标识的问题解决了,不过因为`constructor`有可能被赋值给其他变量,因此检测对象类型,还是`instanceof`操作符更靠谱。

构造函数也会有一个主要的问题,就是每个方法都要在每个实例上重新创建一遍。而每个方法所执行的行为一样的,这样的浪费是没有必要的。

3.  构造原型模式

前文提到原型会解决这个构造函数的所带来的问题,我们可以通过函数的原型对象来让所有对象实例去共享方法,这样只需要定义一次的方法就可以了,而不需要在每个实力上创建一遍

```
function Rabbit(name){
  this.name = name;
}
Rabbit.prototype.sayName = function(){
  console.log(this.name);
}
let rabbit = new Rabbit('foo');
```

![](https://javascript.info/article/class-patterns/rabbit-animal-independent-1.png)

4.  ES6 模式

基本上，ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```
class Rabbit {
  constructor(name){
    this.name = name;
  }
  sayName(){
    console.log(this.name);
  }
}
let rabbit = new Rabbit('foo');
rabbit.sayName(); // foo;
```

### 继承
