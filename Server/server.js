/*global require*/

/*-------------- ЗАГОЛОВКИ ------------------*/
var async_module = require("async"),
    nightmare_module = require("nightmare"),
    cheerio_module = require('cheerio'),
    request_module = require('request'),
    config_module = require("./config"),
    log_module = require("./core/log"),
    parser_module = require("./core/parser");

// модуль для работы с фреймами
require("nightmare-iframe-manager")(nightmare_module);


/*-------------- ПЕРЕМЕННЫЕ ------------------*/
var log, parser_links, parser_movies;



/*-------------- ПАРСЕР ------------------*/
async_module.series([
    
    // лог
    function (done) {
        
        "use strict";
        
        log_module.create(config_module, function (error, logger) {
            
            if (error) { done(error); } else {
                log = logger;
                done();
            }
            
        });
        
    },
    
    // получение ссылок на страницы с фильмами
    function (done) {
        
        "use strict";
        
        // логгирование
        log.info("Начало получения ссылок на страницы с фильмами с сайта: " + String(config_module.site));
        
        parser_module.get_links(config_module, nightmare_module, cheerio_module, log, function (error, links) {
            
            if (error) { done(error); } else {
                
                // логгирование
                log.info("Было найдено " + links.length + " страниц с фильмами.");
                log.trace(links);
                
                parser_links = links;
                done();
            }
            
        });
        
    },
    
    // получение ссылок на фильмы
    function (done) {
        
        "use strict";
        
        // логгирование
        log.info("Начало получения ссылок на фильмы с сайта: " + String(config_module.site));
        
        parser_module.get_movies(parser_links, config_module, nightmare_module, cheerio_module, request_module, log, function (error, movies) {
            
            if (error) { done(error); } else {
                
                // логгирование
                log.info("Было найдено " + movies.length + " ссылок на фильмы.");
                log.trace(movies);
                
                parser_movies = movies;
                done();
            }
            
        });
        
    }
    
], function (error) {
    
    "use strict";
    
    if (error) {
        log.error(error);
        log.error("Не удалось завершить парсинг.");
    } else { log.info("Парсинг успешно завершён."); }
    
});