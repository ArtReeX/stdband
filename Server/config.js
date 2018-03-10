/*-------------- ПАРАМЕТРЫ ------------------*/
var config = {

    /* ПАРАМЕТРЫ ЛОГГИРОВАНИЯ
    Уровень логирования (TRACE | DEBUG | INFO | WARN | ERROR | FATAL)
    FATAL   - ошибки приводящие к невозможности работы приложения
    ERROR   - ошибки, но приложение может продолжать работу
    WARN    - предупреждения о возможных проблемах и ошибках
    INFO    - информация о нормальном ходе выполненияи программы, которую нужно знать пользователю
    DEBUG   - информация о нормальном ходе выполненияи программы, предназначенная для разработчиков
    TRACE   - несущественная информация для глубокой отладки
    */

    // параметры логирования
    "log": {

        "level": "TRACE",
        "file": "./logs/log.txt",
        "file_size": 1000000,
        "file_backup": 20

    },
    
    // параметры эмуляции браузера
    "emulation": {
        
        "show": true,
        "webPreferences": {
            "webSecurity": false,
            "images": false
        }
        
    },
    
    filter: {
        
        "response": ["manifest_mp4.json"],
        "button_play": "#play_button",
        "selector_episodes": "#episodes_selector"
    
    },
    
    // адресс сайта для парсинга
    "site": "stdband.ru"

};


/*-------------- ЭКСПОРТ ------------------*/
/*globals module*/
module.exports = config;