import './index.scss';
import $ from 'jquery';

// Random polygons around project images
class PolygonPoints {
  constructor(points) {
    this.points = points;
  }

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  translateToPoints() {
    let pointsString = '';

    this.points.forEach((arr) => {
      pointsString += `${this.randomNum(...arr[0])}% ${this.randomNum(...arr[1])}%, `;
    });

    return pointsString.slice(0, -2);
  }
}

const allPoints = new PolygonPoints([
  [[0, 15], [0, 15]],
  [[85, 100], [0, 15]],
  [[85, 100], [85, 100]],
  [[0, 15], [85, 100]],
]);

const projectImages = $('.project-image');
projectImages.each(function eachProjectImage() {
  $(this).css('-webkit-clip-path', `polygon(${allPoints.translateToPoints()})`);
});

// Show/hide header on scroll
let didScroll = false;
let lastScrollTop = 0;
const elements = $('.header, .navigation');

$(window).scroll(() => {
  didScroll = true;
});

function scrolled() {
  const st = $(window).scrollTop() - 50;
  if (st > lastScrollTop) {
    elements.addClass('show-hide');
  } else {
    elements.removeClass('show-hide');
  }

  lastScrollTop = st;
}

setInterval(() => {
  if (didScroll) {
    scrolled();
    didScroll = false;
  }
}, 250);

// Smooth scroll
const $body = $('html, body');
$('.nav-item-link').on('click', function smoothScroll(e) {
  e.preventDefault();
  const offset = $(this.hash).offset().top;
  $body.animate({
    scrollTop: offset,
  }, 500);
});
