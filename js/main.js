window.Main = new (function () {
    'use strict';

    var self = this;
    var version = '1.0';

    self.$http;
    self.lang;
    self.supportedLangs = ['pt-BR', 'en-US'];
    self.isDarkMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    self.init = function () {
        self.defineLang();
        self.configAxios();
        self.initVue();
        self.initFullPages();
        self.initColors();
        self.events();
    };

    self.events = function () {
        document
            .getElementsByClassName('scroll')[0]
            .addEventListener('click', function () {
                self.pages.moveSectionDown();
            });
    };

    self.defineLang = function () {
        var lang = navigator.language || navigator.userLanguage;
        if (!lang || self.supportedLangs.indexOf(lang) < 0) lang = 'en-US';

        self.lang = lang.toLowerCase();
    };

    self.initColors = function () {
        var items = document.querySelectorAll('[color]');
        for (var index = 0; index < items.length; index++) {
            var element = items[index];
            element.style.backgroundColor = element.getAttribute('color');
        }
    };

    self.configAxios = function () {
        self.$http = axios.create({
            baseURL: window.location.href,
            params: {
                v: version,
            },
        });
    };

    self.initFullPages = function () {
        self.pages = new fullpage('#wrapper', {
            lockAnchors: true,
            sectionSelector: 'section',
            navigation: true,
            slidesNavigation: true,
            navigationTooltips: ['Home', 'Projetos'],
        });
    };

    self.initVue = function () {
        window.App = new Vue({
            el: '#wrapper',
            data: {
                theme: self.isDarkMode ? 'theme-dark' : 'theme-light',
                content: {
                    sections: {
                        about: {},
                        photography: {},
                        projects: {},
                    },
                },
                projects: [],
                links: {},
            },
            beforeMount: async function () {
                var vue = this;
                // self.$http
                //     .get('/i18n/' + self.lang + '.json')
                //     .then(function (d) {
                //         var data = d.data;
                //         vue.content = data;
                //     });
                // self.$http.get('/data/links.json').then(function (d) {
                //     var data = d.data;
                //     vue.links = data;
                // });
                // self.$http.get('/data/projects.json').then(function (d) {
                //     var data = d.data;
                //     vue.projects = data;
                // });
            },
            methods: {
                changeLang: function (lang) {
                    var vue = this;
                    self.lang = lang;
                    self.$http
                        .get('/i18n/' + self.lang + '.json')
                        .then(function (d) {
                            var data = d.data;
                            vue.content = data;
                        });
                },
                toggleTheme: function () {
                    this.theme =
                        this.theme == 'theme-dark'
                            ? 'theme-light'
                            : 'theme-dark';
                },
            },
        });
    };

    self.init();
})();
