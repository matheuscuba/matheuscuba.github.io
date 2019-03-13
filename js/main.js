window.Main = new function(){
    'use strict';

    let self = this;
    let version = '1.0';

    self.$http;
    self.lang;
    self.supportedLangs = ['pt-BR', 'en-US'];

    self.init = function(){
        self.defineLang();
        self.configAxios();
        self.initVue();
        self.loadParticles();
        self.initFullPages();
    };

    self.defineLang = function(){
        let lang = navigator.language || navigator.userLanguage;
        if(!lang || self.supportedLangs.indexOf(lang) < 0)
            lang = 'en-US';

        self.lang = lang.toLowerCase();
    };

    // Load Main Particles
    self.loadParticles = function(){
        particlesJS.load('home', 'js/plugins/particles.json', function() {
            console.log('Particles loaded!');
        });
    };

    self.configAxios = function(){
        self.$http = axios.create({
            baseURL: window.location.href,
            params: {
                v: version
            }
        });
    };

    self.initFullPages = function(){
        new fullpage('#wrapper', {
            lockAnchors: true,
            sectionSelector: '.section',
            navigation: true,
            slidesNavigation: true,
            navigationTooltips: ['Home', 'Projetos', 'Fotografia', 'Sobre Mim', 'Contato']
        });
    };

    self.initVue = function(){
        window.App = new Vue({
            el: '#wrapper',
            data: {
                theme: 'light-theme',
                content: {
                    sections: {
                        about: {},
                        photography: {},
                        projects: {}
                    }
                },
                projects: [],
                links: {},
            },
            beforeMount: async function(){
                let vue = this;
                self.$http.get('/i18n/' + self.lang + '.json').then(function(d){
                    let data = d.data;
                    vue.content = data;
                });
                self.$http.get('/data/links.json').then(function(d){
                    let data = d.data;
                    vue.links = data;
                });
                self.$http.get('/data/projects.json').then(function(d){
                    let data = d.data;
                    vue.projects = data;
                });
            },
            methods: {
                changeLang: function(lang){
                    let vue = this;
                    self.lang = lang;
                    self.$http.get('/i18n/' + self.lang + '.json').then(function(d){
                        let data = d.data;
                        vue.content = data;
                    });
                },
                toggleTheme: function(){
                    this.theme = this.theme == 'dark-theme' ? 'light-theme' : 'dark-theme';
                }
            }
        });
    };

    self.init();
};