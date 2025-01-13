### Pre-decrement (--x)
When you use the pre-decrement operator, the value of x is decremented by 1 first, and then the new value of x is returned.

```javascript
let x = 5;
let y = --x; // x is decremented first, then y is assigned the new value of x

console.log(x); // Output: 4
console.log(y); // Output: 4
```

### Post-decrement (x--)
When you use the post-decrement operator, the current value of x is returned first, and then x is decremented by 1.

```javascript
let x = 5;
let y = x--; // y is assigned the current value of x, then x is decremented

console.log(x); // Output: 4
console.log(y); // Output: 5
```

### Summary
Pre-decrement (--x): Decrement the value first, then return the new value.
Post-decrement (x--): Return the current value first, then decrement the value.
The inverse can be done for incrementing with `++` instead e.g. `x++`