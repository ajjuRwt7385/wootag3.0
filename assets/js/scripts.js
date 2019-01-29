
// Get the header
var header = document.getElementById("wt-header");

if (header) {
  // When the user scrolls the page, execute stickyNavFunc 
  window.onscroll = function() {stickyNavFunc()};
  // Get the offset position of the navbar
  var sticky = header.offsetTop;

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function stickyNavFunc() {
    if (window.pageYOffset > sticky) {
      header.classList.add("hasScrolled");
    } else {
      header.classList.remove("hasScrolled");
    }

    if (videoSection && categoryFilter) {
      stickyFilter(videoSection.offsetTop);
    }
  }
  // for explore page category filters---
  var videoSection = document.getElementById("explore-videos");
  var categoryFilter = document.getElementById("categoryFilter");
  function stickyFilter(stickyExplore) {
    if (window.pageYOffset > stickyExplore) {
      categoryFilter.classList.add("hasScrolled");
    } else {
      categoryFilter.classList.remove("hasScrolled");
    }
  }
}

// utils- hostname---
var host = window.location.hostname === 'localhost' ? 'wtstaging.wootag.com' : window.location.hostname;
var domain = `https://${host}`;
function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function urlParam(variable){
  try{
      var q = location.search.substring(1),
          v = q.split("&"),
          p, str, n;
      for( var i = 0; i < v.length; i++ ){
          p = v[i].split("=");
          if( p[0] == variable ){
              return p[1] && decodeURIComponent(p[1]);
          }
      }
  }
  catch (e){
      console.log(e);
  }
}
//---
$(document).on('ready', function() {
  // Responsive mobile navigation toggle---
  $('.mobile-menu-btn').on('click', function(){
    if($(this).hasClass('isOpen')) {
      $(this).removeClass('isOpen');
      $('header').removeClass('mobile-active');
      if ($('header').hasClass('subnav-active')) {
        $('header').removeClass('subnav-active');
      }
    }else {
      $(this).addClass('isOpen');
      $('header').addClass('mobile-active');
    }
  });
  $('#nav-why-wootag').on('click', function(e){
    e.preventDefault();
    if($('.navbar-dropdown').hasClass('active')) {
      $('.navbar-dropdown').removeClass('active');
      $(this).find('i').text('arrow_drop_down');
      $('header').removeClass('subnav-active');
    }else {
      $('.navbar-dropdown').addClass('active');
      $(this).find('i').text('arrow_drop_up');
      $('header').addClass('subnav-active');
    }
    $('.navbar-dropdown').slideToggle(200);
  });
  // Logo slider for home and explore page---
  $('.slider-client-logos').slick({
    autoplay: true,
    infinite: true,
    arrows: false,
    // variableWidth: true,
    autoplaySpeed: 5000,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [      
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  });
  
  //------------------------------------------------------------------------------------------------
  // AOS (Animation On Scroll)---
  AOS.init();
  //------------------------------------------------------------------------------------------------

  // Sit back slider---
  $('.slider-sitback_interact').slick({
    infinite: false,
    arrows: true,
    nextArrow:$('.slide-next-button'),
    prevArrow:$('.slide-prev-button'),
  });

  // Platform smooth scroll to section from footer links---
  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            if ($target.attr('id') === 'enterprise-form') {
              $target.find('input#contact_name').focus();
            }
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again            
          };
          
          if ($target.attr('id') === 'enterprise-form') {
            $target.find('input#contact_name').focus();
          }
        });
      }
    }
  });


  const APP = {
    api_login_url: domain + '/api/login',
    asset_prefix: domain,
    api_registration_url: domain + '/api/v1/registration',
    api_categories_url: domain + '/api/categories',
    api_contact_url: domain + '/api/contact'
  };

  var $form = $("#contact-form");
  if($form) {
    $form.submit(function (e) {

      // var $button = $form.find('.js-submit');
      $form.find('.thanks-msg').removeClass('hide');
      $.ajax({
        type: "POST",
        url: APP.api_contact_url,
        crossDomain: true,
        cache: false,
        dataType: 'JSON',
        timeout: 6000,
        data: $form.serialize(),
  
        success: function success(data) {
            // cleaning the error message
            $('.form__feedback', $form).empty();
            $('.has-error').removeClass('has-error');
  
            console.log(data);
  
            if (!data.success) {
              $form.find('.thanks-msg').addClass('hide');
              $.each(data.errors, function (key, error) {
                  $("input[name='" + key + "']", $form).addClass('has-error');
              });
            } else {
              $form.find('.thanks-msg').removeClass('hide').find('> h1').text(data.message);
            }
        },
  
        error: function error(jqXHR, textStatus, errorThrown) {
            console.log("API error: " + textStatus + " - " + errorThrown.message);
            $(".form__feedback", $form).empty().append("API error: " + textStatus + " - " + errorThrown.message);
        }
      });
      e.preventDefault();
    });
  }
  
  // Page wise events---
  var currentPage = $('body').data('page');
  console.log('currentPage', currentPage);
  switch(currentPage) {
    case 'signin': {
      var $form = $( "#login-form" ),
            $inputs = $('#login-form :input');

          $form.submit( function(e) {
              var values = {};
              $inputs.each(function() {
                if (this.name) values[this.name] = $(this).val();
              });

              var $errorDiv = $( '.form__error', $form );
              console.log(values);
              var loginRequest = $.ajax({
                  type: "POST",
                  url: APP.api_login_url,
                  crossDomain:true,
                  cache: false,
                  dataType: 'json',
                  contentType: 'application/json',
                  timeout: 5000,
                  data: JSON.stringify(values) //$form.serialize()
                });

                loginRequest.done( function( data ) {

                    // console.log(data);

                    // cleaning the error message
                    $errorDiv.empty();
                    // $('.has-error').removeClass('has-error');


                    if ( !data.data.token) {
                        $.each( data.code, function( key, error ) {
                          $errorDiv.append( '<li>' + error );
                        });
                    } else {
                        if (data.data.token) {
                          var expires = "";
                          var name = "wootag-access-token";
                          var value = data.data.token;
                          var rtName = "wootag-access-refresh_token";
                          var rtValue = data.data.refresh_token || '';
                          document.cookie = name + "=" + value + expires + ";path=/";
                          document.cookie = rtName + "=" + rtValue + expires + ";path=/";

                          if (data.redirect) {
                            window.location = APP.asset_prefix + data.redirect;
                          } else {
                            window.location = APP.asset_prefix + '/apps/authenticate?token='+value+'&refresh_token='+rtValue;
                          }                                
                        }
                    }
                });

                loginRequest.fail( function(jqXHR, textStatus) {
                  var data = (jqXHR.responseText) ? JSON.parse(jqXHR.responseText) : null;
                  console.log("API status: " + jqXHR.status + "-" + textStatus + " from " + APP.api_login_url);
                  if(422===jqXHR.status && data) {
                    // $( '.form__error', $form ).empty();
                    $errorDiv.empty().append( "<li>" + data.description);
                  }
                });

                e.preventDefault();

          });

      break;
    }
    case 'signup': {
      var $form = $( "#signup-form" ),
      $inputs = $('#signup-form :input');

      var $emailField = $form.find('input[type=email]');
      var email = urlParam('email');
      email && $emailField && ($emailField.val(email));

      $form.submit( function(e) {
        var values = {};
        $inputs.each(function() {
          if (this.name) values[this.name] = $(this).val();
        });
        var $errorDiv = $( '.form__error', $form );
        // cleaning the error message
        $errorDiv.empty();
        console.log(values);
        var signupRequest = $.ajax({
            type: "POST",
            url: APP.api_registration_url,
            crossDomain:true,
            cache: false,
            dataType: 'json',
            contentType: 'application/json',
            timeout: 5000,
            data: JSON.stringify(values) //$form.serialize()
          });

          signupRequest.done( function( data ) {

              // console.log(data);
              if ( data.data.description) {
                  
                  $.each( data.code, function( key, error ) {
                    $errorDiv.append( '<li>' + error );
                  });
              }
          });

          signupRequest.fail( function(jqXHR, textStatus) {
            var data = (jqXHR.responseText) ? JSON.parse(jqXHR.responseText) : null;
            console.log("API status: " + jqXHR.status + "-" + textStatus + " from " + APP.api_registration_url);
            if(422===jqXHR.status && data) {
              // $( '.form__error', $form ).empty();
              $errorDiv.empty().append( "<li>" + data.description);
            }
          });

          e.preventDefault();

      });
      break;
    }
    case 'explore': {
      var allVideoItems = [];
      // fetch video items---
      $.ajax({url: domain+"/api/videos?category=", success: function(result){
        allVideoItems = result.items;
        handleExploreHash(location.hash || '#!/all');        
      }});

      // fetch video categories to set filter buttons on UI---
      $.getJSON(APP.api_categories_url, function (data) {
        console.log(data);
        if(data && data.length) {
          processCategories(data);
        }
      });

      function processCategories(arr) {
        $('<li />', {
          class: 'all',
          'data-category': 'all',
          html: '<a href="#!/all">All</a>'
        }).appendTo('.categories ul');
        for (var i = 0; i< arr.length; i++) {
          $('<li />', {
            class: arr[i].slug,
            'data-category': arr[i].slug,
            html: '<a href="#!/'+arr[i].slug+'">'+ arr[i].name +'</a>'
          }).appendTo('.categories ul');
        }       
        
        handleExploreHash(location.hash || '#!/all');
      }

      // hash change events which get triggered through filter button clicks---
      window.onhashchange = function(){
        var hash = location && location.hash;
        if (hash) {
          handleExploreHash(hash);
        }
      }
      
      // event handler and filter setter for the videos as per category---
      function handleExploreHash(hash) {
        var category = hash.split('#!/')[1] || 'all';
        // selected state for the hash item---
        $('.categories ul>li').each(function(){
          if($(this).find('>a').hasClass('selected')) {
            $(this).find('>a').removeClass('selected');
          }
          if($(this).find('>a').prop('href').indexOf(category) !== -1) {
            $(this).find('>a').addClass('selected');
          }          
        });          

        var items = category === 'all' ? allVideoItems : allVideoItems.filter(item => item.category === category);
        // console.log('item', items);
        if($('#explore_video_items').length) {
          $('#explore_video_items').empty();
          items.forEach((item, idx) => {
              var hostName = item.wootag_url && extractHostname(item.wootag_url);
              var videoUrl = hostName && '//'+hostName+'/embed/'+item.playback_id;
              if(idx % 8 === 0) {
                $('#explore_video_items').append('<div class="row hide" data-rowId="'+ (idx / 8) +'" data-aos="fade-in"></div>');
              }
              var fadeEffect = idx % 2 === 0 ? 'fade-right' : 'fade-left';
              $('#explore_video_items > .row:last-child').append('<div class="col-sm-12 col-md-6 video_item" data-aos="'+ fadeEffect +'"><a href="#" data-href="'+videoUrl+'" data-type="overlay-iframe"><div class="img"><img src="'+item.img+'" alt="'+item.title+'" /><div class="overlay"><div class="button-circular"><i class="material-icons">play_arrow</i></div><div class="detail"><div class="title">'+item.title+'</div><div class="category">'+item.category+'</div></div></div></div></a></div>');
          });

          var numOfLastRowInView = 0;
          $('#explore_video_items > .row:first-child').removeClass('hide');
          function checkShowMoreVisiblity() {
            var showViewMoreButton = $('#explore_video_items > .row:last-child').hasClass('hide');
            if (showViewMoreButton) {
              $('.view-more-videos').removeClass('hide');
            } else {
              $('.view-more-videos').addClass('hide');
            }
            AOS.init();
          }
          checkShowMoreVisiblity();
          $('.view-more-videos a').on('click', function(e){
            e.preventDefault();
            numOfLastRowInView++;
            $('#explore_video_items > .row:nth-child('+ (numOfLastRowInView + 1) +')').removeClass('hide');
            checkShowMoreVisiblity();
          })
        }        
        // item click event to show iframe video in overlay---
        $('.video_item a').on('click', function(e){
          e.preventDefault();
          var videoUrl = $(this).data('href');
          showOverlay({ type: 'iframe', href: videoUrl });
        });
      }   
      
      break;
    }
    case 'home' : {
      $('a.go-beyond-views-link').on('click', function(e){
        e.preventDefault();
        var videoUrl = $(this).data('href');
        showOverlay({ type: 'iframe', href: videoUrl });
      });

      // Fake Home Demo Player data---
      // removing storelocator tag for mobiles---
      if(window.innerWidth < 768) {
        $('.home-fake-player-details >.detail:nth-child(2)').addClass('hide-on-small');
      } else {
        $('.home-fake-player-details >.detail:nth-child(2)').removeClass('hide-on-small');
      }
      // valid detail tags to show in demo---
      var validDetails = $('.home-fake-player-details').find('>.detail:not(.hide-on-small)');
      var tagsLength = validDetails.length;

      // creating dots on the timeline---
      for (var i = 0 ; i< tagsLength; i++) {
        $('<div/>', {
          id: 'dot' + i,
          class: 'dot',
          style: 'left: '+ ((i + 1) * 30) + '%',
        }).appendTo('.home-demo .dots');
      }

      // starting demo animation---
      function playDemoPlayerAnimation() {
        $('#home-demo-video').get(0).currentTime = 0;
        $('#home-demo-video').get(0).play();
        

        if(!$('.home-demo .tag-preview').hasClass('disapper')){
          $('.home-demo .tag-preview').addClass('disapper');
        }
        $('.home-demo .click-simulate, .home-demo .details').removeClass('active');
        $('.home-fake-player-details >.detail').removeClass('appear disappear-right');
        
        $('.home-demo .progress').addClass('start');

        clearTimeout(theTimeout);
        var theTimeout = setTimeout(function(){
          // tag preview appears---
          $('.home-demo .tag-preview').removeClass('disapper');
          
          // tag click simulation delay added through css---
          $('.home-demo .click-simulate').addClass('active');

          // as for mobiles we just have 2 tags instead of 3 we are looping through the tagLength for showing the right number of tag detail---
          for(var j = 0; j<tagsLength; j++){
            (function(j){
              // default duration is 2s per details---
              var timeoutDuration = 2000 * (j+1);
              
              theTimeout = setTimeout(function(){
                if (j === 0) {
                  // activating the details black overlay background for mobiles---
                  $('.home-demo .details').addClass('active');
                  
                  // resetting the progress to 20% for next loop as now it is not in view---
                  if($('.home-demo .progress').hasClass('start')){
                    $('.home-demo .progress').removeClass('start');
                  }
                  // resetting the video to start position as now it is not in view---
                  $('#home-demo-video').get(0).currentTime = 0;
                } else {
                  // swiping out the current showing tag detail---
                  validDetails.eq(j-1).addClass('disappear-right');
                }
                // showing the next tag detail---
                validDetails.eq(j).addClass('appear');

                // restart loop---
                if (j === tagsLength - 1){
                  theTimeout = setTimeout(playDemoPlayerAnimation, 10000);
                }
              }, timeoutDuration);
            })(j);
          }
        }, 1800);
        
      }
      // initializing demo animation---
      document.getElementById('home-demo-video').addEventListener('loadeddata', function() {
        // Video is loaded and can be played
        playDemoPlayerAnimation();
      }, false);
      playDemoPlayerAnimation();
      
      break;
    }
    case 'platform_tour': {
      // Platform Tour Interactivity slider---
      $('.slider-platform-interactivity').slick({
        infinite: false,
        arrows: true,
        slidesToShow: 8,
        slidesToScroll: 8,
        nextArrow:$('.interactivity-slide-next-button'),
        prevArrow:$('.interactivity-slide-prev-button'),
        responsive: [      
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }
        ]
      }).on('breakpoint', function(){
        if(!$('.slider-platform-interactivity .magic-line').length){
          $('<div />', {
            class: 'magic-line'
          }).appendTo('.slider-platform-interactivity .slick-track');
          $('.slide-platform-interactivity.selected').closest('.slick-slide').click();
        }
      });
      $('<div />', {
        class: 'magic-line'
      }).appendTo('.slider-platform-interactivity .slick-track');
      var selectedObjectiveIndex = 0;
      $('.slider-platform-interactivity').on('click touch', '.slick-slide', function() {
        var selfIndex = $(this).data('slickIndex');
        $(this).siblings('.slick-slide').find('.slide-platform-interactivity').removeClass('selected');
        $(this).find('.slide-platform-interactivity').addClass('selected');
        $(this).siblings('.slick-slide').removeClass('selected-slide');
        $(this).addClass('selected-slide');

        //magic line---
        var $magicLine = $('.slider-platform-interactivity .magic-line');
        $el = $(this);
        leftPos = $el.position().left + 20;
        newWidth = $el.width() - 40;
        $magicLine.stop().animate({
            left: leftPos,
            width: newWidth
        }, 200);
        //select item details---
        $('.platform-interactivity .interactivity-item-detail').each(function(){
          var slideDataIndex = $(this).data('index');
          if (slideDataIndex === selfIndex) {
            $(this).addClass('visible');
          } else {
            $(this).removeClass('visible');
          }
        });
        // show detail---
        showPlatformDemoDetail(selfIndex);
      });
      //init platform slider---
      // $('.slider-platform-interactivity .slick-slide:first-child').click();


      // Fake Platform Demo Player data---
      // removing storelocator tag for mobiles---
      // valid detail tags to show in demo---
      var validDetails = $('.platform-fake-player-details').find('>.detail');
      var tagsLength = validDetails.length;

      function showPlatformDemoDetail(j){
        validDetails.each(function(){
          if($(this).hasClass('appear-fade')){
            $(this).removeClass('appear-fade');
          }
          if($(this).hasClass('disappear-fade')){
            $(this).removeClass('disappear-fade');
          }
        });
        if(selectedObjectiveIndex !== j){
          validDetails.eq(selectedObjectiveIndex).addClass('disappear-fade');
        }
                
        // showing the next tag detail---
        validDetails.eq(j).addClass('appear-fade');    
        selectedObjectiveIndex = j;     
      }

      // creating dot on the timeline, need only one for platform demo---
      $('<div/>', {
        id: 'dot0',
        class: 'dot',
        style: 'left: 30%',
      }).appendTo('.platform-demo .dots');

      // starting demo animation---
      function playDemoPlayerAnimation() {
        $('#platform-demo-video').get(0).currentTime = 0;
        var media = document.getElementById("platform-demo-video");
        var playPromise = media.play();
        if (playPromise !== null){
            playPromise.catch(() => { media.play(); })
        }
        // $('#platform-demo-video').get(0).play();
        

        if(!$('.platform-demo .tag-preview').hasClass('disapper')){
          $('.platform-demo .tag-preview').addClass('disapper');
        }
        $('.platform-demo .click-simulate, .platform-demo .details').removeClass('active');
        $('.platform-fake-player-details >.detail').removeClass('appear disappear-right');
        
        $('.platform-demo .progress').addClass('start');

        clearTimeout(theTimeout);
        var theTimeout = setTimeout(function(){
          // tag preview appears---
          $('.platform-demo .tag-preview').removeClass('disapper');
          
          // tag click simulation delay added through css---
          $('.platform-demo .click-simulate').addClass('active');
            
          // showing first detail in 2s---
          var timeoutDuration = 2000;
          
          theTimeout = setTimeout(function(){
            // activating the details black overlay background for mobiles---
            $('.platform-demo .details').addClass('active');
            
            // resetting the progress to 20% for next loop as now it is not in view---
            if($('.platform-demo .progress').hasClass('start')){
              $('.platform-demo .progress').removeClass('start');
            }
            // resetting the video to start position as now it is not in view---
            $('#platform-demo-video').get(0).currentTime = 0;

            // trigger first detail item click to show it---
            $('.slider-platform-interactivity .slick-slide:nth-child('+(selectedObjectiveIndex + 1)+')').click();
          }, timeoutDuration);

        }, 1800);
        
      }
      // initializing demo animation---
      playDemoPlayerAnimation();

      break;
    }
    default: {
      return;
    }
  }
  
  // closing overlay event for all pages--
  function showOverlay(data) {
    var type = data && data.type;
    if(type === 'iframe') {      
      var videoUrl = data.href;
      $('.overlay-lightbox iframe').attr('src', videoUrl+'?autoplay=1');
      $('.overlay-lightbox').addClass('visible');
      $('body').addClass('no-scroll');
    }
  }
  function closeOverlay() {
    $('.overlay-lightbox iframe').attr('src', '');
    $('.overlay-lightbox').removeClass('visible');
    $('body').removeClass('no-scroll');
  }
  $('.overlay-lightbox .button-close').on('click', function(e) {
    e.preventDefault();
    closeOverlay();
  });

  
  // key events--
  $(document).keyup(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
      if($('.overlay-lightbox').length && $('.overlay-lightbox').hasClass('visible')) {
        closeOverlay();
      }
    }
  });

});


