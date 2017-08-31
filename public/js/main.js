
//color animate, 
// function hoverBrotherCover(elem) {
//   elem
// }


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

  nextQuote.addEventListener('click', () => {
    //find index of 
    let old = doc.getElementsByClassName('quote--active');
    return toggleNewQuote(old[0]);
  });

  win.addEventListener('load', () => {

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