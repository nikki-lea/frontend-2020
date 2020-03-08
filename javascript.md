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

### Lexical scope and closures

Follows the same nested scoping rules as Java, starting from the closest scope in which the reference is made, and looking to the next closest scope thereafter.

```
var a = 1; 
function foo() {
    var a = 10;
    console.log(a);
}
console.log(a); // 1
foo();          // 10
```
This demonstrates variable shadowing. In the case of `let` vs `var` in JavaScript, `let` binds a variables scope to whichever block it is contained within. This is because unless you are running in ES6 `strict mode`, the global scope will create a variable for you if it is not in scope. Using `let` will enforce that the variable is only used in the scope in which its declared. `let` avoids variable shadowing and other nastyness.

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

Functions are hoisted first, then variables. Hoisting essentially means that the scope of the declaration is independent of the order in which these items were declared. They are available throughout the scope in which they were declared. Note, however, if you declare a function twice, and the function has the same signature, JavaScript will use the second declared function in order from top to bottom. Note that things declared with 'let' will also not be hoisted.

### Closures
Closure is when a function is able to remember and access its lexical scope even when the function is executing outside its lexical scope. This is why you're able to pass references to functions to child components and have them execute outside their lexical scope, but still access the scope defined within the function.

### What is _this_ ??????
Just use the W3 Schools reference.  
Is **this** in a method of an object?  
The scope referenced is the global object, or the "owner" of the method. Note that if you have a method inside of a method, and the method uses **this**, then it loses its scope and is bound to the global object.' Function context is also defined only when _calling_ your function, not when defining it (see .bind()).

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

