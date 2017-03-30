(function ($) {

  /*!
   * jQuery-ajaxTransport-XDomainRequest - v1.0.2 - 2014-05-02
   * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
   * Copyright (c) 2014 Jason Moon (@JSONMOON)
   * Licensed MIT (/blob/master/LICENSE.txt)
   */
  (function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){if($.support.cors||!$.ajaxTransport||!window.XDomainRequest){return}var n=/^https?:\/\//i;var o=/^get|post$/i;var p=new RegExp('^'+location.protocol,'i');$.ajaxTransport('* text html xml json',function(j,k,l){if(!j.crossDomain||!j.async||!o.test(j.type)||!n.test(j.url)||!p.test(j.url)){return}var m=null;return{send:function(f,g){var h='';var i=(k.dataType||'').toLowerCase();m=new XDomainRequest();if(/^\d+$/.test(k.timeout)){m.timeout=k.timeout}m.ontimeout=function(){g(500,'timeout')};m.onload=function(){var a='Content-Length: '+m.responseText.length+'\r\nContent-Type: '+m.contentType;var b={code:200,message:'success'};var c={text:m.responseText};try{if(i==='html'||/text\/html/i.test(m.contentType)){c.html=m.responseText}else if(i==='json'||(i!=='text'&&/\/json/i.test(m.contentType))){try{c.json=$.parseJSON(m.responseText)}catch(e){b.code=500;b.message='parseerror'}}else if(i==='xml'||(i!=='text'&&/\/xml/i.test(m.contentType))){var d=new ActiveXObject('Microsoft.XMLDOM');d.async=false;try{d.loadXML(m.responseText)}catch(e){d=undefined}if(!d||!d.documentElement||d.getElementsByTagName('parsererror').length){b.code=500;b.message='parseerror';throw'Invalid XML: '+m.responseText;}c.xml=d}}catch(parseMessage){throw parseMessage;}finally{g(b.code,b.message,c,a)}};m.onprogress=function(){};m.onerror=function(){g(500,'error',{text:m.responseText})};if(k.data){h=($.type(k.data)==='string')?k.data:$.param(k.data)}m.open(j.type,j.url);m.send(h)},abort:function(){if(m){m.abort()}}}})}));


  // Initialize navbar
    $(document).ready(function () {
    CU_navbar.initialize();
    notifications_infiniteLoader.initialize();
  });

  var CU_navbar = {
    resizeTimeout: null,
    viewportWidth: null,

    breakpoints: [],

    initialize: function () {
      // Handle menu click
      $('#cu_nav').find('.menu').on('click', function (e) {
        var $menu = $(e.target).parents('.menu');

        // Show menu if not yet expanded
        if (!$menu.hasClass('expanded')) {
          CU_navbar.showMenu($menu);

          e.preventDefault();

          return false;
        }

        // Collapse menu
        CU_navbar.hideMenu($menu);

        if ($(e.target).parents('li').hasClass('selected') && e.type !== 'click') {
          // Ignore if already selected unless click
          e.preventDefault();

          return false;
        }

        // Rotate Select Element
        $(e.target).parent('li').addClass('selected').siblings().removeClass('selected');

        //
        // Do action
        //

        // show loading icon
        $(e.target).parent('li').addClass('loading');

        setTimeout(function () {
          window.location.href = $(e.target).attr('href');
        }, 100);

        e.preventDefault();

        return false;
      });

      $('#cu_nav').find('.expandable').on('click', function (e) {
        $(e.target).parent('.expandable').toggleClass('expanded');
      });

      // Load initial stories on click
      $('#cu_nav').find('.updates.expandable').on('click', function () {
        if (notifications_infiniteLoader.loadedObjects === 0) {
          notifications_infiniteLoader.getPosts();
        }
      });

      // // Mouse Hover FX
      $('#cu_nav').find('.menu').lazybind('mouseenter', function (e) {
        CU_navbar.showMenu($(e.target).parents('.menu'));
      }, 200, 'mouseleave');

      // // Mouse Hover FX
      $('#cu_nav').find('.menu').lazybind('mouseleave', function (e) {
        CU_navbar.hideMenu($(e.target).parents('.menu'));
      }, 200, 'mousemove');

      // Bind show login
      $('#actions').find('.login').on('click', function (e) {
        $('#cu_nav').toggleClass('show-login');
        // $(CU_user.login_form).find('.username').val('CU Username');
        // $(CU_user.login_form).find('.password').val('Password');

        $('#cu_nav').find('.cu_display_name').find('.avatar').toggleClass('hidden');

        e.preventDefault();

        return false;
      });

      if (window.addEventListener) {
        // window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', CU_navbar.resizer, false);
      } else if (window.attachEvent) {
        // window.attachEvent('onscroll', scroller);
        window.attachEvent('onresize', CU_navbar.resizer);
      }

      CU_navbar.setBreakPoints();
      CU_navbar.adjustLayout();
    }, // end initialize

    showMenu: function (menu) {
      // This line fixes a bug when hover mouse between adjacent menus.
      menu.siblings().removeClass('expanded').find('li').css({
        'width': '',
        'position': '',
        'top': ''
      });

      var width = menu.outerWidth();

      menu.css({
        'width': width,
        'overflow': 'visible'
      }).find('.selected').css({
        'width': width,
        'position': 'absolute',
        'top': '0'
      }); // set because of CSS position rules

      menu.addClass('expanded');
    },

    hideMenu: function (menu) {
      menu.removeClass('expanded');

      setTimeout(function () {
        menu.find('li').css({
          'width': '',
          'position': '',
          'top': ''
        });

        menu.css({
          'width': '',
          'overflow': ''
        });
      }, 300, menu);
    },

    setBreakPoints: function () {
      // Get data from DOM
      var $cu_nav = $('#cu_nav');

      // expand all items
      $('#cu_nav').find('.menu').removeClass('compressed');

      // Measure for max width
      var
      w_domain = $cu_nav.find('#domain').outerWidth(),
      w_breadcrumb = $cu_nav.find('#breadcrumb').outerWidth(),
      w_actions = $cu_nav.find('#actions').outerWidth(),

      w_extra = -100, // account for expandables
      w_compressed = 50; // the size of a compressed area

      // console.log(w_domain + ' + ' + w_breadcrumb + ' + ' + w_actions + ' + ' + w_extra);

      CU_navbar.breakpoints[0] = w_domain + w_breadcrumb + w_actions + w_extra; // full expanded
      CU_navbar.breakpoints[1] = w_compressed + w_breadcrumb + w_actions + w_extra; // 1st collapse
      CU_navbar.breakpoints[2] = w_compressed + w_compressed + w_actions + w_extra; // 2nd collapse

      // Set break points

      // CU_navbar.maxSize.left.domain    = $cu_nav.find('#domain').outerWidth();
      // CU_navbar.maxSize.left.breadcrumb  = $cu_nav.find('#breadcrumb').outerWidth();
      // CU_navbar.maxSize.right.actions  = $cu_nav.find('#actions').outerWidth();
    },

    resizer: function () {
      if (CU_navbar.resizeTimeout !== null) {
        clearTimeout(CU_navbar.resizeTimeout);
      }
      CU_navbar.resizeTimeout = setTimeout(function () {
        CU_navbar.resizeTimeout = null;

        CU_navbar.adjustLayout();
      }, 10);
    }, // end resizer

    adjustLayout: function () {
      var
      viewportWidth = document.documentElement.clientWidth,
      $cu_nav = $('#cu_nav');

      // Get data from DOM

      // console.log(CU_navbar.breakpoints[2]);

      if (viewportWidth > CU_navbar.breakpoints[0]) {
        // expand all
        $('.menu').removeClass('compressed');

      } else if (viewportWidth > CU_navbar.breakpoints[1]) {
        // collapse 1
        $('#domain').addClass('compressed');
        $('#breadcrumb').removeClass('compressed');
      } else if (viewportWidth > CU_navbar.breakpoints[2]) {
        // collapse 2
        $('#breadcrumb').addClass('compressed');
        $('#domain').addClass('compressed');
      } else {
        // collapse all!!
        $cu_nav.find('#breadcrumb').addClass('compressed');
        $cu_nav.find('#domain').addClass('compressed');
      }

      // Store new widths
      // CU_navbar.viewportWidth = viewportWidth;
      // CU_navbar.currentSize.left.domain    = w_domain;
      // CU_navbar.currentSize.left.breadcrumb  = w_breadcrumb;
      // CU_navbar.currentSize.right.actions  = w_actions;
    }

  }; // end CU_navbar

  // Define Lazybind
  $.fn.lazybind = function (event, fn, timeout, abort) {
    var timer = null;

    $(this).bind(event, function (e) {
      timer = setTimeout(function () {
        fn(e);
      }, timeout);
    });

    if (abort === undefined) {
      return;
    }

    $(this).bind(abort, function () {
      if (timer !== null) {
        clearTimeout(timer);
      }
    });
  };

  /* Infinite loader for updates
  /* ========================================================================== */

  var
  notifications_infiniteLoader = {
    date: new Date(),
    lastTime: 0,
    running: false,
    loadedObjects: 0,
    windowHeight: $(window).height(),
    documentHeight: $(window).height(),

    initialize: function () {
      notifications_infiniteLoader.loadedObjects = $('#cu_latest_posts').find('.story').length;

      $('#cu_latest_posts').find('.loadMore').on('click', function () {
        notifications_infiniteLoader.getPosts();
      });

    },

    stop: function () {
      if (!this.running) {
        return false;
      }

      this.running = false;

      $('#cu_latest_posts').find('.loadMore').hide();
    }, // end stop

    getPosts: function () {
      var
      time_now = Math.round(new Date().getTime() / 1000),
      hour_block = time_now - (time_now % 3600);

      // Execute the AJAX call
      jQuery.ajax({
        type: 'get',
        url: 'https://inside.chapman.edu/ajax',
        crossDomain: true,
        data: {
          content: 'story_mini',
          format: 'html',
          orderby: 'timestamp',
          limit: 4,
          offset: notifications_infiniteLoader.loadedObjects,
          _noCache: hour_block
        },
        dataType: 'html',
        success: function (data) {
          if ($(data).length > 0) {
            $('#cu_latest_posts').find('.footer').before($(data).hide().fadeIn());

            $('#cu_latest_posts').animate({
              scrollTop: $('#cu_latest_posts')[0].scrollHeight
            }, 500);

            notifications_infiniteLoader.loadedObjects = $('#cu_latest_posts').find('.story').length;
          } else {
            console.log('No data returned. Stopping');
            console.log(data);

            notifications_infiniteLoader.stop();
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log('An error occured.');

          console.log(XMLHttpRequest);
          console.log(textStatus);
          console.log(errorThrown);

          notifications_infiniteLoader.stop();
        }
      }); // end ajax
    }
  };
})(jQuery);
