// require('smoothscroll-polyfill').polyfill();

console.log('jesus christ')

let waypoint = new Waypoint({
  element: document.getElementsByClassName('contact')[0],
  handler: function(direction) {
    console.log('scrolled to contact')
  }
})
//slide in function
//takes an elem and applies a slide
function slideFadeIn (elem) {
  elem.style.transform = 'translate(0%)';
  elem.style.opacity = '1';
}



function findIndex () {

}




(function (doc, win) {
  let animID, oldIndex, oldQuoteIndex;

  const elemArr = doc.getElementsByClassName('tablet__content')[0].children;
  const nextQuote = doc.getElementById('nextQuote');
  const lastQuote = doc.getElementById('lastQuote');
  const quoteArr = Array.apply(null, doc.getElementsByClassName('quote'));
  const navLinks = Array.apply(null, doc.querySelectorAll('header a'));
  const contactBtn = doc.getElementById('contact');
  const form = doc.getElementById('form');

  console.log(form);

  function toggleNewScreen(oldElem) {
    oldIndex = Array.apply(null, elemArr).indexOf(oldElem);

    oldElem.classList.remove('activeScreen');

    if (oldIndex + 1 === elemArr.length) {
      oldIndex = 0;
      elemArr[oldIndex].classList.add('activeScreen');

    } else {
      elemArr[oldIndex + 1].classList.add('activeScreen');
    }
  }

  function toggleNewQuote(oldQuote) {
    oldQuoteIndex = quoteArr.indexOf(oldQuote);

    console.log('old index: ', oldQuoteIndex);
    oldQuote.classList.remove('quote--active');

    if (oldQuoteIndex + 1 === quoteArr.length) {
      oldQuoteIndex = 0;
      setTimeout(() => {
        quoteArr[oldQuoteIndex].classList.add('quote--active');
      }, 300)

    } else {
      setTimeout(() => {
        quoteArr[oldQuoteIndex + 1].classList.add('quote--active');
      }, 300)
    }
  }

  contactBtn.addEventListener('click', function () {
    let contactForm = doc.getElementsByClassName('contact')[0];

    // window.scroll({
    //   top: window.innerHeight * 5 - 300, 
    //   left: 0, 
    //   behavior: 'smooth' 
    // });

    contactForm.scrollIntoView({ 
      behavior: 'smooth' 
    });

  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    let name = doc.querySelector('input[name="name"]').value,
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

  nextQuote.addEventListener('click', () => {
    //find index of 
    let old = doc.getElementsByClassName('quote--active');
    return toggleNewQuote(old[0]);
  });

  win.addEventListener('load', () => {
    //set the default link idk why not 
    // history.replaceState(null, null, '/home')


    navLinks.forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault();
        window.history.pushState(null, null, event.target.dataset.location);
      });
    });

    setInterval(() => {
      toggleNewScreen(doc.getElementsByClassName('activeScreen')[0]);
    }, 3000);

    

  // let slideArr = Array.apply(null, document.getElementsByClassName('slideMe'));
  // slideArr.forEach(el => {
  //   let waypoint = new Waypoint({
  //     element: el,
  //     handler: function() {
  //       return slideFadeIn(el);
  //     },
  //     offset: window.innerHeight - 100
  //   })
  // })






    // slideFadeIn(test, 'left');

  })
}(document, window));