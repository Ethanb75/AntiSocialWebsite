
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




(function (doc, win) {
  // let testPoint = new Waypoint({
  //   element: doc.getElementById('test'),
  //   handler: () => {
  //     console.log('passed a point');
  //   }
  // })
  let animID, oldIndex;
  let elemArr = doc.getElementsByClassName('tablet__content')[0].children;

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