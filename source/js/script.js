// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import {createAnimationText, AnimationType} from './utils';


// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

createAnimationText(
    document.querySelector(`.intro__title`),
    {
      animationType: AnimationType.RANDOM,
    }
);

createAnimationText(
    document.querySelector(`.intro__date`),
    {
      time: 0.5,
      stepTimeOffset: 0.02,
      startTimeOffset: 0.9,
      animationType: AnimationType.CUSTOM,
    }
);

[`slider__item-title`, `prizes__title`, `rules__title`, `game__title`].forEach((className) => {
  createAnimationText(
      document.querySelector(`.${className}`),
      {
        animationType: AnimationType.RANDOM,
      }
  );
});

window.addEventListener(`load`, () => {
  document.body.classList.add(`loaded`);
});
