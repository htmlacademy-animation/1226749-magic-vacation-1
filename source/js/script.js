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
      time: 0.5,
      startTimeOffset: 0.5,
      animationType: AnimationType.CUSTOM,
      lettersTimeOffset: [0.16, 0.08, 0, 0.08, 0.12, 0.08, 0, 0.24, 0.12, 0, 0.12, 0, 0.4, 0.44, 0.36, 0.28, 0.4, 0.32]
    }
);

createAnimationText(
    document.querySelector(`.intro__date`),
    {
      time: 0.5,
      stepTimeOffset: 0.02,
      startTimeOffset: 0.9,
      animationType: AnimationType.RANDOM,
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
