/*globals module*/

/*---------------------------- ОБРАБОТЧИК ДЛЯ API -------------------------------*/
module.exports = function (config_module, nightmare_module, cheerio_module, log, callback) {
    
    "use strict";

    // переменные 
    var $, nightmare_module_emulator = nightmare_module(config_module.emulation), links = [];
    
    // переход по ссылке
    nightmare_module_emulator.goto("http://" + String(config_module.site) + "/");
    
    // получение страницы
    nightmare_module_emulator.evaluate(function () { return document.body.innerHTML; });
        
    // окончание эмуляции
    nightmare_module_emulator.end(function (html) {
        
        // формированиестраницы для разбора
        $ = cheerio_module.load(html);

        // добавление каждой ссылки в массив
        $(".card > a").each(function (number, link) {
            links.push($(link).attr("href"));
        });

        // возврата результата
        callback(null, links);
        
    });
    
};