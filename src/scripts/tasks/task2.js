/*
* Да се напише приложение, което в даден текст намира всички дробни числа,
* написани в десетична позиционна бройна система,
* преобразува ги до бройна система с някоя от следните основи: 2, 16, 8, 5, 10 и генерира текст,
* в който числата са преобразувани.
* Потребителят да може да избира изходната ПБС.
* */
/*TODO:
*   Re-use most code from Task 1
*   Change currency match regex to fraction detector type
*   Apply logic found in either https://github.com/infusion/Fraction.js/ or https://github.com/jakeboone02/numeric-quantity
* */

/*
* Да се напише на избран от вас език софтуерно приложение, което анализира текст,
* намира в него всички  цени в определена валута и ги преобразува в БГ левове,
* като използва база знания за валутните курсове на БНБ.
* В изходния текст всички цени да са в левове.
* Бонус: да се доразвие, като се даде възможност на потребителя да избира сам изходната валута.
* */

'use strict';



//TODO: refactor to work with fractions
class FractionFinder {
    constructor(userInput, currencyBase, dropdownSelector, supportedNumberBaseSelector, $outputElSelector) {
        this.userInput = userInput;
        this.currencyBase = currencyBase;
        this.dropdownSelector = dropdownSelector;
        this.supportedNumberBaseSelector = supportedNumberBaseSelector;
        this.$outputElSelector = $outputElSelector;
    }

    /**
     * Fetches the current exchange rates
     * */
    requestExchangeRate() {
        const europeanBankRequest = new Request(`https://api.exchangeratesapi.io/latest?base=${this.currencyBase}`, {mode: 'cors'});

        return fetch(europeanBankRequest)
            .then(response => response.json())
            .then((exchangeRateData) => {
                return exchangeRateData;
            });
    }

    /*toUnicode(strChar) {
        if (strChar.length < 4)
            return strChar.codePointAt(0).toString(16);
        return strChar.codePointAt(0).toString(16) + '-' + strChar.codePointAt(2).toString(16);
    }*/

    /**
     * Select a <select> element and populate its options from array of strings
     * @elSelector - String
     * @currencyArray - Array
     * */
    populateCurrencies(elSelector, currencyArray) {
        let selectElement = document.getElementById(elSelector);

        currencyArray.forEach((currency) => {
            let optionElement = document.createElement('option');
            optionElement.textContent = currency;
            optionElement.value = currency;
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
    findCurrency(exchangeRate) {
        console.log('Fetched Exchange Rate is:', exchangeRate);
        let $outputEl = document.getElementById(this.$outputElSelector);
        this.exchangeRate = exchangeRate;
        const regExCurrencySymbols = '\\$\\£\\€';
        let availableCurrencies = [];
        // let currencySymbols = [];
        Object.keys(exchangeRate.rates).map((rate) => {
            // currencySymbols.push(currencyMap.default[rate].symbol_native);
            let currencyNameAndSymbol = `${rate} ${currencyMap.default[rate].symbol_native}`;
            availableCurrencies.push(currencyNameAndSymbol);
        });
        // const uniqueCurrencySet = new Set(currencySymbols);
        // const uniqueUniCurrencySymbols = [...uniqueCurrencySet];
        this.displaySupportedSymbols(this.supportedNumberBaseSelector, ['$', '£', '€']);
        console.log('Available Currencies are: ', availableCurrencies);
        this.populateCurrencies(this.dropdownSelector, availableCurrencies);
        // JS alternative to /\p{Sc}/
        // TODO: extend to use all the possible currency symbols bellow
        // const regExCurrencySymbols = '\\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6';
        // let currencyRegEx = '(([\\$\\£\\€]) {0,1}(\\d+(?:\\.\\d{1,2})?))|((\\d+(?:\\.\\d{1,2})?) {0,1}([\\$\\£\\€]))';
        let currencyRegEx = /(([\$\£\€]) {0,1}(\d+(?:\.\d{1,2})?))|((\d+(?:\.\d{1,2})?) {0,1}([\$\£\€]))/g;
        console.log('REG EX IS: ', currencyRegEx);
        // todo: cycle through and find all matches
        console.log('User input is: ', this.userInput);
        let matchedCurrencyArray = this.userInput.match(currencyRegEx);
        if (!matchedCurrencyArray) {
            $outputEl.value = this.userInput;
            return;
        }
        console.log('Match is ', matchedCurrencyArray);
        // set input matched currencies
        let numbersToConvert = [];
        matchedCurrencyArray.forEach((match) => {
            let numberPart = match.match(/\d/g);
            numberPart = numberPart.join('');
            if (match.match(/\$/g)) {
                numbersToConvert.push({currencyType: 'USD', value: numberPart});
            } else if (match.match(/\£/g)) {
                numbersToConvert.push({currencyType: 'GBP', value: numberPart});
            } else if (match.match(/\€/g)) {
                numbersToConvert.push({currencyType: 'EUR', value: numberPart});
            }
        });
        console.log('Only number matches are: ', numbersToConvert);
        // calculate in output currency
        let convertedCurrencies = this.convertCurrency(numbersToConvert);
        console.log('Converted currency to ', this.currencyBase);
        console.log(convertedCurrencies);
        let convertedString = this.userInput;
        // replace converted currency into original string
        matchedCurrencyArray.forEach((matchedEl, index) => {
            if (convertedString.includes(matchedEl)) {
                convertedString = convertedString.replace(matchedEl, convertedCurrencies[index]);
            }
        });
        console.log('Final output string is: ', convertedString);
        // return convertedString;
        $outputEl.value = convertedString;
    }


    //todo: implement
    convertCurrency(matchedCurrencyArray) {
        const convertToBase = value => currency(value, {
            symbol: `${currencyMap.default[this.currencyBase].symbol_native}`,
            precision: 2,
            formatWithSymbol: true
        });

        console.log('Converting to ', this.currencyBase);
        console.log('Using conversion table: ', this.exchangeRate);
        let convertedValues = [];

        matchedCurrencyArray.forEach((matchedEl, index) => {
            for (let [keyRate, valueRate] of Object.entries(this.exchangeRate.rates)) {

                if (matchedEl.currencyType === keyRate && matchedEl.value != 0) {
                    console.log('Matching Currency!', matchedEl.currencyType, keyRate);
                    console.log('from ', matchedEl.value, ' to ', valueRate);
                    let convertedNumber = 0;
                    convertedNumber = convertToBase(currency(currency(matchedEl.value).multiply(valueRate))).format(true);

                    convertedValues[index] = convertedNumber;
                } else if (this.currencyBase === matchedEl.currencyType) {
                    convertedValues[index] = convertToBase(matchedEl.value).format(true);
                }
            }
        });
        // return currencyObj;
        return convertedValues;
    };

    get processedText() {
        this.requestExchangeRate().then((exchangeRateData) => {
            return this.findCurrency(exchangeRateData);
        });

    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.debug('DOM loaded...');
    // init default fetched from server;
    let baseToConvertTo = '10';
    // get DOM elements

    const textOutputSelector = 'outputText';
    const numberSystemSelector = 'selectNumberSystem';
    const supportedNumberBaseSelector = 'numberSystemSelector';
    let $textInput = document.getElementById('inputText');
    let $selectedNumberSystem = document.getElementById(numberSystemSelector);
    let $convertTrigger = document.getElementById('triggerConversion');

    const testString = `This is a very interesting string, containing 1/2 a brain.`;
    $textInput.value = testString;

    let fractionFetcher = new FractionFinder(testString, 'CAD', numberSystemSelector, supportedNumberBaseSelector, textOutputSelector);
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
