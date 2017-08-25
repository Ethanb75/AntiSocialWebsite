
//color animate, 
// function hoverBrotherCover(elem) {
//   elem
// }




(function (doc, win) {
  // let testPoint = new Waypoint({
  //   element: doc.getElementById('test'),
  //   handler: () => {
  //     console.log('passed a point');
  //   }
  // })
  let animID;
  let elemArr = doc.getElementsByClassName('content')[0].children;

  function toggleNewScreen(oldElem) {
    let oldIndex = Array.apply(null, elemArr).indexOf(oldElem);

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
    }, 3000)

  })
// function repeatOften() {
//   //
//   globalID = requestAnimationFrame(repeatOften);
// }

//   globalID = requestAnimationFrame(repeatOften);

// $("#stop").on("click", function() {
//   cancelAnimationFrame(globalID);
// });
}(document, window));