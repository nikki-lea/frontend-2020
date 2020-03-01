# On Javascript

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
The scope referenced is the global object, or the "owner" of the method. Note that if you have a method inside of a method, and the method uses **this**, then it loses its scope and is bound to the global object.'

Is **this** global scope?
Then it references the global object's scope.

Is **this** used in an event handler?
**this** references the HTML element that received the event. 

### On Using Arrow Functions


### Getting Around JavaScript Scoping
.call()






