'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



// Button scrolling
btnScrollTo.addEventListener('click', function(event) {
  event.preventDefault();
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(event.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);
  console.log('heigth/width viewport', document.documentElement.clientHeight,
  document.documentElement.clientWidth);

  // Scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })
  section1.scrollIntoView({behavior: 'smooth'})
})


/////Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(element) {
//   element.addEventListener('click', function(event) {
//     event.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//   })
// })

// 1.Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(event) {
  event.preventDefault()
  console.log(event);

  if(event.target.classList.contains('nav__link')) {
    const id = event.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  }
})

// Tabbed component

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab')
  
    // Guard clause
  if(!clicked) return

  // Active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')
  
  // Activate content area
  tabsContent.forEach(tab => tab.classList.remove('operations__content--active'))
  document
  .querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active')
})


function handleHover(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    console.log(link);
    console.log(link.closest('.nav'));
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity
  }
}

// Menu fade animation
nav.addEventListener('mouseover', function(e) {
  handleHover(e, 0.5)
})

nav.addEventListener('mouseout', function(e) {
  handleHover(e, 1)
})

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function() {
//   if(window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky')
//   } else {
//     nav.classList.remove('sticky')
//   }
// })

// Sticky navigation: Intercection observer API
// function obsCallback(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }
// const obsOptions = {
//   root: null, 
//   threshold: [0, 0.2]
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  const [entry] = entries
  if(!entry.isIntersecting) {
    nav.classList.add('sticky')
  }
  else nav.classList.remove('sticky')

}

const headerObserver = new IntersectionObserver(
  stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
  }
)
headerObserver.observe(header);

// Reveal Sections

const allSections = document.querySelectorAll('.section')

function revealSection(entries, observer) {
  const [entry] = entries
  if(!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})

allSections.forEach(function(section) {
  sectionObserver.observe(section)
  // section.classList.add('section--hidden')
})

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

function loadImg(entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting) return
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0
})

imgTargets.forEach(img => {
  imgObserver.observe(img)
})

// Slider
let currSlide = 0
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const dotsContainer = document.querySelector('.dots')
const maxSlide = slides.length


function createDots() {
  slides.forEach(function(_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  } 
createDots(); 
  
function activateDot(slide) {
  document.querySelectorAll('.dots__dot')
  .forEach(dot => {
    dot.classList.remove('dots__dot--active')
  })
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

function goToSlide(frame) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - frame)}%)`
  })
}
activateDot(0);
goToSlide(0);

const nextSlide = function() {
  if(currSlide === maxSlide - 1) {
    currSlide = 0
  } else {
    currSlide++
  }
  goToSlide(currSlide)
  activateDot(currSlide)
}

const previousSlide = function() {
  if(currSlide === 0) {
    currSlide = maxSlide -1;
  } else {
    currSlide--
  }
  goToSlide(currSlide)
  activateDot(currSlide)
}

btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', previousSlide)

// Arrow key navigation
document.addEventListener('keydown', function(e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && previousSlide();
})
dotsContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    console.log('DOT');
    const {slide} = e.target.dataset;
    goToSlide(slide)
    activateDot(slide)
  }
})




/////////////////////////////////////////////////////
// LECTURES
////////////////////////////////////////////////////



// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header')

// const allSections = document.querySelectorAll('.section')
// console.log(allSections);

// document.getElementById('section--1');

// const allButtons = document.getElementsByTagName('button')
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));



// Creating and inserting elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We are using coockies for better functionality'
// message.innerHTML = 'We are using cookies for better functionality <button class="btn btn--close-cookie">Got It!</button>'

// header.prepend(message);
// header.append(message.cloneNode(true))
// header.append(message)

// header.before(message)
// header.after(message)

// Delete element
// document.querySelector('.btn--close-cookie').addEventListener('click', function () {
//   message.remove();
// })



// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).width);

// message.style.height = Number.parseFloat(getComputedStyle(message).height) + 20 + 'px'

// document.documentElement.style.setProperty('--color-primary', 'orangered')

// Attributes
// const logo = document.querySelector('.nav__logo');
// logo.alt = 'Nice minimalist logo'
// console.log(logo.src);
// console.log(logo.alt);

// Non-standart attributes
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Meta')
// console.log(logo.getAttribute('company'));

// const link = document.querySelector('.nav__link--btn')

// console.log(link.href);
// console.log(link.getAttribute('href'));

// Data attributes
// console.log(logo.dataset.versionNumber);
// Classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes



// Types of Events and event handlers
//  const h1 = document.querySelector('h1');

// const alertH1 = function(event) {
//   alert('Mouse entered')

//   h1.removeEventListener('mouseenter', alertH1)
// }

// h1.addEventListener('mouseenter', alertH1)

// h1.onmouseenter = function(event) {
//   alert('Mouse entered')
// }


// Event propagation in practice
// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1 ) + min)
// }
// const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(event) {
//   console.log(this, event.target);
//   this.style.backgroundColor = randomColor()

  // Stop propagation
  // event.stopPropagation()
// })
// document.querySelector('.nav__links').addEventListener('click', function(event) {
//   console.log(this, event.target);
//   this.style.backgroundColor = randomColor()
// })
// document.querySelector('.nav').addEventListener('click', function(event) {
//   console.log(this, event.target);
//   this.style.backgroundColor = randomColor()
// })


// DOM traversing

// const h1 = document.querySelector('h1')

// Going downwards: child
  // console.log(h1.querySelectorAll('.highlight'));
  // console.log(h1.childNodes);
  // console.log(h1.children);
  // h1.firstElementChild.style.color = 'white'
  // h1.lastElementChild.style.color = 'orangered'

// Going upwards: parents
  // console.log(h1.parentNode);
  // console.log(h1.parentElement)
  // h1.closest('.header').style.background = 'var(--gradient-secondary)';
  // h1.closest('h1').style.background = 'var(--gradient-primary)'

// Going sideways: siblings
  // console.log(h1.previousElementSibling);
  // console.log(h1.nextElementSibling);

  // console.log(h1.parentNode.children);
  // [...h1.parentNode.children].forEach(function (el) {
  //   if(el !== h1) {
  //     el.style.transform = 'scale(0.5)'
  //   }
  // })




// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log(e);
// })
// window.addEventListener('load', function(e) {
//   console.log(e);
// })
// window.addEventListener('beforeunload', function(e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// })