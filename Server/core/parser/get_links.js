/*globals module*/

/*---------------------------- ОБРАБОТЧИК ДЛЯ API -------------------------------*/
module.exports = function (config_module, nightmare_module, cheerio_module, log, callback) {
    
    "use strict";

    // переменные 
    var $, nightmare_module_emulator = nightmare_module(config_module.emulation), links = [];
    
    // переход по ссылке
    nightmare_module_emulator.goto("http://" + String(config_module.site) + "/");
    
    // получение страницы и её обработка
    nightmare_module_emulator.evaluate(function () { return document.body.innerHTML; }).then(function (html) {
        
        // отправка страницы в модуль для обработки
        $ = cheerio_module.load(html);
        
        // добавление каждой ссылки в массив
        $(".card > a").each(function (number, link) { links.push($(link).attr("href")); });
        
        // окончание эмуляции и 
        nightmare_module_emulator.end().then(null);
        
        // возвращение результата
        callback(null, links);
        
    });
    
};