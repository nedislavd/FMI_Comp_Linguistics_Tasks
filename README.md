# Computer Linguistics Regular Expression Course Work for FMI

## Tasks:
  - Да се напише на избран от вас език софтуерно приложение, което анализира текст, намира в него всички  цени в определена валута и ги преобразува в БГ левове, като използва база знания за валутните курсове на БНБ. В изходния текст всички цени да са в левове. Бонус: да се доразвие, като се даде възможност на потребителя да избира сам изходната валута.
  - Да се напише приложение, което в даден текст намира всички дробни числа, написани в десетична позиционна бройна система, преобразува ги до бройна система с някоя от следните основи: 2, 16, 8, 5, 10 и генерира текст, в който числата са преобразувани. Потребителят да може да избира изходната ПБС.
  - Да се напише приложение, което разпознава  във въведен текст телефонни номера (във възможно повече формати), и да ги добавя в база знания, като се опита от текста да разбере името на притежателя на съответния телефонен номер по алгоритъм, базиран на парсване на текст и използване на регулярни изрази.
  - Да се напише приложение, което намира български имена в текст на кирилица и ги заменя с техни западни еквиваленти и генерира съответния изходен текст. Например: Йоан => Джон, Георги => Джордж и т.н. Еквивалентите да се прочетат от база знания динамично. 
  - Да се напише приложение, което приема адрес към която и да е уеб страница, зарежда изходния ѝ код и търси текст по зададен от потребител шаблон на регулярен израз, намира чрез регулярни изрази други страници и ги добавя за по-късно посещение в стек и с тях прави същото. Намерените текстове да се съхраняват в база данни, както и URL адресите на вече посетените и обработени уеб страници. Бонус точки, ако се направи асинхронно и многонишково, както и ако се публикува в git с документация за проекта.
  //TODO - translate  


### Installation
 - Open a command prompt and navigate inside the main repository directory, where `package.json` resides
 
    `/FMI_Comp_Linguistics_Tasks`
 - Run the following command:
 
    ```
    npm install
    ```

### Start Dev Server
 - Open a command prompt and navigate inside the main repository directory, where `package.json` resides
    
    `/FMI_Comp_Linguistics_Tasks`
 - Run the following command:
 
    ```
    npm start
    ```

### Build Prod Version

```
npm run build
```

### Features:

* ES6 Support via [babel](https://babeljs.io/) (v7)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
