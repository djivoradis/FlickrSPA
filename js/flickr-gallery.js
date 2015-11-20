/**
Flickr Gallery module
*/
var FlickrGallery = {

    lastSearch          : "",
    minSearchTermLength : 3,
    currentPage         : 1,
    numOfPages          : 0,
    selectedImages      : Array(),
    cache               : Array(),
    apiKey              : '3f8dbc2b608f6eaaccc25776e8312cd4',
    picsPerPage         : 20,

    //Initialize
    init: function(){
        this.initPagingControl();
        this.initClearSelection();
    },

    //Validate input and perform search
    searchFlickr: function( searchTerm ){
        if (searchTerm.length < this.minSearchTermLength) {
            this.setSearchStatus('Minimum search term length is: ' + this.minSearchTermLength, 'error');
            return;
        }
        this.lastSearch = searchTerm;
        this.sendRequestToFlickr(searchTerm);
    },

    //Perform search
    sendRequestToFlickr: function (searchTerm, page) {
        var sendRequest = false;
        if (page == undefined || page == null) {
            page = 1;
            this.cache = Array();
            sendRequest = true;
        } else {
            var cachedResponse = this.getCachedResponse(searchTerm, page);
            if ( cachedResponse !== null) {
                this.processFlickrResponse(cachedResponse)
            } else {
                sendRequest = true;
            }
        }
        this.page = page;
            
        if (sendRequest) {
            this.searchTerm = searchTerm;
            var url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key='+this.apiKey+'&text=' + encodeURI(searchTerm) + '&per_page='+this.picsPerPage+'&page=' + page + '&jsoncallback=processFlickrResponse';
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },

    //Main search status bar
    setSearchStatus: function (message, statusClass) {
        var statusContainer = document.getElementById('status-div');
        Helper.setText(statusContainer, message);
        Helper.removeClass(statusContainer);
        Helper.addClass(statusContainer, statusClass);
    },

    //Returns cached response for given searh term / page
    getCachedResponse: function(searchTerm, page) {
        var cachedResponse = null;
        for (var i = 0; i < this.cache.length; i++) {
            if (this.cache[i].searchTerm == searchTerm && this.cache[i].page == page) {
                cachedResponse = this.cache[i].cachedResponse;
            }
        }
        return cachedResponse;
    },

    //Flickr response callback
    processFlickrResponse: function(response) {
        if (response.stat != undefined) {
            if (response.stat == 'ok') {
                this.setSearchStatus(
                    "Flickr returned " + response.photos.total + " photos matching your search. " +
                    "Displaying page #" +response.photos.page+" of "+ response.photos.pages,
                    'success'
                );
                //Cache this response to avoid resending requests to flickr
                this.addToCache(response);
                //Set max num of pages for current search
                this.numOfPages = response.photos.pages;
                //Remove previous search images if any
                this.removeExistingImages();
                //Search status
                this.updateGalleryStatus();
                //Display images
                this.addImages(response);
            } else {
                this.setSearchStatus("Flickr returned error: " + response.message, 'error');
            }
        }
    },

    //Cache response
    addToCache: function (response) {
        if (this.getCachedResponse(this.lastSearch, response.photos.page) === null) {
            this.cache.push({
                searchTerm: this.lastSearch,
                page: response.photos.page,
                cachedResponse: response
            });
        }
    },

    //Remove old images
    removeExistingImages: function () {
        var imageContainer = document.getElementById('image-container');
        Helper.removeChildren(imageContainer);
    },

    //Initialize Prev-Next control
    initPagingControl: function () {
            
        var pagingContainer = document.getElementById('paging-control-container');
        if (pagingContainer.children.length > 0) {
            return;
        }

        var prev = document.createElement('button');
        prev.type = "Button";
        Helper.setText(prev, '<');
        prev.className = "paging-control";
        prev.onclick = function () {
            FlickrGallery.currentPage = --FlickrGallery.currentPage < 1 ? 1 : FlickrGallery.currentPage;
            FlickrGallery.sendRequestToFlickr(FlickrGallery.lastSearch, FlickrGallery.currentPage);
        }

        var next = document.createElement('button');
        next.type = "Button";
        Helper.setText(next, '>');
        next.className = "paging-control";
        next.onclick = function () {
            FlickrGallery.currentPage = ++FlickrGallery.currentPage > FlickrGallery.numOfPages ? FlickrGallery.numOfPages : FlickrGallery.currentPage;
            FlickrGallery.sendRequestToFlickr(FlickrGallery.lastSearch, FlickrGallery.currentPage);
        }
 
        pagingContainer.appendChild(prev);
        pagingContainer.appendChild(next);
    },

    //Clear selection event handlers
    initClearSelection: function(){
        var clearSelection = document.getElementById('clear-selection-button');
        clearSelection.onclick = function () {
            FlickrGallery.selectedImages = Array();
            FlickrGallery.updateGalleryStatus();
            var selectedImgs = document.getElementsByClassName('image-selected');
            var selectedArray = Array.prototype.slice.call(selectedImgs);
            for (var i = 0; i < selectedArray.length; i++) {
                Helper.removeClass(selectedArray[i], 'image-selected');
            }
        }
    },

    //Add image divs
    addImages: function(response) {
        if (response.photos == undefined || response.photos == null) {
            console.log('Invalid images object, missing photos property');
            return;
        }
            
        for (var i = 0; i < response.photos.photo.length; i++) {
            var imageSrc = this.createFlickrImageSrc(response.photos.photo[i]);
            if (imageSrc) {
                this.createImage(imageSrc);
            }
        }
    },

    //Compose string url from flickr components
    createFlickrImageSrc: function (imageObject) {
        if (imageObject.server == undefined) {
            console.log("Invalid flickr image object, missing property: server");
            return;
        }
        /** https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg */
        var imageSrc = 'https://farm' + imageObject.farm + '.staticflickr.com/' + imageObject.server + '/' + imageObject.id + '_' + imageObject.secret + '.jpg';
        return imageSrc;
    },

    //Create dom image
    createImage: function (imageSrc) {
        var imageDiv = document.createElement('div');
        var img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'img';

        var galleryStatusIcon = this.createGalleryStatusIcon(imageSrc);
        imageDiv.appendChild(galleryStatusIcon);

        imageDiv.onclick = function () {
            FlickrGallery.addToGallery(imageSrc, galleryStatusIcon);
        }
        imageDiv.className = 'div-img';
        imageDiv.appendChild(img);
            

        document.getElementById('image-container').appendChild(imageDiv);
    },

    //Adds imageSrc to gallery, and updates statuses
    addToGallery: function (imageSrc, galleryStatusIcon) {
        var index = FlickrGallery.selectedImages.indexOf(imageSrc);
        if (index > -1) {
            FlickrGallery.selectedImages.splice(index, 1);
            Helper.removeClass(galleryStatusIcon, 'image-selected');
        } else {
            FlickrGallery.selectedImages.push(imageSrc);
            Helper.addClass(galleryStatusIcon, 'image-selected');
        }
        FlickrGallery.updateGalleryStatus();
    },

    //Create lil' div for selecting images
    createGalleryStatusIcon: function (imageSrc) {
        var a = document.createElement('a');
        //a.href = "#";
        a.setAttribute('data-image-src', imageSrc);
        a.className = 'add-to-gallery-control';
        if (this.selectedImages.indexOf(imageSrc) > -1) {
            a.className += ' image-selected';
        }

        return a;
    },

    //Update status bar on (de)selecting images
    updateGalleryStatus: function () {
        var spanSelected = document.getElementById('gallery-button');
        Helper.setText(spanSelected, this.getGalleryStatusText());
        if (this.selectedImages.length > 0) {
            this.toggleViewGalleryButton()
        }
    },

    //Status bar text
    getGalleryStatusText: function () {
        return "View Selected Images (" + this.selectedImages.length + ")";
    },
        
    //Toggles visibility of gallery button based on num of selected images
    toggleViewGalleryButton: function () {
        var button = document.getElementById('gallery-button');  
    },

    getSelectedImages: function () {
        return this.selectedImages.slice();
    },

    getApiKey: function () {
        return this.apiKey;
    },

    getPicsPerPage: function () {
        return this.picsPerPage;
    },

    setApiKey: function(apiKey){
        this.apiKey = apiKey;
    },

    setPicsPerPage: function (ppp) {
        if (isNaN(ppp)) {
            ppp = 10;
        }
        this.picsPerPage = ppp;
    }
}