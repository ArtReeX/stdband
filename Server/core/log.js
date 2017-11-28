/*globals require, module*/

/*----------- ЗАГОЛОВКИ -----------*/
var log4js_module = require("log4js");


/*---------------------------- LOG -------------------------------*/
module.exports.create = function (config, callback) {
    
    "use strict";

    // задание параметров логирования
    log4js_module.configure(

        {
            "appenders": {

                "console": {
                    type: "console"
                },

                "cheeseLogs": {
                    "type": "file",
                    "filename": config.log.file,
                    "maxLogSize": config.log.file_size,
                    "backups": config.log.file_backup
                }

            },

            categories: {

                "cheese": {
                    "appenders": ["cheeseLogs"],
                    "level": config.log.level
                },

                "another": {
                    "appenders": ["console"],
                    "level": config.log.level
                },

                "default": {
                    "appenders": ["console", "cheeseLogs"],
                    "level": config.log.level
                }

            }

        }
    );

    // создание логгера
    var logger = log4js_module.getLogger();
    
    // вызов callback-функции
    callback(null, logger);
    
};