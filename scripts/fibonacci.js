
// Fibonacci easter egg
function fibonacci(fibInput) {
    let a = 0;
    let b = 1;
    let c;
    let fib = [a, b];

    for (let i = 0; i < 201; i++) {
        c = a + b;
        a = b;
        b = c;
        fib.push(c);
    }

    function fibValue() {
        let value = fib[fibInput]
        let lastNumber = fibInput.toString().split('').pop()
        let nth;
        if (lastNumber == 3 && fibInput !== `13`) {
            nth = 'rd';
        } else if (lastNumber == 2 && fibInput !== `12`) {
            nth = 'nd';
        } else if (lastNumber == 1 && fibInput !== `11`) {
            nth = 'st';
        } else {
            nth = 'th';
        }
        if (fibInput <= 200) {
            return alert(`You found an easter egg!
        \r\nThe value of the ${fibInput}${nth} number in the Fibonacci Sequence is ${value}`);
        }
        if (fibInput > 200) {
            return alert(`You found an easter egg!
        \r\n Please enter a number smaller than 200`);
        }
    }

    return fibValue();
}