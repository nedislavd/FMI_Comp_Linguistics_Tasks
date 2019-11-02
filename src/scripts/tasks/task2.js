/*
* Да се напише приложение, което в даден текст намира всички дробни числа,
* написани в десетична позиционна бройна система,
* преобразува ги до бройна система с някоя от следните основи: 2, 16, 8, 5, 10 и генерира текст,
* в който числата са преобразувани.
* Потребителят да може да избира изходната ПБС.
* */

'use strict';

class FractionFinder {
    constructor(userInput, numberBase, dropdownSelector, supportedNumberBaseSelector, $outputElSelector) {
        this.userInput = userInput;
        this.numberBase = numberBase;
        this.dropdownSelector = dropdownSelector;
        this.supportedNumberBaseSelector = supportedNumberBaseSelector;
        this.$outputElSelector = $outputElSelector;
    }

    /**
     * Select a <select> element and populate its options from array of strings
     * @elSelector - String
     * @currencyArray - Array
     * */
    populateNumberBases(elSelector, numberBaseArray) {
        let selectElement = document.getElementById(elSelector);

        numberBaseArray.forEach((numberBase) => {
            let optionElement = document.createElement('option');
            optionElement.textContent = numberBase;
            optionElement.value = numberBase;
            selectElement.appendChild(optionElement);
        });
    };

    displaySupportedSymbols(elSelector, symbolArray) {
        let element = document.getElementById(elSelector);
        element.innerHTML = symbolArray;
    }

    /**
     * Main method
     * Populates currency to convert to dropdown
     * Matches currency to destination one and replaces it in the string
     * @exchangeRate - Object, returned from requestExchangeRate()
     * @returns - String
     * */
    findFraction() {
        let $outputEl = document.getElementById(this.$outputElSelector);

        let fractionDetectRegEx = /\d+([\/.]\d+)?/g;
        console.log('REG EX IS: ', fractionDetectRegEx);
        console.log('User input is: ', this.userInput);
        let matchedFractionArray = this.userInput.match(fractionDetectRegEx);
        if (!matchedFractionArray) {
            $outputEl.value = this.userInput;
            return;
        }
        console.log('Match is ', matchedFractionArray);
        // set input matched currencies
        let convertedBases = [];
        matchedFractionArray.forEach((match) => {
            let split = match.split('/');
            //TODO: bugfix calculation
            convertedBases.push(parseInt(split[0], this.numberBase) / parseInt(split[1], this.numberBase));
        });
        console.log('Converted Matches in base: : ', this.numberBase, ' are ', convertedBases);
        let convertedString = this.userInput;
        // replace converted currency into original string
        matchedFractionArray.forEach((matchedEl, index) => {
            if (convertedString.includes(matchedEl)) {
                convertedString = convertedString.replace(matchedEl, convertedBases[index]);
            }
        });
        console.log('Final output string is: ', convertedString);
        // return convertedString;
        $outputEl.value = convertedString;
    }

    get processedText() {
        this.populateNumberBases(this.dropdownSelector, [10, 16, 8, 5, 2]);
        this.displaySupportedSymbols(this.supportedNumberBaseSelector, ['/']);
        // this.displaySupportedSymbols(this.supportedNumberBaseSelector, ['.', '/']);
        return this.findFraction();
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.debug('DOM loaded...');
    // init default fetched from server;
    let baseToConvertTo = '10';
    // get DOM elements

    const textOutputSelector = 'outputText';
    const numberSystemSelector = 'numberSystemSelector';
    const supportedNumberBaseSelector = 'supportedSymbols';
    let $textInput = document.getElementById('inputText');
    let $selectedNumberSystem = document.getElementById(numberSystemSelector);
    let $convertTrigger = document.getElementById('triggerConversion');

    const testString = `This is a very interesting string, containing 1/2 a brain.`;
    $textInput.value = testString;

    let fractionFetcher = new FractionFinder(testString, baseToConvertTo, numberSystemSelector, supportedNumberBaseSelector, textOutputSelector);
    fractionFetcher.processedText;

    $selectedNumberSystem.addEventListener('change', (event) => {
        let currentlySelectedOption = $selectedNumberSystem[$selectedNumberSystem.selectedIndex].value;
        baseToConvertTo = currentlySelectedOption.substr(0, currentlySelectedOption.indexOf(' '));
        console.log('Active Number System: ', baseToConvertTo);
        let convertFractionOnDropdownChange = new FractionFinder($textInput.value, baseToConvertTo, numberSystemSelector, supportedNumberBaseSelector, textOutputSelector);
        convertFractionOnDropdownChange.processedText;
    });

    $convertTrigger.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Text to convert is: ', $textInput.value, ' into ', baseToConvertTo);
        let convertFractionToSelectedNumber = new FractionFinder($textInput.value, baseToConvertTo, numberSystemSelector, supportedNumberBaseSelector, textOutputSelector);
        convertFractionToSelectedNumber.processedText;
    });

    $textInput.addEventListener('keyup', (event) => {
        console.log('changing input');
        let convertFractionOnInputChange = new FractionFinder($textInput.value, baseToConvertTo, numberSystemSelector, supportedNumberBaseSelector, textOutputSelector);
        convertFractionOnInputChange.processedText;
    });

});
