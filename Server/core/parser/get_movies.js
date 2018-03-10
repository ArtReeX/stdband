/*globals module*/

/*---------------------------- ОБРАБОТЧИК ДЛЯ API -------------------------------*/
module.exports = function (links, config_module, nightmare_module, cheerio_module, request_module, log, callback) {
    
    "use strict";
    
    links.length = 5;
    
    // переменные 
    var movies = [],
        parseEpisode = function (episodes, count_episode, nightmare_module_emulator, $) {

            // клик по эпизоду из списка
            nightmare_module_emulator.select(config_module.filter.selector_episodes, $(episodes[count_episode]).val()).then(function () {

                nightmare_module_emulator.exists(config_module.filter.button_play).then(function (exist) {

                    if (exist) {

                        // клик по кнопке воспроизведения
                        nightmare_module_emulator.click(config_module.filter.button_play).then(function () {

                            // переход к парсингу следующей серии
                            if (count_episode + 1 < episodes.length) { parseEpisode(count_episode + 1); } else {  }

                        });

                    } else { log.warn("Элемент", config_module.filter.button_play, "отсутствует на странице."); }

                });

            });

            console.log(count_episode);
            
        },
        parseLink = function (count_link) {

            var nightmare_module_emulator = nightmare_module(config_module.emulation);
            
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
                        
                        // получение страницы
                        nightmare_module_emulator.evaluate(function () { return document.body.innerHTML; }).then(function (html) {

                            // отправка страницы в модуль для обработки
                            var $ = cheerio_module.load(html), info = {
                                name: null,
                                links: null
                            };

                            // получение названия
                            info.name = $(".card-title > .text-muted").text();

                            // разбор JSON файла с ссылками
                            try { info.links = JSON.parse(body); } catch (e) { log.warn("Ошибка парсинга ссылок для фильма " + String(Number(count_link + 1)) + "."); }

                            // добавление результата в массив
                            movies.push(info);
                            
                            // логгирование
                            log.info("Обработан фильм " + String(Number(count_link + 1)) + " из " + String(links.length) + ".");

                            // переход к парсингу следующей страницы
                            //if (count_link + 1 < links.length) { parseLink(count_link + 1); } else { callback(null, movies); }
                            
                            // завершение эмуляции
                            //nightmare_module_emulator.end().then(null);;

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
            
            // проверка на наличие списка эпизодов
            nightmare_module_emulator.exists(config_module.filter.selector_episodes).then(function (exist) {
                
                // если элемент существует, производим клик
                if (exist) {
                    
                    // получение обновлённого фрейма
                    nightmare_module_emulator.evaluate(function () { return document.body.innerHTML; }).then(function (html) {

                        // отправка страницы в модуль для обработки
                        var $ = cheerio_module.load(html), episodes = $(config_module.filter.selector_episodes + " > option");
                        
                        // логгирование
                        log.debug("Найдено", episodes.length, "серий.");
                        
                        // запуск процесса парсинга эпизодов
                        parseEpisode(episodes, 0, nightmare_module_emulator, $);

                    });
                    
                } else { log.warn("Элемент", config_module.filter.selector_episodes, "отсутствует на странице."); }
                
            });
        
        };
    
    // запуск процесса парсинга ссылок
    parseLink(0);
    
};