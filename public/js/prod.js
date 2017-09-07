(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * smoothscroll polyfill - v0.3.5
 * https://iamdustan.github.io/smoothscroll
 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
 */

(function(w, d, undefined) {
  'use strict';

  /*
   * aliases
   * w: window global object
   * d: document
   * undefined: undefined
   */

  // polyfill
  function polyfill() {
    // return when scrollBehavior interface is supported
    if ('scrollBehavior' in d.documentElement.style) {
      return;
    }

    /*
     * globals
     */
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    /*
     * object gathering original scroll methods
     */
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    /*
     * define timing method
     */
    var now = w.performance && w.performance.now
      ? w.performance.now.bind(w.performance) : Date.now;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} x
     * @returns {Boolean}
     */
    function shouldBailOut(x) {
      if (typeof x !== 'object'
            || x === null
            || x.behavior === undefined
            || x.behavior === 'auto'
            || x.behavior === 'instant') {
        // first arg not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof x === 'object'
            && x.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError('behavior not valid');
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      var isBody;
      var hasScrollableSpace;
      var hasVisibleOverflow;

      do {
        el = el.parentNode;

        // set condition variables
        isBody = el === d.body;
        hasScrollableSpace =
          el.clientHeight < el.scrollHeight ||
          el.clientWidth < el.scrollWidth;
        hasVisibleOverflow =
          w.getComputedStyle(el, null).overflow === 'visible';
      } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));

      isBody = hasScrollableSpace = hasVisibleOverflow = null;

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    /*
     * ORIGINAL METHODS OVERRIDES
     */

    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scroll.call(
          w,
          arguments[0].left || arguments[0],
          arguments[0].top || arguments[1]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left,
        ~~arguments[0].top
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left || arguments[0],
          arguments[0].top || arguments[1]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.elScroll.call(
            this,
            arguments[0].left || arguments[0],
            arguments[0].top || arguments[1]
        );
        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
          this,
          this,
          typeof left === 'number' ? left : this.scrollLeft,
          typeof top === 'number' ? top : this.scrollTop
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      var arg0 = arguments[0];

      if (typeof arg0 === 'object') {
        this.scroll({
          left: arg0.left + this.scrollLeft,
          top: arg0.top + this.scrollTop,
          behavior: arg0.behavior
        });
      } else {
        this.scroll(
          this.scrollLeft + arg0,
          this.scrollTop + arguments[1]
        );
      }
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );
        // reveal parent in viewport
        w.scrollBy({
          left: parentRects.left,
          top: parentRects.top,
          behavior: 'smooth'
        });
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (typeof exports === 'object') {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }
})(window, document);

},{}],2:[function(require,module,exports){
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
    },
    pagination: '.swiper-pagination-h',
    paginationClickable: true
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

  // on orientation change resize computer and tablet

  win.addEventListener("orientationchange", function() {
    computer.style.height = (computer.clientWidth / 1.77) + 'px';
    tablet.style.height = Math.round(tablet.clientWidth / 1.333) + 'px';
  });

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
},{"smoothscroll-polyfill":1}]},{},[2]);
