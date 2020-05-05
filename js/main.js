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
        self.initVue();
        self.initFullPages();
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

    self.initFullPages = function () {
        self.pages = new fullpage('#wrapper', {
            lockAnchors: true,
            sectionSelector: 'section',
            navigation: true,
            slidesNavigation: true,
        });
    };

    self.initVue = function () {
        window.App = new Vue({
            el: '#wrapper',
            data: {
                theme: self.isDarkMode ? 'theme-dark' : 'theme-light',
                languages: self.supportedLangs,
                currentLang: self.currentLang,
                content: {
                    title: '',
                    subtitle: '',
                    work: {},
                    contact: {},
                },
                projects: [],
                links: {},
            },
            beforeMount: async function () {
                var vue = this;

                YAML.fromURL('/i18n/' + self.lang + '.yml', function (data) {
                    vue.content = data;
                });

                YAML.fromURL('/data/links.yml', function (data) {
                    vue.links = data;
                });

                YAML.fromURL('/data/projects.yml', function (data) {
                    vue.projects = data.projects;
                    self.initColors();
                });

                // self.$http
                //     .get('/i18n/' + self.lang + '.yml')
                //     .then(function (d) {
                //         var data = d.data;
                //         vue.content = YAML.parse(data);
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

                    if (lang == self.lang) return;

                    self.lang = lang;
                    this.currentLang = lang;
                    YAML.fromURL('/i18n/' + self.lang + '.yml', function (
                        data,
                    ) {
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
