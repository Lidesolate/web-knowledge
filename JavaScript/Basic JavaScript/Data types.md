## 数据类型

### 内置类型

在 JavaScript 中有七种数据类型:

- 空值(null)
- 未定义(undefined)
- 布尔值(boolean)
- 数字(number)
- 字符串(string)
- 对象(object)
- 符号(symbol)

### 类型检测

我们通常是使用`typeof`运算符来查看值的类型,他返回的是类型的字符串值。

```
typeof undefiend    === 'undefined'  // true
typeof true         === 'boolean'    // true
typeof 42           === 'number'     // true
typeof "42"         === 'string'     // true
typeof { life: 42 } === 'object'     // true
typeof Symbol()     === 'symbol'     // true
```

以上六种基本类型均有同名的字符串之与之对应。而`null`类型不在此列,他比较特殊,typeof 对他的处理有问题

```
typeof null === 'object' // true
```

这是因为 js 在底层储存变量的时候,会在变量的机器码的低位 1~3 为储存其类型信息

- 000: 对象
- 010: 浮点数
- 100: 字符串
- 110: 布尔
- 1: 整数
  但是对于`undefiend`和`null`来说,这两个值的存储信息比较特殊,`null`的所有机器码全是 0,`undefeind`用`-2^30`表示,因为`null`的机器码全是 0 所以`typeof`把`null`当作对象来看,但是用`instanceOf`进行判断的话

```
null instanceof null // TypeError: Right-hand side of 'instanceof' is not an object
```

null 被直接判断为不是对象,
我们还可以通过`instanceOf`来判断一个实例是否属于某种类型。例如

```
class animal{}
let cat = new animal();
cat iinstanceOf animal // true
```

也支持内置类型

```
let arr = [1, 2, 3];
alert(arr instanceOf Array); // true
alert(arr instanceOf Object); // true
```

**注意**: `arr`也属于`Object`,这是因为 Array 原型继承`Object`
之所以会这样,就涉及到`instanceOf`的原理了。检查类型是否在实例的原型链上。
`obj instanceOf Class`的算法大致如下

1.  如果存在静态方法`Symbol.hasInstance`。则使用他

```
class Animal {
  static [Symbol.hasInstance](obj){
    if(obj.canEat) return true;
  }
}

let obj = { canEat: true };
alert(obj instanceOf Animal); // true
```

2.  大多数构造函数没有`Symbol.hasInstance`。在这种情况下,检查`class.prototype`是否等于`obj`原型链中的原型之一。

```
obj.__proto__ === class.prototype
onj.__proto__.__proto__ === class.prototype
```

在继承的情况下:

```
class Animal {}
class Rabbit extends Animal {}

let rabbit = new Rabbit();
alert(rabbit instaneOf Animal); // true
// rabbit.__proto__ === Rabbit.prototype
// rabbit.__proto__.__proto__ === Animal.prototype
```

![](https://javascript.info/article/instanceof/instanceof.png)

当然这种方法也会有原型链断裂的风险,例如:

```
function Rabbt(){}
let rabbit = new Rabbit();
Rabbit.prototype = {};
console.log(rabbit instanceOf Rabbit); // false
```

现在我们通常使用`Object.prototype.toString.call`方法来检测的类型:

```
let s = Object.prototype.toString;

s.call(123);   // [object, Number]
s.call(null);  // [object null]
s.call(alert); // [object Function]
```

当然我们也可以去自定义一个`toString`行为

```
let user = {
  [Symbol.toStringTag]: 'user'
}
consle.log({}.toString.call(user)); // [object, User]
```

### 类型转换

将值从一种类型和另一种类型通常称为类型转换,下面是他们转换的规则:

1.  ToString

基本类型值的字符串化规则是:

- undefined -> 'undefined'
- Null -> 'null'
- Boolean -> `true`返回`"true"`, `false`返回`false`
- Number -> 'number'
- Symbol -> throw typeError

对普通对象来说,除非自己定义`[Symbol.toStringTag]`方法,否则`toString()`会返回内部属性`[[class]]`的值。当然如果对象自己有`toString`方法,则会调用该方法使用其返回值

2.  ToNumber

基本类型值的数字化规则是:

- undefined -> `NaN`
- Null -> `+0`
- Boolean -> `true`返回`1`,`false`返回`+0`
- Symbol -> throw TypeError

对象应用以下步骤：

1.  调用`ToPrimitive`转换成基本类型值
2.  之后再调用`ToNumber`

字符串: ToNumber 应用在字符串上会去检测是否数字,如果不是数字那么结果是`NaN`

3.  ToBoolean

基本类型值的布尔化规则是:

- undefiend -> `false`
- Null -> `false`
- Number -> 除了`+0, -0, NaN`,其他返回`true`
- String -> 除了`" "`返回`false`其他返回`false`
- Symbol -> `true`
- Object -> `true`

3.  ToPrimitive

当我们需要将对象类型转换成基本类型的时候,使用`ToPrimitive`算法,将其转换为基本类型
该算法允许我们用特殊的对象方法自定义转换,这取决于上下文的提示
提示分为三种

- `string`:
  当一个操作期望一个字符串时,用于对象到字符串的转换

```
alert(obj)

// 使用对象当键名
another[obj] = 123 // obj 为 [object object]
```

- `number`:
  当一个操作需要一个数字的时候,用于对象到数字的转换,例如数学公式

```
let num = Number(obj);

let n = +obj;
let delta = date1 - date2;

let greater = user1 > user2
```

- `default`:
  在少数情况下,操作不确定期望的类型的时候,例如`+`运算符可以是拼接字符串或者数学公式相加或者当一个对象`==`与字符串,数字或符号进行比较时。

```
let total = car1 + car2

// obj == string/number/symbol
if(user == 1){ ... }
```

**为了进行转换,JavaScript 尝试查找并调用三个对象方法**

1.  调用`obj[Symbol.toPrimitive](hint)`如果方法存在
2.  否则,如果提示是`string`,尝试`obj.toString()`和`obj.valueOf()`无论存在
3.  否则,如果提示是`number`或`default`,尝试`obj.valueOf()`和`obj.toString()`,无论存在

### 宽松相等(==)

ES 规范定义了抽象相等比较算法类定义`==`运算符,该算法涵盖了所有的类型组合,以及他们
进行强制类型转换的方式

1.  如果 x 或 y 中有一个为 NaN，则返回 false；
2.  如果 x 与 y 皆为 null 或 undefined 中的一种类型，则返回 true（null == undefined // true）；否则返回 false（null == 0 // false）；
3.  如果 x,y 类型不一致，且 x,y 为 String、Number、Boolean 中的某一类型，则将 x,y 使用 ToNumber 函数转化为 Number 类型再进行比较；
4.  如果 x，y 中有一个为 Object，而另一个为字符串, 数字或符号, 则首先使用 ToPrimitive 函数将其转化为原始类型，再进行比较。
