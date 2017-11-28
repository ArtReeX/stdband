/*globals module*/

/*---------------------------- ОБРАБОТЧИК ДЛЯ API -------------------------------*/
module.exports = function (links, config_module, nightmare_module, cheerio_module, request_module, log, callback) {
    
    "use strict";
    
    links.length = 5;
    
    // переменные 
    var movies = [],
        parseLink = function (count_link) {

            var nightmare_module_emulator = nightmare_module(config_module.emulation), $, info = {
                name: null,
                links: null
            };
            
            // установка обработчиков запросов
            nightmare_module_emulator.on("did-get-response-details", function (
                sender,
                status,
                newURL,
                originalURL,
                httpResponseCode,
                request_moduleMethod,
                referrer,
                headers,
                resourceType
            ) {

                // проверка на содержание адресов для просмотра фильма
                if (newURL.search(config_module.filter.response) !== -1) {

                    request_module(String(newURL), function (error, response, body) {
                        
                        // выход из фрейма
                        nightmare_module_emulator.exitIFrame();
                        
                        // получение страницы
                        nightmare_module_emulator.evaluate(function () { return document.body.innerHTML; }).then(function (html) {

                            // формирование страницы для разбора
                            $ = cheerio_module.load(html);

                            // получение названия
                            info.name = $(".card-title > .text-muted").text();

                            // разбор JSON файла с ссылками
                            try { info.links = JSON.parse(body); } catch (e) { log.warn("Ошибка парсинга ссылок для фильма " + String(Number(count_link + 1)) + "."); }

                            // добавление результата в массив
                            movies.push(info);
                            
                            // логгирование
                            log.debug("Обработан фильм " + String(Number(count_link + 1)) + " из " + String(links.length) + ".");

                            // переход к парсингу следующей страницы
                            if (count_link + 1 < links.length) { parseLink(count_link + 1); } else { callback(null, movies); }
                            
                            // завершение эмуляции
                            nightmare_module_emulator.end(function () { });

                        });
                    });

                }

            });

            // переход по ссылке
            nightmare_module_emulator.goto(String(links[count_link]));

            // ожидание формирование DOM дерева
            nightmare_module_emulator.wait("iframe");
            
            // переход во врейм
            nightmare_module_emulator.enterIFrame("iframe");
            
            // проверка на наличие необходимых элементов
            nightmare_module_emulator.exists(config_module.filter.button_play).then(function (exist) {
                
                // если элемент существует, производим клик
                if (exist) {
                    
                    // клик по кнопке воспроизведения
                    nightmare_module_emulator.click(config_module.filter.button_play);

                    // балансир вселенной
                    nightmare_module_emulator.then(function () { });
                    
                } else {
                    
                    // логгирование
                    log.debug("Не возможно обработать фильм " + String(Number(count_link + 1)) + " из " + String(links.length) + ".");
                    
                    // переход к парсингу следующей страницы
                    if (count_link + 1 < links.length) { parseLink(count_link + 1); } else { callback(null, movies); }
                    
                    // завершение эмуляции
                    nightmare_module_emulator.end(function () { });
                    
                }
                
            });
        
        };
    
    // запуск процесса парсинга
    parseLink(0);
    
};