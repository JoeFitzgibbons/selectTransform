/*************************** SelectTransform.js  ****************************/
/*
/* Author: Joseph Fitzgibbons
/* Email: jfitzy87@gmail.com
/*
/****************************************************************************/

(function( $ ){

    // Constructor
    $.selectTransform = function(elem, method, options){
        var self = this;
        self.$elem = $(elem);
        self.options = options;
        self.method = method;

        var defaults = {
        
            global: {
                method             : 'toButtons',
                listWrap           : '<ul class="selectTransformList"></ul>',
                liClass            : '',
                initSelected       : true
            },
            
            toButtons: {
                insertMarkup       : '',
                wrapElement        : '',
                selectFirst        : false,
                selectType         : 'regular'
            },
            
            toCheckboxes: {
                label              : true,
                selectType         : 'multi'
            }
        }
        
        self.settings = {}
        
        self.init = function(){
            // Remove previous instatiation
            if(self.$elem.data('selectTransformObject')) self.$elem.data('selectTransformObject').remove();
            
            self.$elem.hide();
            
            // merge all default and user defined options into the plugin settings
            self.settings = $.extend( {} , defaults[self.method] , self.options , defaults['global']);
            
            //Init selected option
            if(self.settings.initSelected) self.update(self.$elem.val());
            
            // Capture or generate ID for target element
            self.selectFieldID = self.$elem.attr('id');
            self.selectFieldID = (self.$elem.attr('id') != '') ? self.selectFieldID : 'sw-li_' +new Date();
            
            //initialize wrapper of UI elements
            self.listWrap = $(self.settings.listWrap);
            if(self.listWrap.id != '') self.listWrap.attr('id' , self.selectFieldID + "_selectTransform");
            
            // Generate list of UI elements
            self.$elem.find('option').each(function(){
                $(self.listWrap).append(methods[self.method]['create'](self, $(this)));
            });
            
            // Insert list of UI elements after target element
            $(self.listWrap).insertAfter(self.$elem);
            
            // Bind change event to trigger elements
            $('.selectTransform_trigger' , self.listWrap).each(function(){
                self.bind($(this));
            })
            
            self.$elem.data('selectTransformObject' , self.listWrap);
            
            if(self.settings.initSelected){ self.update(); }
        }
        
        //  setState
        //  Sets the state of individual items which correspond
        //  to the options in the target select field
        
        self.setState = function(selectVal){
        
            // Set all items to unselected
            methods[self.method]['deselectItems'](self);
            
            // set items to selected if it is checked in the select field                
            $.each(selectVal , function(i , value){
                methods[self.method]['selectItem'](self, value);
            });
        }
        
        //  update
        //  sets the value of the target element. 
        //  sets the state of UI and select field
        //  and triggers the change event on the target element
        
        self.update = function(value){
            
            if(value){
                if(self.settings.selectType == "regular"){
                    $('option' , '#' + self.$elem.attr('id')).removeAttr('selected');
                    $('option"[value="'+ value +'"]' , '#' + self.$elem.attr('id')).attr('selected' , 'selected');
                }else{ // is multiselect
                    if($('option[value="'+ value +'"]' , '#' + self.$elem.attr('id')).attr('selected')) $('option[value="'+ value +'"]' , '#' + self.$elem.attr('id')).removeAttr('selected');
                    else $('option[value="'+ value +'"]' , '#' + self.$elem.attr('id')).attr('selected' , 'selected');
                }
    
                var newValue = [];
                self.$elem.find('option[selected="selected"]').each(function(i, item){
                    newValue.push($(item).val());
                });
                self.$elem.val(newValue);
                
                self.setState(newValue);
            }
            else{
                if(!$.isArray(self.$elem.val()))self.setState([self.$elem.val()]);
                else self.setState(); 
            }
            self.$elem.change();
        }
        
        self.bind = function(el){
            el.change(function(){
                self.update(el.attr('data-value'));
            });
        }
        
        self.init();
    }

    // Plugin Methods that drive the plugin and determine the type of interface to be used    
    var methods = {
        
        toButtons: {
        
            create: function(self, el){
                
                var li = $('<li id="' + self.selectFieldID + el.value + '-button" class="selectTransform_trigger' + self.settings.liClass +'" data-value=' + el.val() + '>' + el.text() + '</li>');
                
                if(self.settings.wrapElement != '') $(li).wrapInner($(self.settings.wrapElement));
                if(self.settings.insertMarkup != ''){
                    li.append(self.settings.insertMarkup);
                }
                // Bind change event to click so that change event will fire to update target element
                $(li).bind( 'click' , function(){li.change()});
                
                return li;
            },
            
            deselectItems: function(self){
                $('.selectTransform_trigger' , '#' + self.selectFieldID + "_selectTransform").removeClass('selected');   
            },
            
            selectItem: function(self, value){
                   $('.selectTransform_trigger[data-value="' + value + '"]' , '#' + self.selectFieldID + "_selectTransform").addClass('selected');
            }
                
        },
        
        // For Multiselect Only
        toCheckboxes: {
        
            create: function(self, el){
                var li = $('<li class="' + self.settings.liClass + '"></li>');
                li.append('<input type="checkbox" name="' + el.val() +'" data-value="' + el.val() + '" id="' + el.val() + '-check-' + self.$elem.attr('id') + '" class="selectTransform_trigger" />');
                
                if(self.settings.label){
                    li.append('<label for="' + el.val() + '-check-' + self.$elem.attr('id') + '" class="label">' + el.text() +'</label>');   
                }
                return li;
            },
            
            deselectItems: function(self){
                $('.selectTransform_trigger' , self.selectFieldID + "_selectTransform").removeAttr('checked');
            },
            // Not needed based on default checkbox functionality
            selectItem: function(self , value){}
        }
    };
     
    $.fn.selectTransform = function(){
        var pluginArgs = arguments;
        return this.each(function(){
            // Method calling logic
            if ( methods[pluginArgs[0]] ) {
              var plugin = new $.selectTransform(this, pluginArgs[0] , pluginArgs[1]);
            } else if ( typeof pluginArgs[0] === 'object' || !pluginArgs[0] ) {
              var plugin = new $.selectTransform(this, 'toButtons' , pluginArgs[1]);
            } else {
              return $.error( 'Method ' +  pluginArgs + ' does not exist on jQuery.selectTransform' );
            }
        });
    };
})( jQuery );