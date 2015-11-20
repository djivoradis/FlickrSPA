/**
Helper DOM module with DRY code
*/
var Helper = {
    //Remove one class, or all if classname not provided
    removeClass: function (element, className) {
        if (className == undefined) {
            element.className = '';
        } else {
            element.className = element.className.replace(className, '');
        }
    },

    //Add class to element
    addClass: function (element, className) {
        if (element.className.match(className) === null) {
            element.className += ' ' + className;
        }
    },

    //Remove all children of given element
    removeChildren: function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    //click event
    createClickEvent: function(){
        //return new Event('click');
        var event = document.createEvent("Event");
        event.initEvent('click', true, false);
        return event;
    },

    //Set text content of elelement
    setText: function(element, text){
        if (element.textContent !== undefined) {
            element.textContent = text;
        } else if (element.innerText != undefined) {
            element.innerText = text;
        } 
    }
};
