/**
Controller and scaffolding module
*/
var Controller = {

    init: function () {

        this.initTabs();
        this.initViewGallery();
        this.initSearch();
        this.initSettings();
        this.initOnSrollAffix();
        //Init modules
        FlickrGallery.init();
        UserGallery.init();
    },

    //Menu navbar tabs
    initTabs: function() {
        var tabControls = document.getElementsByClassName('tab');
        for (var index = 0; index < tabControls.length; index++) {
            //Tab toggle
            tabControls[index].addEventListener('click', function (e) {

                var target = e.target || e.srcElement;
                var activeTabId = target.getAttribute('data-target');
                var tabs = document.getElementsByClassName('tab-content');

                for (var tIndex = 0; tIndex < tabs.length; tIndex++) {
                    if (tabs[tIndex].id !== activeTabId ) {
                        Helper.removeClass(tabs[tIndex],/\s*tab-active/);
                    } else {
                        Helper.addClass(tabs[tIndex], 'tab-active');
                    }
                }
                
                for (var i = 0; i < tabControls.length; i++) {
                    if (tabControls[i] !== this) {
                        Helper.removeClass(tabControls[i], 'tab-control-active');
                    } else {
                        Helper.addClass(tabControls[i], 'tab-control-active');
                    }
                }

            });
        }
    },

    //Search box
    initSearch: function () {

        var searchForm = document.getElementById('search-form');
        searchForm.onsubmit = function () {
            var searchTerm = document.getElementById("search-box").value;
            FlickrGallery.searchFlickr(searchTerm);
            return false;
        }

    },

    //User defined gallery 
    initViewGallery: function() {
        var button = document.getElementById('gallery-button');
        var galleryTabToggle = document.getElementById('gallery-tab-toggle');
        button.onclick = function () {
            var event = Helper.createClickEvent();
            Controller.displaySelectedImages();
            galleryTabToggle.dispatchEvent(event);
        }
        galleryTabToggle.onclick = this.displaySelectedImages;
    },

    //Display images
    displaySelectedImages: function() {
        UserGallery.displaySelectedImages(FlickrGallery.getSelectedImages());
    },

    //Basic settings
    initSettings: function() {
        var apiKey = document.getElementById('apiKey');
        apiKey.value = FlickrGallery.getApiKey();
        apiKey.onchange = function () {
            FlickrGallery.setApiKey(this.value);
        }

        var picsPerPage = document.getElementById('picsPerPage');
        picsPerPage.value = FlickrGallery.getPicsPerPage();
        picsPerPage.onclick = function () {
            FlickrGallery.setPicsPerPage(this.value);
        }
    },

    //On scroll affix, adds affix-bottom, affix-top to .a-top, .a-bottom elements
    initOnSrollAffix: function(){
        window.onscroll = function () {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {

                affixalbeTop = document.getElementsByClassName('a-top');
                for (var i = 0; i < affixalbeTop.length; i++) {
                    Helper.addClass(
                        affixalbeTop[i],
                        'affix-top'
                    );
                }

                affixalbeBottom = document.getElementsByClassName('a-bottom');
                for (var i = 0; i < affixalbeBottom.length; i++) {
                    Helper.addClass(
                        affixalbeBottom[i],
                        'affix-bottom'
                    );
                }
            } else {

                affixalbeTop = document.getElementsByClassName('a-top');
                for (var i = 0; i < affixalbeTop.length; i++) {
                    Helper.removeClass(
                        affixalbeTop[i],
                        'affix-top'
                    );
                }

                affixalbeBottom = document.getElementsByClassName('a-bottom');
                for (var i = 0; i < affixalbeBottom.length; i++) {
                    Helper.removeClass(
                        affixalbeBottom[i],
                        'affix-bottom'
                    );
                }
            }
        }
    }

}