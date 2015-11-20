/*
Module dealing with user defined gallery, containing selected images.
*/
var UserGallery = {
    
    galleryDiv: null,

    selectedImages: Array(),

    //Initialize module
    init: function(){
        var popup = document.getElementById('popup-container');
        popup.onclick = function () {
            Helper.removeClass(this, 'visible');
        }

        this.galleryDiv = document.getElementById('gallery');

        var clearGallery = document.getElementById('clear-gallery');
        clearGallery.onclick = function () {
            Helper.removeChildren(UserGallery.galleryDiv);
        }
        Helper.addClass(clearGallery, 'hidden');
    },
    
    //Display images
    displaySelectedImages: function (selectedImages) {
        for( var i=0; i < selectedImages.length; i++){
            if( this.selectedImages.indexOf( selectedImages[i]) == -1){
                this.selectedImages.push(selectedImages[i]);
            }
        }
        Helper.removeChildren(this.galleryDiv);

        this.showClearGalleryControl();

        for (var i = 0; i < this.selectedImages.length; i++) {
            var imageDiv = this.createImageDiv(this.selectedImages[i], i);
            this.galleryDiv.appendChild(imageDiv);
        }
    },

    //Clear stage before displaying new stuff
    removeImages: function(){
        Helper.removeChildren(this.galleryDiv);
    },
    
    //Create div container with images
    createImageDiv: function (imageSrc, imageIndex) {
        var div = document.createElement('div');
        div.className = "div-img";

        var image = document.createElement('img');
        image.src = imageSrc;
        div.appendChild(image);
        div.onclick = function () {
            UserGallery.displayImageInPopup(imageSrc, imageIndex);
        }
        return div;
    },

    //Displays image in a overlay popup
    displayImageInPopup: function(imageSrc, imageIndex){
        var popup = document.getElementById('popup-container');
        Helper.removeChildren(popup);

        var fullImage = document.createElement('img');
        fullImage.src = imageSrc;
        fullImage.className = 'popup-image';

 

        var galleryNavigationButtons = this.createGalleryNavigationButtons(imageIndex);
        popup.appendChild(galleryNavigationButtons.prev);
        popup.appendChild(galleryNavigationButtons.next);
 
        popup.appendChild(fullImage);
        Helper.addClass(popup, 'visible');
    },

    //Create Prev/Next buttons for image popup
    createGalleryNavigationButtons: function(imageIndex){
        var prev = document.createElement('a');
        prev.className = "popup-control popup-prev";
        prev.onclick = function (e) {
            var targetIndex = imageIndex;
            if (--targetIndex < 0) {
                targetIndex = UserGallery.selectedImages.length - 1;
            }
            UserGallery.displayImageInPopup(
                UserGallery.selectedImages[targetIndex],
                targetIndex
            );
            e.stopPropagation();
        };
        
        var next = document.createElement('a');
        next.className = "popup-control popup-next";
        next.onclick = function (e) {
            var targetIndex = imageIndex;
            if (++targetIndex >= UserGallery.selectedImages.length) {
                targetIndex = 0;
            }
            UserGallery.displayImageInPopup(
                UserGallery.selectedImages[targetIndex],
                targetIndex
            );
            e.stopPropagation();
        }
 
        return {
            prev: prev,
            next: next
        };
    },

    //Displays clear gallery button, if any pics in gallery
    showClearGalleryControl: function () {
        var clearGallery = document.getElementById('clear-gallery');
        if (this.selectedImages.length > 0) {
            Helper.removeClass(clearGallery, 'hidden');
        }
    }
};

