/*
* Да се напише на избран от вас език софтуерно приложение, което анализира текст,
* намира в него всички  цени в определена валута и ги преобразува в БГ левове,
* като използва база знания за валутните курсове на БНБ.
* В изходния текст всички цени да са в левове.
* Бонус: да се доразвие, като се даде възможност на потребителя да избира сам изходната валута.
* */

'use strict';

import * as currencyMap from './task1_currency_db_map.json';

//TODO: cycle through all matches, extract symbol, match to currency rate and replace the whole string

class CurrencyFinder {
    constructor(userInput, currencyBase, dropdownSelector, supportedSymbolsSelector) {
        this.userInput = userInput;
        this.currencyBase = currencyBase;
        this.dropdownSelector = dropdownSelector;
        this.supportedSymbolsSelector = supportedSymbolsSelector;
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

    toUnicode(strChar) {
        if (strChar.length < 4)
            return strChar.codePointAt(0).toString(16);
        return strChar.codePointAt(0).toString(16) + '-' + strChar.codePointAt(2).toString(16);
    }

    /**
     * Select a <select> element and populate its options from array of strings
     * @elSelector - String
     * @currencyArray - Array
     * */
    populateCurrencies (elSelector, currencyArray) {
        let selectElement = document.getElementById(elSelector);

        currencyArray.forEach((currency) => {
            let optionElement = document.createElement('option');
            optionElement.textContent = currency;
            optionElement.value = currency;
            selectElement.appendChild(optionElement);
        });
    };

    displaySupportedSymbols (elSelector, symbolArray) {
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
        this.displaySupportedSymbols(this.supportedSymbolsSelector, ['$','£','€']);
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
        console.log('Match is ', matchedCurrencyArray);
        // set input matched currencies
        let numbersToConvert = {
            'USD': 0,
            'GBP': 0,
            'EUR': 0,
        };
        matchedCurrencyArray.forEach((match) => {
            let numberPart = match.match(/\d/g);
            numberPart = numberPart.join('');
            if (match.match(/\$/g)) {
                numbersToConvert['USD'] += parseFloat(numberPart);
            } else if (match.match(/\£/g)) {
                numbersToConvert['GBP'] += parseFloat(numberPart);
            } else if (match.match(/\€/g)) {
                numbersToConvert['EUR'] += parseFloat(numberPart);
            }
        });
        console.log('Only number matches are: ', numbersToConvert);
        // calculate in output currency
        // return this.userInput.match(currencyRegEx);
        let convertedCurrencies = this.convertCurrency(numbersToConvert);
        // todo: build back the initial string and return it
    }

    //todo: implement
    convertCurrency(currencyObj) {
        return;
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
    let currencyToConvertTo = 'CAD';
    // get DOM elements
    const currencySelector = 'selectedCurrency';
    const supportedSymbolsSelector = 'supportedSymbols';
    let $textInput = document.getElementById('inputText');
    let $textOutput = document.getElementById('outputText');
    let $selectedCurrency = document.getElementById(currencySelector);
    let $convertTrigger = document.getElementById('triggerConversion');

    let currencyFetcher = new CurrencyFinder('Pesho $5 i pesho 20 $','CAD', currencySelector, supportedSymbolsSelector);
    currencyFetcher.processedText;

    $selectedCurrency.addEventListener('change', (event) => {
        let currentlySelectedOption = $selectedCurrency[$selectedCurrency.selectedIndex].value;
        currencyToConvertTo = currentlySelectedOption.substr(0, currentlySelectedOption.indexOf(' '));
        console.log('Active Currency: ', currencyToConvertTo);
    });

    $convertTrigger.addEventListener('click', (event) => {
        event.preventDefault();
        let stringToConvert = $textInput.value;
        console.log('Text to convert is: ', stringToConvert, ' into ', currencyToConvertTo);
        let convertCurrency = new CurrencyFinder(stringToConvert, currencyToConvertTo, currencySelector, supportedSymbolsSelector);
        let matchedString = convertCurrency.processedText;
        console.log('match is', matchedString);
        $textOutput.innerHTML = matchedString;
    });

});
