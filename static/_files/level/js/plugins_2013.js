// This adds 'placeholder' to the items listed in the jQuery .support object. 
jQuery(function() {
   jQuery.support.placeholder = false;
   test = document.createElement('input');
   if('placeholder' in test) jQuery.support.placeholder = true;
});


// This adds placeholder support to browsers that wouldn't otherwise support it. 
$(function() {
   if(!$.support.placeholder) { 
      var active = document.activeElement;
      $(':text').focus(function () {
         if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
            $(this).val('').removeClass('hasPlaceholder');
         }
      }).blur(function () {
         if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
            $(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
         }
      });
      $(':text').blur();
      $(active).focus();
      $('form:eq(0)').submit(function () {
         $(':text.hasPlaceholder').val('');
      });
   }
});

/*
 * Hammer.JS
 * version 0.6.1
 * author: Eight Media
 * https://github.com/EightMedia/hammer.js
 * Licensed under the MIT license.
 */
function Hammer(a,b,c){function x(a){return a.touches?a.touches.length:1}function y(a){a=a||window.event;if(!w){var b=document,c=b.body;return[{x:a.pageX||a.clientX+(b&&b.scrollLeft||c&&c.scrollLeft||0)-(b&&b.clientLeft||c&&b.clientLeft||0),y:a.pageY||a.clientY+(b&&b.scrollTop||c&&c.scrollTop||0)-(b&&b.clientTop||c&&b.clientTop||0)}]}else{var d=[],e;for(var f=0,g=a.touches.length;f<g;f++){e=a.touches[f];d.push({x:e.pageX,y:e.pageY})}return d}}function z(a,b){return Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}function A(a,b){var c=b.x-a.x,d=b.y-a.y;return Math.sqrt(c*c+d*d)}function B(a,b){if(a.length==2&&b.length==2){var c=A(a[0],a[1]);var d=A(b[0],b[1]);return d/c}return 0}function C(a,b){if(a.length==2&&b.length==2){var c=z(a[1],a[0]);var d=z(b[1],b[0]);return d-c}return 0}function D(a,b){b.touches=y(b.originalEvent);b.type=a;if(L(d["on"+a])){d["on"+a].call(d,b)}}function E(a){a=a||window.event;if(a.preventDefault){a.preventDefault();a.stopPropagation()}else{a.returnValue=false;a.cancelBubble=true}}function F(){i={};k=false;j=0;f=0;g=0;l=null}function H(c){switch(c.type){case"mousedown":case"touchstart":i.start=y(c);n=(new Date).getTime();j=x(c);k=true;t=c;var d=a.getBoundingClientRect();var e=a.clientTop||document.body.clientTop||0;var o=a.clientLeft||document.body.clientLeft||0;var p=window.pageYOffset||a.scrollTop||document.body.scrollTop;var q=window.pageXOffset||a.scrollLeft||document.body.scrollLeft;r={top:d.top+p-e,left:d.left+q-o};s=true;G.hold(c);if(b.prevent_default){E(c)}break;case"mousemove":case"touchmove":if(!s){return false}u=c;i.move=y(c);if(!G.transform(c)){G.drag(c)}break;case"mouseup":case"mouseout":case"touchcancel":case"touchend":if(!s||l!="transform"&&c.touches&&c.touches.length>0){return false}s=false;v=c;G.swipe(c);if(l=="drag"){D("dragend",{originalEvent:c,direction:h,distance:f,angle:g})}else if(l=="transform"){D("transformend",{originalEvent:c,position:i.center,scale:B(i.start,i.move),rotation:C(i.start,i.move)})}else{G.tap(t)}m=l;D("release",{originalEvent:c,gesture:l});F();break}}function I(b){if(!J(a,b.relatedTarget)){H(b)}}function J(a,b){if(!b&&window.event&&window.event.toElement){b=window.event.toElement}if(a===b){return true}if(b){var c=b.parentNode;while(c!==null){if(c===a){return true}c=c.parentNode}}return false}function K(a,b){var c={};if(!b){return a}for(var d in a){if(d in b){c[d]=b[d]}else{c[d]=a[d]}}return c}function L(a){return Object.prototype.toString.call(a)=="[object Function]"}function M(a,b,c){b=b.split(" ");for(var d=0,e=b.length;d<e;d++){if(a.addEventListener){a.addEventListener(b[d],c,false)}else if(document.attachEvent){a.attachEvent("on"+b[d],c)}}}function N(a,b,c){b=b.split(" ");for(var d=0,e=b.length;d<e;d++){if(a.removeEventListener){a.removeEventListener(b[d],c,false)}else if(document.detachEvent){a.detachEvent("on"+b[d],c)}}}var d=this;var e={prevent_default:false,css_hacks:true,swipe:true,swipe_time:200,swipe_min_distance:20,drag:true,drag_vertical:true,drag_horizontal:true,drag_min_distance:20,transform:true,scale_treshold:.1,rotation_treshold:15,tap:true,tap_double:true,tap_max_interval:300,tap_max_distance:10,tap_double_distance:20,hold:true,hold_timeout:500};b=K(e,b);(function(){if(!b.css_hacks){return false}var c=["webkit","moz","ms","o",""];var d={userSelect:"none",touchCallout:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"};var e="";for(var f=0;f<c.length;f++){for(var g in d){e=g;if(c[f]){e=c[f]+e.substring(0,1).toUpperCase()+e.substring(1)}a.style[e]=d[g]}}})();var f=0;var g=0;var h=0;var i={};var j=0;var k=false;var l=null;var m=null;var n=null;var o={x:0,y:0};var p=null;var q=null;var r={};var s=false;var t;var u;var v;var w="ontouchstart"in window;this.option=function(a,d){if(d!=c){b[a]=d}return b[a]};this.getDirectionFromAngle=function(a){var b={down:a>=45&&a<135,left:a>=135||a<=-135,up:a<-45&&a>-135,right:a>=-45&&a<=45};var c,d;for(d in b){if(b[d]){c=d;break}}return c};this.destroy=function(){if(w){N(a,"touchstart touchmove touchend touchcancel",H)}else{N(a,"mouseup mousedown mousemove",H);N(a,"mouseout",I)}};var G={hold:function(a){if(b.hold){l="hold";clearTimeout(q);q=setTimeout(function(){if(l=="hold"){D("hold",{originalEvent:a,position:i.start})}},b.hold_timeout)}},swipe:function(a){if(!i.move){return}var c=i.move[0].x-i.start[0].x;var e=i.move[0].y-i.start[0].y;f=Math.sqrt(c*c+e*e);var j=(new Date).getTime();var k=j-n;if(b.swipe&&b.swipe_time>k&&f>b.swipe_min_distance){g=z(i.start[0],i.move[0]);h=d.getDirectionFromAngle(g);l="swipe";var m={x:i.move[0].x-r.left,y:i.move[0].y-r.top};var o={originalEvent:a,position:m,direction:h,distance:f,distanceX:c,distanceY:e,angle:g};D("swipe",o)}},drag:function(a){var c=i.move[0].x-i.start[0].x;var e=i.move[0].y-i.start[0].y;f=Math.sqrt(c*c+e*e);if(b.drag&&f>b.drag_min_distance||l=="drag"){g=z(i.start[0],i.move[0]);h=d.getDirectionFromAngle(g);var j=h=="up"||h=="down";if((j&&!b.drag_vertical||!j&&!b.drag_horizontal)&&f>b.drag_min_distance){return}l="drag";var m={x:i.move[0].x-r.left,y:i.move[0].y-r.top};var n={originalEvent:a,position:m,direction:h,distance:f,distanceX:c,distanceY:e,angle:g};if(k){D("dragstart",n);k=false}D("drag",n);E(a)}},transform:function(a){if(b.transform){if(x(a)!=2){return false}var c=C(i.start,i.move);var d=B(i.start,i.move);if(l!="drag"&&(l=="transform"||Math.abs(1-d)>b.scale_treshold||Math.abs(c)>b.rotation_treshold)){l="transform";i.center={x:(i.move[0].x+i.move[1].x)/2-r.left,y:(i.move[0].y+i.move[1].y)/2-r.top};var e={originalEvent:a,position:i.center,scale:d,rotation:c};if(k){D("transformstart",e);k=false}D("transform",e);E(a);return true}}return false},tap:function(a){var c=(new Date).getTime();var d=c-n;if(b.hold&&!(b.hold&&b.hold_timeout>d)){return}var e=function(){if(o&&b.tap_double&&m=="tap"&&n-p<b.tap_max_interval){var a=Math.abs(o[0].x-i.start[0].x);var c=Math.abs(o[0].y-i.start[0].y);return o&&i.start&&Math.max(a,c)<b.tap_double_distance}return false}();if(e){l="double_tap";p=null;D("doubletap",{originalEvent:a,position:i.start});E(a)}else{var g=i.move?Math.abs(i.move[0].x-i.start[0].x):0;var h=i.move?Math.abs(i.move[0].y-i.start[0].y):0;f=Math.max(g,h);if(f<b.tap_max_distance){l="tap";p=c;o=i.start;if(b.tap){D("tap",{originalEvent:a,position:i.start});E(a)}}}}};if(w){M(a,"touchstart touchmove touchend touchcancel",H)}else{M(a,"mouseup mousedown mousemove",H);M(a,"mouseout",I)}}

/*
 * Hammer.JS jQuery plugin
 * version 0.3
 * author: Eight Media
 * https://github.com/EightMedia/hammer.js
 */
jQuery.fn.hammer = function(options)
{
    return this.each(function()
    {
        var hammer = new Hammer(this, options);

        var $el = jQuery(this);
        $el.data("hammer", hammer);

        var events = ['hold','tap','doubletap','transformstart','transform','transformend','dragstart','drag','dragend','swipe','release'];

        for(var e=0; e<events.length; e++) {
            hammer['on'+ events[e]] = (function(el, eventName) {
                return function(ev) {
                    el.trigger(jQuery.Event(eventName, ev));
                };
            })($el, events[e]);
        }
    });
};

/*
* Cross browser Ellipsis
*/
(function ($) {
    $.fn.ellipsis = function () {
        return this.each(function () {
            var el = $(this);

            if (el.css("overflow") == "hidden") {
                var text = el.html();
                var multiline = el.hasClass('multiline');
                var t = $(this.cloneNode(true))
                .hide()
                .css('position', 'absolute')
                .css('overflow', 'visible')
                .width(multiline ? el.width() : 'auto')
                .height(multiline ? 'auto' : el.height());

                el.after(t);

                function height() { return t.height() > el.height(); };
                function width() { return t.width() > el.width(); };

                var func = multiline ? height : width;

                while (text.length > 0 && func()) {
                    text = text.substr(0, text.length - 1);
                    t.html(text + "...");
                }

                el.html(t.html());
                t.remove();
            }
        });
    };
})(jQuery);

// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license
(function(e){function t(e,t){return typeof e=="function"?e.call(t):e}function n(t,n){this.$element=e(t);this.options=n;this.enabled=true;this.fixTitle()}n.prototype={show:function(){var n=this.getTitle();if(n&&this.enabled){var r=this.tip();r.find(".tipsy-inner")[this.options.html?"html":"text"](n);r[0].className="tipsy";r.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).prependTo(document.body);var i=e.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight});var s=r[0].offsetWidth,o=r[0].offsetHeight,u=t(this.options.gravity,this.$element[0]);var a;switch(u.charAt(0)){case"n":a={top:i.top+i.height+this.options.offset,left:i.left+i.width/2-s/2};break;case"s":a={top:i.top-o-this.options.offset,left:i.left+i.width/2-s/2};break;case"e":a={top:i.top+i.height/2-o/2,left:i.left-s-this.options.offset};break;case"w":a={top:i.top+i.height/2-o/2,left:i.left+i.width+this.options.offset};break}if(u.length==2){if(u.charAt(1)=="w"){a.left=i.left+i.width/2-15}else{a.left=i.left+i.width/2-s+15}}r.css(a).addClass("tipsy-"+u);r.find(".tipsy-arrow")[0].className="tipsy-arrow tipsy-arrow-"+u.charAt(0);if(this.options.className){r.addClass(t(this.options.className,this.$element[0]))}if(this.options.fade){r.stop().css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:this.options.opacity})}else{r.css({visibility:"visible",opacity:this.options.opacity})}}},hide:function(){if(this.options.fade){this.tip().stop().fadeOut(function(){e(this).remove()})}else{this.tip().remove()}},fixTitle:function(){var e=this.$element;if(e.attr("title")||typeof e.attr("original-title")!="string"){e.attr("original-title",e.attr("title")||"").removeAttr("title")}},getTitle:function(){var e,t=this.$element,n=this.options;this.fixTitle();var e,n=this.options;if(typeof n.title=="string"){e=t.attr(n.title=="title"?"original-title":n.title)}else if(typeof n.title=="function"){e=n.title.call(t[0])}e=(""+e).replace(/(^\s*|\s*$)/,"");return e||n.fallback},tip:function(){if(!this.$tip){this.$tip=e('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>')}return this.$tip},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled}};e.fn.tipsy=function(t){function i(r){var i=e.data(r,"tipsy");if(!i){i=new n(r,e.fn.tipsy.elementOptions(r,t));e.data(r,"tipsy",i)}return i}function s(){var e=i(this);e.hoverState="in";if(t.delayIn==0){e.show()}else{e.fixTitle();setTimeout(function(){if(e.hoverState=="in")e.show()},t.delayIn)}}function o(){var e=i(this);e.hoverState="out";if(t.delayOut==0){e.hide()}else{setTimeout(function(){if(e.hoverState=="out")e.hide()},t.delayOut)}}if(t===true){return this.data("tipsy")}else if(typeof t=="string"){var r=this.data("tipsy");if(r)r[t]();return this}t=e.extend({},e.fn.tipsy.defaults,t);if(!t.live)this.each(function(){i(this)});if(t.trigger!="manual"){var u=t.live?"live":"bind",a=t.trigger=="hover"?"mouseenter":"focus",f=t.trigger=="hover"?"mouseleave":"blur";this[u](a,s)[u](f,o)}return this};e.fn.tipsy.defaults={className:null,delayIn:0,delayOut:0,fade:false,fallback:"",gravity:"n",html:false,live:false,offset:0,opacity:.8,title:"title",trigger:"hover"};e.fn.tipsy.elementOptions=function(t,n){return e.metadata?e.extend({},n,e(t).metadata()):n};e.fn.tipsy.autoNS=function(){return e(this).offset().top>e(document).scrollTop()+e(window).height()/2?"s":"n"};e.fn.tipsy.autoWE=function(){return e(this).offset().left>e(document).scrollLeft()+e(window).width()/2?"e":"w"};e.fn.tipsy.autoBounds=function(t,n){return function(){var r={ns:n[0],ew:n.length>1?n[1]:false},i=e(document).scrollTop()+t,s=e(document).scrollLeft()+t,o=e(this);if(o.offset().top<i)r.ns="n";if(o.offset().left<s)r.ew="w";if(e(window).width()+e(document).scrollLeft()-o.offset().left<t)r.ew="e";if(e(window).height()+e(document).scrollTop()-o.offset().top<t)r.ns="s";return r.ns+(r.ew?r.ew:"")}}})(jQuery);