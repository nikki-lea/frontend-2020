# On Javascript
[Lexical Scope and Closures](#lexical-scope-and-closures)  
[Hoisting](#hoisting)  
[Closures](#closures)  
[Scoping and this keyword](#what-is-this)  
[Arrow Functions](#on-using-arrow-functions)  
[Call, Apply, and Bind](#getting-around-javascript-scoping)  
[Prototypal Inheritance](#prototypal-inheritance)  
[Mixins](#mixins)  
[Higher Order Functions](#higher-order-functions)  
[Event Delegation](#event-delegation)    
[Event Propagation](#event-propagation-and-phases)  
[Event Bubbling](#event-bubbling)
[By Reference and By Value](#by-reference-and-by-value)  
[Imperative vs Declarative](#imperative-vs-declarative)  
[Array Methods](#array-methods)

### Lexical scope and closures

Follows the same nested scoping rules as Java, starting from the closest scope in which the reference is made, and looking to the next closest scope thereafter. Lexical scope is defined at lexing time, based on where the variables and scope are authored.

```
var a = 1; 
function foo() {
    var a = 10;
    console.log(a);
}
console.log(a); // 1
foo();          // 10
```
This demonstrates variable shadowing. In the case of `let` vs `var` in JavaScript, `let` binds a variables scope to whichever block it is contained within. This is because unless you are running in ES6 `strict mode`, the global scope will create a variable for you if it is not in scope. Using `let` will enforce that the variable is only used in the scope in which its declared. `let` avoids variable shadowing and other nastyness. Usage of `let` is especially critical in loops, binding i to the for loop body and rebinding on each itration. Note that `const` is just another versin of `let` that is constant. Remember that variable shadowing is where you have two variables with the same name that exist within two scopes. Scope lookup stops once it finds a match, so the variable in the innermost scope will shadow the other. Note that global variables are also properteis of the global object (window). Variable collusion is especially likely in the global scope. 

```
function foo() {
    function bar(a) {
        i = 3;
        console.log(a);
    }
    for (var i=0; i < 10; i++) {
        bar(i*2); // this is an infinite loop, since within the context of bar, i is always 3.
    }
}
```

Each function creates a bubble for itself. You can "hide" variables and functions by enclosing them within the scope of a function, as above. 

```
if (true) {
    var i = 5;
    let j = 6; 
}
console.log(i); // prints 5
console.log(j); // ReferenceError, let scopes variables to the block

console.log(bar); // ReferenceError, declarations using let don't hoist to entire parent scope
let bar = 2;
```

### Things that affect lexical scoping
Note that you generally don't want to use these, as they affect what we would expect for lexical scoping, and create performance degradations because the javascript engine cannot put the performance optimizations it normally would.

**Block Scoping** - Involves declaring variables as close as possibel to the scope where they are referenced, to avoid polluting scope. Note that javascript does not enforce block scoping, though catch blocks in try/catch pairs are in fact blockm scoped.

**eval** - Accepts a string as an argument, and treats the string as if it has been evaluated at that point in the code, so it takes the scope of where eval() is and not the line in which the string is declared. Note that in strict mode, eval operates in its own lexical scope, and doesn't affect the scope of the enclosing function.

**with** - typically used as a shorthand to avoid writing out an object name repeatedly. This creates issues if creating a new property within an object. with treats the object it is passed as a wholly separate lexical scope, therefore a variable will be created at global scope if it does not exist.

```
{
    let foo = 10;
    console.log( foo ); // 10
}
console.log( foo ); // ReferenceError
```

### Hoisting

Hoisting enables you to run a function prior to it being defined.

```
foo(); // ‘hello hoisting’
function foo() {
    console.log(‘hello hoisting’);
}
```

Functions are hoisted first, then variables. Hoisting essentially means that the scope of the declaration is independent of the order in which these items were declared. They are available throughout the scope in which they were declared. Note, however, if you declare a function twice, and the function has the same signature, JavaScript will use the second declared function in order from top to bottom. Note that things declared with 'let' will also not be hoisted. The reason that hoisting works is because the variable declaration is picked up at compile time whereas the assignment is picked up at runtime. Because the declaration is picked up at compile time, they may then be referenced above their assignment. Note that hoisting happen per scope, not to the global scope. Function and variable declarations are hoisted, whereas function expressions are not. Functions are hoisted first, and will shadow variable declarations that have the same name. 

### Closures
Closure is when a function is able to remember and access its lexical scope even when the function is executing outside its lexical scope. This is why you're able to pass references to functions to child components and have them execute outside their lexical scope, but still access the scope defined within the function.

An example of closure:
```
function foo() {
    var a = 2;
    function bar() {
        console.log(a);
    }
    return bar;
    }
    var baz = foo();
    baz(); .. prints 2, bar() is executed outside its declared lexical scope, baz() excecutes in foo()'s closure
}
```

**Callbacks** - Callback functions are likely to exercise closure in referencing their scope.

```
for (var i = 1; i <=5; i++) {
    (function () {
        var j = i;
        setTimeout(function timer () {
            console.log(j);
        }, j*1000
     })();
}
```
In this example, the callback creates a block scope on each iteration for the callback to use. 

**Modules** - Modules also leverage closure. Modules can be instantiated to encapsulate use of variables to the scope in which they belong. The inner functions then exercise closure. You can also put the scope within an IIFE to encapsulate it. 

**Dynamic Scope** - Scope that is determined by call order rather than author time. 

### What is _this_ ??????
Just use the W3 Schools reference.  
Is **this** in a method of an object?  
The scope referenced is the global object, or the "owner" of the method. Note that if you have a method inside of a method, and the method uses **this**, then it loses its scope and is bound to the global object.' Function context is also defined only when _calling_ your function, not when defining it (see .bind()). Unlike lexical scope, which is defined at compile time, _this_ is defined at run time. 

**Call-site** - Location in the code where function is called.

**Default Binding** - When not in strict mode, default binding is to global scope.

**Implicit Binding** -
```
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo
}
```
This example demonstrates implicit binding, since obj.foo() means _this_ is implicitly bound to obj. Note that if you chain these, the last referenced object will be _this_, such as in obj1.obj2.foo(), obj2 is _this_. Be careful with implicit binding and callbacks, where the callback will not be implicitly bound to the object it is within.

**Explicit Binding** - Explicitly declares the object that _this_ will reference through .call or .apply. Hard binding explicitly passes an object, but also wraps it in a function that manually calls foo.call(obj) on each call. This is what .bind() does in ES5. ES6 has a name property on bind that allows the function to show up in stack traces as well. implicit binding can override implicit binding which can override default binding

**new** - In JavaScript the new operator is _just a function_ that happens to have the word 'new' in front of it. They are not attached to classes, nor do they instantiate a class. Similarly, properties of an object created via _new_ has a _this_ of the obj itself. new can in fact override hard bindig.

Is **this** global scope?
Then it references the global object's scope.

Is **this** used in an event handler?
**this** references the HTML element that received the event. 

### On Using Arrow Functions
Arrow functions are anonymous functions in JavaScript. Unlike methods, they inherit context from the parent. In the below example, the anon function prints `undefined` whereas the arrow function prints `test object`.

```
const test = {
  name: 'test object',
  createAnonFunction: function() {
    return function() {
      console.log(this.name);
      console.log(arguments);
    };
  },

  createArrowFunction: function() {
    return () => {
      console.log(this.name);
      console.log(arguments);
    };
  }
};
```
Arrow functions are typically used in the following cases:
- Functional programming, i.e. `map`, `forEach`
- Promise chains
- Mapping object attributes

Arrow functions are not good for:
- clickHandlers, or objects within a class that should use the scope of the class
    - In this case bind in the constructor
- Deep call chains, since they don't offer helpful stack traces

### Getting Around JavaScript Scoping
.call() & .apply()  
These have the syntax `objectName.call(this)` and return immediately, applying the scope of **this** to the object. The only difference between these two are the way that they accept arguments. .call() accepts multiple comma separated arguments, whereas apply accepts an array of arguments. Note that you typically will use these two if use a method from one object in a completely different scope.
To me, I would question the design of using this rather than pulling the method out of the scope of both classes in a separate file.

.bind()  
Handy method that allows you to define assign a reference to a new version of the function with a different scope that **this** refers to. The most common use case for this is in callbacks such as event handlers, where you define it as follows `this.handleClick = this.handleClick.bind(this);`. Generally speaking, if you refer to a method in a react component without immediately invoking it with (), then you most likely need to bind it to the global context of the component. Otherwise, **this** will be undefined. 

### Prototypal Inheritance
All objects in JavaScript are instance of Object that sit on a prototype chain. The prototype chain is accessed through the `Object.getPrototypeOf()` and `Object.setPrototypeOf()` methods. Note that `func.prototype` property of functions is what sets the prototype of all objects generated by that function. You can set prototypes of prototypes, and so on.

You can also implement Java-like inheritance with `Object.create` in which methods will be inherited, and can be overriden as well. Alternatively, you can use the `class` keyword, and extend the class with `class B extends A`. For large prototype chains, avoiding iterating all over all the attributes of the object, but instead lookup the property with `hasOwnProperty`.

An important distinction between OOP languages such as Java is that the `class` construct is syntactic sugar and that Javascript is in fact only constructed of instances. For example, newing a Foo() object does the following:
```
var o = new Object();
o.[[Prototype]] = Foo.prototype;
Foo.call(o);
```

### Mixins 
Mixins are a form of _object composition_, where properties of the mixin become properties of the destination object. 
For example, if each below object contains a single method, you can mix them together as follows:
```
const compositeDesserts = Object.assign(Dessert.prototype, chocolate);
```
Mixins can be used for cross functional utilities, as well as applications state management. Note that mixins are mostly useful to avoid anti-patterns by forcing things into an is-a inheritance pattern. Mixins are an example of using _composition_ in place of inheritance. This avoids the 'god object' problem, where a parent object becomes more difficult to change as the requirements of child objects change. 

### Higher Order Functions
Higher order functions are simply functions that accept a function as an argument, or return a function. 

### Event Delegation
First things first, you add an an event listener to an HTML element with `addEventlistener(eventType, element)`. Note that when you find an element with methods such as `document.getElementId` this element MUST be present at load time. Event delegatiion allows you to set `addEventListener` to the parent container that will be present at page load, and the event listener will be attached to all children of that parent. This distinction is made in the event object itself, where `event.target` references the element that triggered the event, but `event.currentTarget` references the element to which the listener is attached. One useful thing is to make your event handler smart enough to filter out on the elements that it cares about by checking `event.target`. 

### Event Propagation and Phases
Event propagation is how event delegation is carried out, and can consist of three differe phases of DOM events: capturing, targeting, and bubbling.  
![Propagation table](https://frontend.turing.io/assets/images/eventpropagation.png)  
Linked from https://frontend.turing.io/lessons/module-1/event-bubbling-and-delegation.html  

If you're receiving event propagation that you would not like, you can leverage methods such as `stopPropagation` or `stopImmediatePropagation` to remove propagation that occurs on siblings or parent/children nodes. As a tangent, some events have default behavior they invoke, so you can leverage the `e.preventDefault` method to cancel the event behavior. 

### Event Bubbling
Bubbling is one of the phases of event propagation, and the one that allows event delegation to happen.  When you trigger an event on an element, the event 'bubbles' up to all parent elements of the element. In other words, when you click an element, you are clicking also on all the parents of that element up to the document body. Some events are exceptions though, such as `focus`, `blur`, and events that fire on the entire document itself, such as `load`, `error`, etc.

### Compilation
Javascript is unique in that compilation happens just in time, immediately before code is executed.  In compilation, a variable assignment is divided into two acctions, a scope declaration and subsequent LHS reference. *LHS (variable assignment) will look for an existing declaration all the way up to the global scope, and will create one if it does not yet exist. RHS (variable access) will throw a ReferenceError in the case the variable is never found. Note that you can disable the automatic declaration of variables through use of 'strict mode', implemented in ES5.

### By Reference, By Value
- All primitives are passed by value
- Objects and arrays are all pass by reference. As a result, if you pass an array to another function then modify it in that function, it will be modified in the scope of the calling function as well.

### Imperative vs Declarative
Imperative code is where you explicitly spell out each step of how you want something done, whereas with declarative code you merely say what it is that you want done. Typically imperative is the same as the difference between something like a for loop, and something like array.every. 

### Array Methods
**entries** - You can get [index, value] pairs with entries, returns an iterator
```
const a = ['a', 'b', 'c'];

for (const [index, element] of a.entries())
  console.log(index, element);
```
**every** - Returns a boolean, tests whether or not every element satisfies the specified predicate
**filter** - Accepts a callback function `filter((element, index, array) => { ... } )`, returns a new array of elements that satisfy the predicate. Does not mutate the array its called in.
**find** - Returns first element that satifies a given predicate, undefined otherwise
**findIndex** - Returns the first index that satifies a given predicate, -1 otherwise
**flat** - Returns a new array with all subarrays flattened to a specified depth
**flatMap** - Applies a callback to each element then flattens result by one level
**forEach** - Iterates over the array



References:
- https://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/  
- https://spin.atomicobject.com/2014/10/20/javascript-scope-closures/  
- https://medium.com/@nickbalestra/javascripts-lexical-scope-hoisting-and-closures-without-mystery-c2324681d4be  
- https://www.w3schools.com/js/js_this.asp  
- https://medium.com/code-monkey/object-composition-in-javascript-2f9b9077b5e6
- https://zendev.com/2018/10/01/javascript-arrow-functions-how-why-when.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
- https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c
- https://medium.com/@bretdoucette/part-4-what-is-event-delegation-in-javascript-f5c8c0de2983
- https://medium.com/weekly-webtips/imperative-vs-declarative-programming-in-javascript-25511b90cdb7

