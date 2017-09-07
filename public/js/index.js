require('smoothscroll-polyfill').polyfill();

// listen to events...
// mc.on("panleft panright tap press", function(ev) {
//     myElement.textContent = ev.type +" gesture detected.";
// });


var waypoint = new Waypoint({
  element: document.getElementsByClassName('contact')[0],
  handler: function(direction) {
    console.log('scrolled to contact');
  }
})
//slide in function
//takes an elem and applies a slide
function slideFadeIn (elem) {
  elem.style.transform = 'translate(0%)';
  elem.style.opacity = '1';
};




// -------------------------------------------------
// Main wrapper func
// -------------------------------------------------
(function (doc, win) {
  var animID; 
  var oldIndex;
  var oldQuoteIndex;

   var elemArr = doc.getElementsByClassName('tablet__content')[0].children,
     nextQuote = doc.getElementById('nextQuote'),
     lastQuote = doc.getElementById('lastQuote'),
      quoteArr = Array.apply(null, doc.getElementsByClassName('quote')),
      navLinks = Array.apply(null, doc.querySelectorAll('header a')),
     tapFixArr = Array.apply(null, doc.getElementsByClassName('tapFix')),

      computer = doc.getElementsByClassName('computer')[0],
        tablet = doc.getElementsByClassName('tablet')[0],

    contactBtn = doc.getElementById('contact'),
          form = doc.getElementById('form'),
contactElement = doc.getElementsByClassName('contact')[0],
          body = doc.getElementsByTagName('body')[0];

       openNav = doc.getElementsByClassName('mobileNav__button')[0],
   mobileLinks = doc.getElementsByClassName('mobileNav__links')[0],
     mobileNav = doc.getElementsByClassName('mobileNav')[0],
      closeNav = doc.getElementsByClassName('closeNav')[0];


  //hammerJS for touch gestures

  var openNavHammer = new Hammer(openNav),
      closeNavHammer = new Hammer(closeNav);


  //Swiper

  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    onSlideChangeEnd: function(slider) {
      var closeMe = doc.getElementsByClassName('aboutSlide--show')[0];
      if (closeMe) {
        closeMe.classList.remove('aboutSlide--show');
      }
    }
  });

  //set computer ratio to 16:9
  computer.style.height = Math.round(computer.clientWidth / 1.777) + 'px';

  //set tablet ratio to 4:3
  tablet.style.height = Math.round(tablet.clientWidth * 1.333) + 'px';


  // openNavHammer.on('tap press', function(ev) {
  //   console.log('tap happened');
  // });

  
  
  
  
  
  // -------------------------------------------
  // helper functions below
  // -------------------------------------------


  function toggleNewScreen(oldElem) {
    oldIndex = Array.apply(null, elemArr).indexOf(oldElem);

    oldElem.classList.remove('activeScreen');

    if (oldIndex + 1 === elemArr.length) {
      oldIndex = 0;
      elemArr[oldIndex].classList.add('activeScreen');

    } else {
      elemArr[oldIndex + 1].classList.add('activeScreen');
    }
  };

  function toggleNewQuote(oldQuote) {
    oldQuoteIndex = quoteArr.indexOf(oldQuote);

    console.log('old index: ', oldQuoteIndex);
    oldQuote.classList.remove('quote--active');

    if (oldQuoteIndex + 1 === quoteArr.length) {
      oldQuoteIndex = 0;
      setTimeout(function(){
        quoteArr[oldQuoteIndex].classList.add('quote--active');
      }, 300)

    } else {
      setTimeout(function() {
        quoteArr[oldQuoteIndex + 1].classList.add('quote--active');
      }, 300)
    }
  };



  
  
  
  
  //----------------------------------------------
  // Event Listeners
  //----------------------------------------------

  // enable passive
  doc.addEventListener('touchstart', () => {
    return;
  }, {passive: true});




  contactBtn.addEventListener('click', function() {
    contactElement.scrollIntoView({ 
      behavior: 'smooth' 
    });
  });

  openNavHammer.on('tap press', function(ev) {
    console.log('hammer tap happened');
    if (mobileNav.dataset.isout === "false") {
      //add the class to show links, toggle data for container
      mobileLinks.classList.add('mobileNav__links--showing');
      
      //stop scrolling on body
      body.style.overflow = 'hidden';
      mobileNav.dataset.isout = 'true';
    }
  });
  closeNavHammer.on('tap press', function(ev) {
    if (mobileNav.dataset.isout === "true") {
      //add the class to show links, toggle data for container
      mobileLinks.classList.remove('mobileNav__links--showing');

      body.style.overflow = '';
      mobileNav.dataset.isout = 'false';
    }
  })

  // openNav.addEventListener('click', function() {
  //   console.log('openNav was clicked');
  //   //TODO, add check to see if the container state for nav showing is showing
  //   if (mobileNav.dataset.isout === "false") {
  //     //add the class to show links, toggle data for container
  //     mobileLinks.classList.add('mobileNav__links--showing');
  //     mobileNav.dataset.isout = 'true';
  //   }
  // });

  // closeNav.addEventListener('click', function() {
  //   if (mobileNav.dataset.isout === "true") {
  //     //add the class to show links, toggle data for container
  //     mobileLinks.classList.remove('mobileNav__links--showing');
  //     mobileNav.dataset.isout = 'false';
  //   }
  // });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name = doc.querySelector('input[name="name"]').value,
       email = doc.querySelector('input[name="email"]').value,
     message = doc.querySelector('textarea[name="message"]').value;

     doc.querySelector('input[name="name"]').value = '';
     doc.querySelector('input[name="email"]').value = '';
     doc.querySelector('textarea[name="message"]').value = '';

    emailjs.send("default_service","main",{name, message, email})
    .then(function(response) {
      console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
    }, function(err) {
      console.log("FAILED. error=", err);
    });
  });

  nextQuote.addEventListener('click', function() {
    //find index of 
    var old = doc.getElementsByClassName('quote--active');
    return toggleNewQuote(old[0]);
  });

  tapFixArr.forEach(function(el) {
    var elHammer = new Hammer(el);

    elHammer.on('tap', function(ev) {
      ev
        .target
        .previousElementSibling
        .classList
        .toggle('aboutSlide--show');
    })
  })

  // win.addEventListener('resize', function() {
  //   console.log('resize');
  //   computer.style.height = (computer.clientWidth / 1.77) + 'px';
  //   tablet.style.height = Math.round(tablet.clientWidth / 1.333) + 'px';
  // })

  win.addEventListener('load', function() {

    navLinks.forEach(function(el) {
      el.addEventListener('click', function(event) {
        event.preventDefault();
        window.history.pushState(null, null, event.target.dataset.location);
      });
    });

    setInterval(function() {
      toggleNewScreen(doc.getElementsByClassName('activeScreen')[0]);
    }, 3000);

    // slideFadeIn(test, 'left');

    console.log('resources loaded')

  });
}(document, window));