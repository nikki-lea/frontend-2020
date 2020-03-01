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
