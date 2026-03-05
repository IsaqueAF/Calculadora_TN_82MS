// Variables and constants
const memoryDisplay = document.getElementById("memory");
const signalDisplay = document.getElementById("signal");
const exponentialDisplay = document.getElementById("exponential");
const textDisplay = document.getElementById("text__calculate__result");

const cache = {
    primarySlot: 0,
    signal: "",
    secondarySlot: 0,
    memory: 0,
    exponetial: false,
    decimal: false,
    clearValue: true,
    canCalculate: true
}
cache.ans = 0;
cache.shift = false;
cache.alpha = false;
cache.mode = 'RAD';
cache.hyp = false;

// Utility functions
function HasDot (value) {
    for (let i = 0; i < value.length; i++) if (value[i] == ".") return i;
    return null;
}

function AddDot () {
    if (HasDot(cache.primarySlot.toString())) {return "";}
    if (cache.decimal) {return ".";}
    return "";
}

function TooBigValue (value) {
    let localValue = value;
    if (localValue < 0) localValue = -localValue;
    let string = localValue.toString();
    let position = HasDot(string);
    if (position) string = string.slice(0, position) + string.slice(position + 1);
    return string.length > 8;
}

function ShowMainDisplay (value) {
    let localValue = value;
    let string = localValue.toString();
    let addDot = ".";
    if (HasDot(string)) {addDot = "";}
    if (localValue < 0) {
        textDisplay.textContent = (-localValue).toString() + addDot;
        signalDisplay.textContent = "-";
    } else {
        signalDisplay.textContent = "";
        textDisplay.textContent = localValue.toString() + addDot;
    }
}

function ShowItens () {
    if (cache.primarySlot > 99999999) {
        exponentialDisplay.textContent = "E";
        cache.exponetial = true;
    } else {
        exponentialDisplay.textContent = "";
    }

    if (TooBigValue(cache.primarySlot)) {
        let character = 8
        if (cache.primarySlot < 0) {character = 9}
        if (HasDot(cache.primarySlot.toString())) {character = 9}
        ShowMainDisplay(cache.primarySlot.toString().slice(0, character));
    } else {
        ShowMainDisplay(cache.primarySlot);
    }

    if (cache.memory != 0) memoryDisplay.textContent = "M"; else memoryDisplay.textContent = "";
}

// Basic arithmetic handlers including power
const signalFunctions = {
    minus: function (a, b) { return a - b; },
    plus: function (a, b) { return a + b; },
    division: function (a, b) { return a / b; },
    multiplication: function (a, b) { return a * b; },
    power: function (a, b) { return Math.pow(a, b); }
}

function calculate () {
    if (cache.signal == "") return;
    if (cache.clearValue == false && cache.signal != "multiplication") {
        let savedValue = cache.primarySlot;
        cache.primarySlot = cache.secondarySlot;
        cache.secondarySlot = savedValue;
    }
    let firstValue = cache.primarySlot;
    let secondValue = cache.secondarySlot;
    if (!signalFunctions[cache.signal]) return;
    const result = signalFunctions[cache.signal](firstValue, secondValue);
    cache.primarySlot = result;
    cache.clearValue = true;
}

// Button behaviors
const buttonFunctions = {
    sqrt: function () { cache.primarySlot = Math.sqrt(cache.primarySlot); },
    power2: function () { cache.primarySlot = Math.pow(cache.primarySlot, 2); },
    power3: function () { cache.primarySlot = Math.pow(cache.primarySlot, 3); },
    percentage: function () { cache.primarySlot = (cache.secondarySlot * cache.primarySlot) / 100; if (cache.signal == "plus") cache.primarySlot = cache.secondarySlot + cache.primarySlot; else if (cache.signal == "minus") cache.primarySlot = cache.secondarySlot - cache.primarySlot; },
    AC: function () { cache.primarySlot = 0; cache.signal = ""; cache.secondarySlot = 0; cache.exponetial = false; cache.decimal = false; cache.clearValue = true; cache.canCalculate = true; },
    DEL: function () {
        let s = cache.primarySlot.toString();
        if (s.length <= 1 || (s.length == 2 && s[0] == '-')) {
            cache.primarySlot = 0;
        } else {
            s = s.slice(0, -1);
            cache.primarySlot = Number(s);
        }
    },
    percentage: function () { cache.primarySlot = (cache.secondarySlot * cache.primarySlot) / 100; if (cache.signal == "plus") cache.primarySlot = cache.secondarySlot + cache.primarySlot; else if (cache.signal == "minus") cache.primarySlot = cache.secondarySlot - cache.primarySlot; },
    inv: function () { if (cache.primarySlot === 0) return; cache.primarySlot = 1 / cache.primarySlot; },
    Rnd: function () { cache.primarySlot = Math.random(); },
    STO: function () { cache.memory = cache.primarySlot; cache.clearValue = true; },
    RCL: function () { cache.primarySlot = cache.memory; cache.clearValue = true; },
    nCr: function () {
        let n = Math.floor(cache.primarySlot);
        // for nCr we expect secondarySlot to be k
        let k = Math.floor(cache.secondarySlot);
        if (k > n || n < 0 || k < 0) return;
        cache.primarySlot = factorial(n) / (factorial(k) * factorial(n - k));
    },
    nPr: function () {
        let n = Math.floor(cache.primarySlot);
        let k = Math.floor(cache.secondarySlot);
        if (k > n || n < 0 || k < 0) return;
        cache.primarySlot = factorial(n) / factorial(n - k);
    },
    ENG: function () {
        const x = cache.primarySlot;
        if (x === 0) return;
        const exp = Math.floor(Math.log10(Math.abs(x)) / 3) * 3;
        const mant = x / Math.pow(10, exp);
        cache.primarySlot = Number(mant.toFixed(8));
        // indicate exponential state
        exponentialDisplay.textContent = 'E';
    },
    MC: function () { cache.memory = 0; },
    MR: function () { cache.primarySlot = cache.memory; cache.clearValue = true; },
    M__plus: function () { cache.memory += cache.primarySlot; cache.clearValue = true; },
    M__minus: function () { cache.memory -= cache.primarySlot; cache.clearValue = true; },
    dot: function () { cache.decimal = true; },
    convert__signal: function () { cache.primarySlot = -cache.primarySlot; },
    minus: function () { if (cache.canCalculate) calculate(); cache.signal = "minus"; cache.secondarySlot = cache.primarySlot; cache.clearValue = true; },
    plus: function () { if (cache.canCalculate) calculate(); cache.signal = "plus"; cache.secondarySlot = cache.primarySlot; cache.clearValue = true; },
    division: function () { if (cache.canCalculate) calculate(); cache.signal = "division"; cache.secondarySlot = cache.primarySlot; cache.clearValue = true; },
    multiplication: function () { if (cache.canCalculate) calculate(); cache.signal = "multiplication"; cache.secondarySlot = cache.primarySlot; cache.clearValue = true; },
    equal: function () { calculate(); cache.ans = cache.primarySlot; },
    // scientific
    sin: function () { cache.primarySlot = cache.hyp ? Math.sinh(cache.primarySlot) : Math.sin(cache.primarySlot); },
    cos: function () { cache.primarySlot = cache.hyp ? Math.cosh(cache.primarySlot) : Math.cos(cache.primarySlot); },
    tan: function () { cache.primarySlot = cache.hyp ? Math.tanh(cache.primarySlot) : Math.tan(cache.primarySlot); },
    ln: function () { cache.primarySlot = Math.log(cache.primarySlot); },
    log: function () { cache.primarySlot = Math.log10 ? Math.log10(cache.primarySlot) : Math.log(cache.primarySlot) / Math.LN10; },
    exp: function () { cache.primarySlot = Math.exp(cache.primarySlot); },
    pow: function () { if (cache.canCalculate) calculate(); cache.signal = "power"; cache.secondarySlot = cache.primarySlot; cache.clearValue = true; },
    pi: function () { cache.primarySlot = Math.PI; cache.clearValue = true; },
    fact: function () { let n = Math.floor(cache.primarySlot); if (n < 0) return; let res = 1; for (let i=2;i<=n;i++) res *= i; cache.primarySlot = res; }
    ,
    Ans: function () { cache.primarySlot = cache.ans; cache.clearValue = true; }
}

// helper factorial used by nCr/nPr
function factorial(n) {
    if (n < 2) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

// Initialize display
ShowItens();

// Bind button functions
for (let buttonFunction in buttonFunctions) {
    const element = document.getElementById(buttonFunction);
    if (!element) continue;
    element.addEventListener("click", () => {
        if (cache.exponetial && buttonFunction != "AC") return;
        // toggle behaviors
        if (buttonFunction === 'shift') { cache.shift = !cache.shift; element.classList.toggle('active'); ShowItens(); return; }
        if (buttonFunction === 'alpha') { cache.alpha = !cache.alpha; element.classList.toggle('active'); ShowItens(); return; }
        if (buttonFunction === 'mode') { cache.mode = (cache.mode === 'RAD') ? 'DEG' : 'RAD'; ShowItens(); return; }
        if (buttonFunction === 'hyp') { cache.hyp = !cache.hyp; element.classList.toggle('active'); ShowItens(); return; }

        buttonFunctions[buttonFunction]();
        cache.canCalculate = false;
        ShowItens();
    })
}

// Number buttons
for (let i = 0; i < 10; i++) {
    const button = i.toString();
    const element = document.getElementById(button);
    if (!element) continue;
    element.addEventListener("click", () => {
        if (cache.exponetial) return;
        if (cache.clearValue) { cache.primarySlot = 0; cache.decimal = false; cache.clearValue = false; }
        const addDot = AddDot();
        const finalValue = Number(cache.primarySlot.toString() + addDot + button);
        if (TooBigValue(finalValue)) return;
        cache.primarySlot = finalValue;
        cache.canCalculate = true;
        ShowItens();
    })
}
