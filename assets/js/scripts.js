
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
  $('header .overlay-subnav').on('click', function(e){
    $('#nav-why-wootag').click();
  });
  // Logo slider for home and explore page---
  $('.slider-client-logos').slick({
    autoplay: false,
    infinite: true,
    arrows: false,
    // variableWidth: true,
    autoplaySpeed: 5000,
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [      
      {
        breakpoint: 992,
        settings: {
          autoplay: false,
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 680,
        settings: {
          autoplay: true,
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 480,
        settings: {
          autoplay: true,
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
    api_contact_url: domain + '/api/contact',
    api_pricing_url: domain + '/api/v1/pricingsubscription',
    api_newsletter_subscribe_request_url: domain + '/api/sitenewsletter/subscribe'
  };

  var $forms = $(".contact-form form");
  if($forms.length) {
    $forms.each(function(idx){
      var $form = $forms.eq(idx);
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

              console.log(data);
              if ( data.data.description) {
                  
                  $.each( data.code, function( key, error ) {
                    $errorDiv.append( '<li>' + error );
                  });
              }
              if (data.data.token) {
                var expires = "";
                var name = "wootag-access-token";
                var value = data.data.token;
                var rtName = "wootag-access-refresh_token";
                var rtValue = data.data.refresh_token || '';
                document.cookie = name + "=" + value + expires + ";path=/";
                document.cookie = rtName + "=" + rtValue + expires + ";path=/";

                if (data.data.redirect_page) {
                  window.location = domain + data.data.redirect_page;
                } else {
                  window.location = domain + '/apps/authenticate?token='+value+'&refresh_token='+rtValue;
                }                                
              } else if (data.data.redirect_page) window.location = domain + data.data.redirect_page;
          });

          signupRequest.fail( function(jqXHR, textStatus, errorThrown) {
            console.log('jqXHR', jqXHR, 'textStatus', textStatus, 'errorThrown', errorThrown);
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
      var options = {view_count: "", video_count: ""};
      // fetch video items---
      $.ajax({url: domain+"/api/videos?category=", success: function(result){
        allVideoItems = result.items;
        if (result.options && result.options.view_count) {
          options.view_count = result.options.view_count;
        }
        if (result.options && result.options.video_count) {
          options.video_count = result.options.video_count;
        }
        if(options.view_count && options.video_count) {
          setViewVideoCount(options);
        }

        $('.explore_title').addClass('visible');
        handleExploreHash(location.hash || '#!/all');        
      }});

      // fetch video categories to set filter buttons on UI---
      $.getJSON(APP.api_categories_url, function (data) {
        if(data && data.length) {
          processCategories(data);
        }
      });

      // count animation---
      // $('.count').each(function () {
      //   $(this).prop('Counter',0).animate({
      //       Counter: $(this).text()
      //   }, {
      //       duration: 1000,
      //       easing: 'swing',
      //       step: function (now) {
      //           $(this).text(Math.ceil(now));
      //       }
      //   });
      // });

      function setViewVideoCount(options) {
        $('.view_count').text(options.view_count);
        $('.video_count').text(options.video_count);
      }
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
        function str_pad_left(string,pad,length) {
          return (new Array(length+1).join(pad)+string).slice(-length);
        }
        function fomratSecondsToMMSS(_sec) {
          var hours = Math.floor(_sec / 3600);
          var minutes = Math.floor(_sec / 60);
          var seconds = _sec % 60;
          if (hours) {
            minutes = Math.floor((_sec - (hours * 3600)) / 60);
            seconds = _sec - (hours * 3600) - (minutes * 60);
            return str_pad_left(hours,'0',1)+':'+str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
          }
          // return minutes +':'+ seconds;
          return str_pad_left(minutes,'0',1)+':'+str_pad_left(seconds,'0',2);
        }
        if($('#explore_video_items').length) {
          $('#explore_video_items').empty();
          items.forEach((item, idx) => {
              var hostName = item.wootag_url && extractHostname(item.wootag_url);
              var videoUrl = hostName && '//'+hostName+'/embed/'+item.playback_id;
              if(idx % 8 === 0) {
                $('#explore_video_items').append('<div class="row hide" data-rowId="'+ (idx / 8) +'" data-aos="fade-in"></div>');
              }
              var fadeEffect = idx % 2 === 0 ? 'fade-right' : 'fade-left';
              $('#explore_video_items > .row:last-child').append('<div class="col-sm-12 col-md-6 video_item" data-aos="'+ fadeEffect +'"><a href="#" data-href="'+videoUrl+'" data-type="overlay-iframe"><div class="img"><img src="'+item.img+'" alt="'+item.title+'" /><div class="overlay"><div class="button-circular button--pulsate"><i class="material-icons">play_arrow</i></div><div class="detail"><div class="title">'+item.title+'</div><div class="category">'+fomratSecondsToMMSS(item.video_duration) +' | '+ item.category_name+'</div></div></div></div></a></div>');
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
        $('.home-fake-player-details >.detail:nth-child(3)').addClass('hide-on-small');
      } else {
        $('.home-fake-player-details >.detail:nth-child(3)').removeClass('hide-on-small');
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
              // default duration is 4s per details---
              var timeoutDuration = 4000 * (j+1);
              if (j === 0){
                timeoutDuration = 2000;
              }
              
              theTimeout = setTimeout(function(){
                if (j === 0) {
                  $('#home-demo-video').get(0).pause();
                  // activating the details black overlay background for mobiles---
                  $('.home-demo .details').addClass('active');
                  
                  // resetting the progress to 20% for next loop as now it is not in view---
                  if($('.home-demo .progress').hasClass('start')){
                    $('.home-demo .progress').removeClass('start');
                  }
                  // resetting the video to start position as now it is not in view---
                  // $('#home-demo-video').get(0).currentTime = 0;
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
        focusOnSelect: true,
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
        // auto animate---
        $('.autoProgressBar').width('0%').stop().animate({
          width: '100%'
        }, 6000, 'linear', function() {
          var indexToClick = selectedObjectiveIndex;
          if (indexToClick >= $('.platform-interactivity .interactivity-item-detail').length - 1 ) {
            indexToClick = 0;
          } else {
            indexToClick++;
          }
          $('.slider-platform-interactivity .slick-slide:nth-child('+(indexToClick + 1)+')').click();
        });
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
            $('#platform-demo-video').get(0).pause();
            // activating the details black overlay background for mobiles---
            $('.platform-demo .details').addClass('active');
            
            // resetting the progress to 20% for next loop as now it is not in view---
            if($('.platform-demo .progress').hasClass('start')){
              $('.platform-demo .progress').removeClass('start');
            }
            // resetting the video to start position as now it is not in view---
            // $('#platform-demo-video').get(0).currentTime = 0;

            // trigger first detail item click to show it---
            $('.slider-platform-interactivity .slick-slide:nth-child('+(selectedObjectiveIndex + 1)+')').click();
          }, timeoutDuration);

        }, 1800);
        
      }
      // initializing demo animation---
      playDemoPlayerAnimation();

      break;
    }
    case 'pricing': {
      // var dummydata = {"_options":{"offers":{"title":"Bill Monthly","type":"toggle","description":"Bill Annually and Save 20%"},"plans":[{"id":36,"name":"Start-Up \/ Creators Plan","subplan":{},"description":"Best for Startups, Video Creators","currency":"US$","price":0,"frequency":"month","label":null,"features":[{"title":"5 Videos Limit","details":"Create 5 Interactive Videos for FREE"},{"title":"5k Views","details":"Free upto 5K Views every month"},{"title":"50 Interactions","details":"Enable upto 50 interactions by allowing viewers to click on the tags within video"},{"title":"Wootag Branding on Player","details":"Wootag watermark on the player"},{"title":"Embeds, Social Posts","details":"Embed your Interactive Videos within your sites, apps and distribute across social channels"},{"title":"Interactivity","details":"Enable Shoppable, Lead Gen, Booking and drive Games & Apps Objectives"},{"title":"Stats Access","details":"Track your Video Views, Interactions in real-time"}]},{"id":7,"name":"Business Plan","subplan":{"year":{"id":200,"name":"Business Annual","price":999,"frequency":"year"}},"description":"Best for Medium and Scaling Up Biz","currency":"US$","price":99,"frequency":"month","label":"UPGRADE NOW","features":[{"title":"Unlimited Videos","details":"Scale your Marketing with Unlimited Videos. No Caps"},{"title":"Unlimited Views","details":"Scale your Audience with Unlimited Views.No Caps"},{"title":"1000 Interactions","details":"Enable upto 1,000 interactions by allowing viewers to click on the tags within video"},{"title":"Custom Branding","details":"Make it your Own Branded Player by removing wootag watermark and add your brand colors"},{"title":"Embeds & Social Distributions","details":"Embed your Interactive Videos within your sites, apps with iFrame, Responsive and Pop-Over Scripts and distribute across social channels"},{"title":"Interactivity Pro","details":"Enable Interactivity Pro with Store Locator, Loyalty Offers, Showcase features"},{"title":"Stats Pro","details":"Enable Additional Stats to track Engagements and your biz objectives real-time"},{"title":"Apps","details":"Enable Tracker Apps to add GA \/ FB trackers to drive retargeting and acquisition"}]},{"id":12,"name":"Enterprise Plan","subplan":{},"description":"Best for Brands and Agencies","currency":"","price":null,"frequency":"","label":"Request a Demo","features":[{"title":"Unlimited Videos","details":"Scale your Marketing with Unlimited Videos. No Caps"},{"title":"Unlimited Views","details":"Scale your Audience with Unlimited Views.No Caps"},{"title":"Unlimited Interactions","details":"Convert all your Audience into Customers"},{"title":"Custom Branding","details":"Make it your Own Branded Player by removing wootag watermark and add your brand colors"},{"title":"Embeds & Social Distributions","details":"Embed your Interactive Videos within your sites, apps distribute across social channels"},{"title":"Interactive Ads","details":"Run In\/Out Stream \/ Mobile Native Ads across Networks, Programmatic Platforms"},{"title":"Facebook Ads","details":"Run Native FB Ad Units within Wootag Dashboard"},{"title":"Ad Serving & Tracking","details":"Ad Serving & Tracking"},{"title":"In-Depth Stats & Insights","details":"Unlimited access to Real-Time stats and insights"},{"title":"Apps","details":"Access to 3rd Party Apps to drive interactivity, distributions and performance"}]}]}};
      $('.pricing>div:not(.loader)').addClass('hide');
      var data = {};

      $.ajax({url: APP.api_pricing_url, success: function(result){
        data = result;
        generatePlans(data);  
        $('.pricing>div:not(.loader)').removeClass('hide');
        $('.pricing>.loader').remove();
      }});

      function generatePlans(data) {
        var offers = data._options.offers;
        $('.pricing-toggle .before').text(offers.title);
        $('.pricing-toggle .after').text(offers.description);

        var plans = data._options.plans;
        for (var i = 0; i<plans.length; i++) {
          var $plan = $('.pricing-plans>div:nth-child('+ (i+1)+')');
          var subplan = plans[i].subplan && plans[i].subplan.year;
          var planName = plans[i].name;
          var planPrice = plans[i].price;
          var frequency = plans[i].frequency;
          if (!!subplan && annualActive) {
            planName = subplan.name;
            planPrice = subplan.price;
            frequency = subplan.frequency;
          } 
          $plan.find('.card .wt-title').text(planName);
          $plan.find('.card p').text(plans[i].description);
          var price = plans[i].currency + planPrice;
          
          if (plans[i].price === 0) {
            price = 'FREE';
            frequency = '';
          } else if (plans[i].price === null) {
            price = 'Let\'s Talk';
            frequency = '';
          }
          $plan.find('.price .amount').text(price);
          if(frequency) {
            $plan.find('.price .frequency').html('per <span>' +frequency+'</span>');
          } else {
            $plan.find('.price .frequency').html('');
          }
          


          var $featrues = $plan.find('.features');
          var $feature = $featrues.find('.feature:first-child').clone();
          $featrues.empty();
          var features = plans[i].features;
          for (var j = 0; j< features.length; j++) {
            var newFeature = $feature.clone();
            newFeature.find('.text').text(features[j].title);
            newFeature.find('.sub-text').text(features[j].details);
            $featrues.append(newFeature);
          }
        }
      }
      var annualActive = false;      

      $('.pricing-toggle :checkbox').change(function() {
        if (this.checked) {
          annualActive = true;
        } else {
          annualActive = false;
        }
        generatePlans(data);
      });
      
      $('.contact-now').on('click', function(e) {
        e.preventDefault();
        showOverlay({ type: 'contact'});
      });
      break;
    }
    case 'why_wootag_enterprise':
    case 'why_wootag_agencies': {
      $('.contact-now').on('click', function(e) {
        e.preventDefault();
        showOverlay({ type: 'contact'});
      });
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
    } else if(type === 'contact') {
      $('.overlay-lightbox.contact').addClass('visible');
      $('body').addClass('no-scroll');
    }
  }
  function closeOverlay() {
    $('.overlay-lightbox iframe').attr('src', '');
    $('.overlay-lightbox').removeClass('visible');
    $('body').removeClass('no-scroll');
  }
  $('.overlay-lightbox .button-close, .overlay-lightbox .clickclose').on('click', function(e) {
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

  (function(){
    var $form = $("#newsletter-form"),
                $inputs = $('#newsletter-form :input');

            $form.submit(function (e) {
                window.location = APP.asset_prefix + '/newsletter/subscribe/confirmation/';
                // var $button = $form.find('.js-submit');
                // var values = {};
                // $inputs.each(function () {
                //     if (this.name) values[this.name] = $(this).val();
                // });
                // console.log(values);
                // $.ajax({
                //     type: "POST",
                //     url: APP.api_newsletter_subscribe_request_url,
                //     crossDomain: true,
                //     cache: false,
                //     dataType: 'JSON',
                //     timeout: 6000,
                //     data: JSON.stringify(values),

                //     success: function success(data) {
                //         // cleaning the error message
                //         $('.form__feedback', $form).empty();
                //         $('.has-error').removeClass('has-error');

                //         console.log(data);

                //         if (!data.data.success) {

                //             var $errorDiv = $('.form__error', $form);

                //             $.each(data.data.errors, function (key, error) {
                //                 $("input[name='" + key + "']", $form).addClass('has-error');
                //                 // $( "input[name='" + key + "']", $form).after('<div class="form__feedback form__error">' + error + '</div>');
                //                 // $errorDiv.append( error );
                //             });
                //         } else {

                //                 // $button.val( data.message );

                //                 if (data.data.redirect) window.location = APP.asset_prefix + data.data.redirect;
                //             }
                //     },

                //     error: function error(jqXHR, textStatus, errorThrown) {
                //         console.log("API error: " + textStatus + " - " + errorThrown.message);
                //         $(".form__feedback", $form).empty().append("API error: " + textStatus + " - " + errorThrown.message);
                //     }
                // });

                e.preventDefault();
            });
  })();

});


