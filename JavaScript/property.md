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

关于面向对象的语言都支持两种继承方式: 接口继承和实现继承。接口继承只继承方法签名,而实现继承则继承实际的方法。而在 JavaScript 中支持实现继承,而且其实现继承主要是依靠原型链原理。

1.  基于原型链的继承

```
function Animal(name){
  this.name = name;
}
Animal.prototype.eat = function(){
  console.log(this.name + 'eats');
}

function Rabbit(name){
  this.name = name;
}

Rabbit.prototype = new Animal();

Rabbit.prototype.jump = function(){
  console.log(this.name + 'jumps');
}

let rabbit =  new Rabbit('foo');
rabbit.eat(); // foo eats
rabbit.jump(); // foo jumps;
```

`rabbit`首先会搜索`Rabbit.prototype`,然后`Animal.prototype`。然后,为了完整起见,我们要提到的是,如果在`Animal.prototype`找不到方法则会将在`Object.prototype`搜索,因为`Animal.prototype`他是普通的对象。

![](https://javascript.info/article/class-patterns/class-inheritance-rabbit-animal-2.png)

原型链的问题:

- 包含引用类型值得原型属性会被所有实例共享;而这也正是为什么要在构造函数中,而不是在原型对象中方定义属性的原因。再通过原型来实现继承时,原型实际上会称为另一个类型得实例。于是原先得实例属性也就是成为了现在得原型属性了。

```
function Animal(name){
  this.name = name;
  this.kinds = ['cat', 'dog'];
}

function Rabbit(name){
  this.name = name;
}

Rabbit.prototype = new Animal();

let rabbit1 = new Rabbit('bar');
animal.kinds.push('rabbit');
let rabbit2 = new Rabbit('foo');
console.log(rabbit.kinds); // ['cat', 'dog', 'rabbbit'];
```

- 在创建子类型的实例时,不能向父类型的构造函数中传递参数。实际上,应该是说没有办法在不影响所有对象的实例的情况下,给父类型的构造函数传递参数。

2.  借用构造函数

为了解决原型中包含引用类型值所带来的问题的过程中,我们使用借用构造函数的技术。即在子类型构造函数的内部调用父类型构造函数。

```
function Animal(name){
  this.name = name;
  this.kinds = ['cat', 'dog'];
}

function Rabbit(name){
  Animal.call(this);
}

Rabbit.prototype = new Animal();

let rabbit1 = new Rabbit('bar');
rabbit1.kinds.push('rabbit');
let rabbit2 = new Rabbit('foo');
console.log(rabbit1.kinds);
console.log(rabbit2.kinds)
```

相对于原型链来说,借用构造函数有一个很大的优势,既可以在子类型构造函数中向父类型构造函数传递参数,如果仅仅是借用构造函数,那么而将无法避免构造函数模式存在的问题--方法都在构造函数定义,因此函数复用就无从谈起了。

3.  组合继承

结合原型链模式和构造函数两种继承模式的优点将其组合起来。称之为组合继承模式。用原型链实现对原型属性和方法的继承,而通过借用构造函数来实现对实例属性的继承。

```
function Animal(name){
  this.name = name;
}

Animal.prototype.eat = function(){
  console.log(this.name + ' eats');
}

function Rabbit(name){
  Animal.call(this, name);
}

Rabbit.prototype = new Animal();

Rabbit.prototype.jump = function(){
  console.log(this.name + ' jump');
}

let rabbit1 = new Rabbit('bar');
rabbit1.eat();
rabbit1.jump();
```

4.  原型式继承

另一种实现继承的方法是借助原型可以基于已有的对象创建新对象,同时还不必因此创建自定义类型。具体如下

```
function createRabbit(o){
  function Rabbit(){};
  Animal.prototype = o;
  return new Rabbit();
}
```

ES5 新增了`Object.create()`方法规范化了原型式继承。这个方法接收两个参数: 一个用作新对象原型的对象和(可选的)一个为新对象定义额外属性的对象。在传入一个参数的情况下。

```
let animal = {
  eat: function(){
    console.log(this.name + ' eat')
  }
}

let rabbit = Object.create(animal);
rabbit.name = 'foo';
rabbit.eat();
```

在没有兴师动众的创建构造函数,而只想让一个对象于另一个对象保持类似的情况下,原型式的继承是完全可以胜任的,不过包含引用类型值得属性始终都会始终共享相应得值,就像使用原型模式一样。

5.  寄生式继承

寄生式继承的思路与寄生构造函数和工厂模式类似,即创建一个仅用于封装继承过程的函数,该函数在内部以某种方式来增强对象,最后在返回对象

```
function createRabbit(original){
  let clone = object.create(original); // 通过调用函数创建一个对象
  clone.sayName = function(){
    console.log(this.name)
  }
  return clone;
}
```

在考虑对象而不是自定义类型和构造函数的情况下,寄生式继承也是一种有用的模式

6.  寄生组合式继承

前面提到过的组合继承模式也有自己的不足,那就是会调用两次父类型构造函数,一次是在创建子类型原型的时候,一次是在子类型构造函数内部。而所谓的寄生组合式继承,即通过借用构造函数类继承属性,通过原型链的混成形式来继承方法。其背后的基本思路是: **不必为了指定子类型的原型而调用父类型的构造函数,我们所需要的无非就是父类型原型的一个副本而已,本质上,就是使用寄生式继承来继承夫类型的原型,然后再将结果指定给子类型的原型**

```
function inheritProperty(animal, rabbit){
  let prototype = Object.create(animal.prototype);
  prototype.constructor = rabbit;
  rabbit.prototype = prototype;
}
function Animal(name){
  this.name = name;
  this.kinds = ['cat', 'dog'];
}

Animal.prototype.eat = function(){
  console.log(this.name + 'eats');
}

function Rabbit(name, age){
  Animal.call(this, name);
  this.age = age;
}

inheritProperty(Animal, Rabbit)

Rabbit.prototype.jump = function(){
  console.log(this.name + 'jump');
}

let rabbit1 = new Rabbit('foo');
rabbit1.eat();
```

这样的话只掉用了一次父类型构造函数,并且避免了在`Animal.prototype`上面创建不必要的属性。

7.  ES6 继承

在 ES6 中可以通过`extends`关键字实现继承,这比 ES5 的通过修改原型链实现继承,清晰和方便很多

```
class Animal{
  constructor(name){
    this.name = name;
  }
  sayName(){
    console.log(this.name);
  }
}

class Rabbit extends Animal {
  constructor(name, age){
    super(name);
    this.age = age;
  }
  sayAge(){
    super
    console.log(this.age);
  }
}

let rabbit1 = new Rabbit('foo', 19);
rabbit1.sayAge();
rabbit1.sayName();
```

上面代码中,出现的`super`关键字,他在这表示父类的构造函数,用来创建父类的`this`对象

子类必须在`constructor`方法中调用`super`方法,否则新建实例时会报错。

ES5 的继承,实质是先创造子类的实例对象`this`,然后再将父类的方法添加到`this`上面`Parent.call(this)`。

而 ES6 的继承机制完全不同,实质是先创造父类的实例对象`this`(所以必须先调用`super`方法),然后在用子类的构造函数修改`this`。

`super`用法分为两种情况,对象使用和函数使用:

- 函数使用: `super`作为函数调用时,代表父类的构造函数,ES6 要求,子类的构造函数必须执行`super`函数
- 对象使用: `super`作为对象时,在普通方法中,执行父类的原型对象;在静态方法中,指向父类。在子类普通方法中通过`super`调用父类的方法时,方法内部的`this`指向当前的子类实例,再子类的静态方法中通过`super`调用父类的方法时,方法内部的`this`指向当前的子类

**ES6继承的`prototype`和`__protot__`属性**:

在ES5实现中,每一个对象都有`__proto__`属性,指向对应的构造函数的`prototype`属性。`Class`作为构造函数的语法糖,同时有`prototype`属性和`__proto__`属性,因此同时存在两条继承链

+ 子类的`__proto__`属性,表示构造函数的继承,总是指向父类
+ 子类`prototype`属性的`__proto__`属性,表示方法的继承,总是指向父类的`prototype`属性
```
class A {

}
class B extends A {
  
}

B.__proto__ === A // true;
B.prototype.__proto__ === A.prototype; // true
```



 