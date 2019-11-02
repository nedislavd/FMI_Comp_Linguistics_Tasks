/*
* Да се напише приложение,
* което намира български имена в текст на кирилица и
* ги заменя с техни западни еквиваленти и генерира съответния изходен текст.
* Например: Йоан => Джон, Георги => Джордж и т.н.
* Еквивалентите да се прочетат от база знания динамично.
* */


/*
* TODO: array incudes json key, replace with json value
* */

'use strict';

import * as nameLib from './task4_bulgarian_english_name_db_map.json';


class NameSwapper {
    constructor(userInput, $outputElSelector) {
        this.userInput = userInput;
        this.$outputElSelector = $outputElSelector;
    }
    /**
     * Finds all Dictionary Cyrillic Matches and Replaces them with English counterparts
     * @returns - String, name swapped input
     * */
    findNameMatch() {
        let $outputEl = document.getElementById(this.$outputElSelector);
        let stringToEdit = this.userInput;

        console.log('User input is: ', this.userInput);
        for (let [bgName, enName] of Object.entries(nameLib.default)) {
            let regEx = new RegExp(bgName, "ig");
            if (stringToEdit.includes(bgName)) {
                console.warn('MATCH', bgName, ':', enName);
                stringToEdit = stringToEdit.replace(regEx, enName);
            }
        }
        console.log('Final output string is: ', stringToEdit);
        // return convertedString;
        $outputEl.value = stringToEdit;
    }

    get processedText() {
        return this.findNameMatch();
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.debug('DOM loaded...');
    // get DOM elements
    const textOutputSelector = 'outputText';
    let $textInput = document.getElementById('inputText');
    let $convertTrigger = document.getElementById('triggerConversion');

    const testString = `Това е тест за преименуване на ето тези хубавци:
                        Иван, Петър, Петя, Трендафил и Унуфри...`;
    $textInput.value = testString;

    let initNameSwapper = new NameSwapper(testString, textOutputSelector);
    initNameSwapper.processedText;


    $convertTrigger.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Text to convert is: ', $textInput.value);
        let convertNameOnButtonClick = new NameSwapper($textInput.value, textOutputSelector);
        convertNameOnButtonClick.processedText;
    });

    $textInput.addEventListener('keyup', (event) => {
        console.log('changing input');
        let nameSwapOnInput = new NameSwapper($textInput.value, textOutputSelector);
        nameSwapOnInput.processedText;
    });

});
