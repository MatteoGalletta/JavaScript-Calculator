/*
    Copyright 2021 Matteo Galletta

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    ------------------------------------------

    CALCULATOR made in HTML, CSS e JavaScript

    made by: Matteo Galletta
    
    version: 1.1

    GitHub Repository at
        https://github.com/MatteoGalletta/JavaScript-Calculator

    TODO:
        -Add MRC / M+ / M- buttons;
        -Add CE button;
        -Add Percentage button;
        -Add 1/x button;
        -Add Factorial;
        -Add Logarithms;
        -Add sin/cos and tan functions.
*/
class Calculator {
    constructor() {
        this.reset();
    };
    reset() {
        this.firstValue = 0;
        this.mustClear = true;
        this.sign = '+';
        this.noValueYet = true;
    };
    calculate(secondValue, nextSign) {
        if (secondValue == null) return;
        
        this.noValueYet = false;
        this.mustClear = true;

        switch (this.sign) {
            case '+': this.firstValue += secondValue; break;
            case '-': this.firstValue -= secondValue; break;
            case '×': this.firstValue *= secondValue; break;
            case '÷':
                if(secondValue == 0) {
                    this.firstValue =
                        (this.firstValue == 0) ? "Indet." : "Imposs.";
                    this.noValueYet = true;
                }else
                    this.firstValue /= secondValue;
                break;
            case '=': this.firstValue = secondValue; break;
        }
        this.sign = nextSign ?? '+';
    };
}
var calculator = new Calculator();

// Whenever a button gets pressed, this fuction will be called.
document.addEventListener('keydown', function (event) {
    // If another function has already called preventDefault()
    if (event.defaultPrevented)
        return;
    
    // The key pressed by the user gets handled.
    handleUserInput(event.key.toLowerCase());

    event.preventDefault();
});

function handleUserInput(char) {
    switch (char) {
        case 'enter': char = '='; break;
        case '*': char = '×'; break;
        case '/': char = '÷'; break;
    }

    try { document.getElementById(char).focus(); } catch (e) { return; }

    handle(char);
}

function handleButton(button) {
    if (button != null)
        handle(button.id);
}

function handle(buttonID) {
    var displayField = document.getElementById("display");
    var displayMiniField = document.getElementById("displayMini");

    console.log("handle(" + buttonID + ");");

    if (calculator.mustClear) {
        // Once the sign has been clicked, if another one gets
        // pressed, the last one overwrites the first one.
        if ("+-×÷=".includes(buttonID)) {
            if (buttonID != '=') {
                displayMiniField.value = calculator.firstValue + " " + buttonID + " ";
                calculator.sign = buttonID;
            }
            return;
        }
        if(calculator.sign == '=')
            displayMiniField.value = "";

        // After pressing '=' or any other button that expects the screen
        // to be cleared, the root and square won't clear anything.
        if (!("r^".includes(buttonID) || buttonID == 'backspace')) {
            displayField.value = "";
            calculator.mustClear = false;
        }
    } else if(buttonID == '=' && calculator.sign == '=') return;

    if (buttonID == 'c') {
        displayField.value = displayMiniField.value = "";
        calculator.reset();
    }
    else if (buttonID == "^") {
        let num = parseFloat(displayField.value);
        if (isNaN(num)) return;

        displayField.value = Math.pow(num, 2);
    }
    else if (buttonID == "r") {
        let num = parseFloat(displayField.value);
        if (isNaN(num)) return;

        displayField.value = Math.sqrt(num);
    }
    else if (buttonID == 'backspace') {
        displayField.value = displayField.value.substring(0, displayField.value.length - 1);
    }
    else if (buttonID == '.') {
        let str = displayField.value;
        for (let i = 0; i < str.length; i++)
            if (str[i] == '.')
                return;
        displayField.value += '.';
    }
    else if (buttonID >= 0 && buttonID <= 9) {
        displayField.value += buttonID;
    }
    else if ("+-×÷=".includes(buttonID)) {
        var num = displayField.value*1;
        if (isNaN(num)) return;

        displayMiniField.value = "";

        if(buttonID == '=' && !calculator.noValueYet)
            displayMiniField.value += calculator.firstValue + " " + calculator.sign + " " + num + " = ";
        
        calculator.calculate(num, buttonID);
        
        if(buttonID != '=')
            displayMiniField.value += calculator.firstValue + " " + calculator.sign + " ";
        
        displayField.value = calculator.firstValue;
        
        if(calculator.noValueYet)
            calculator.reset();
        
    }
}
