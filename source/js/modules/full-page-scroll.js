import throttle from 'lodash/throttle';
import {
  Time,
  removeSliderThemeClasses,
  dispatchStoryScreenActivateEvent,
} from '../utils';
import {getPrizesJourneysSvg} from './svgs';

const ACTIVE_DISPLAY_CLASS = `active`;
const HIDDEN_DISPLAY_CLASS = `screen--hidden`;
const FILL_DISPLAY_CLASS = `screen--fill`;
const WITH_FOOTER_DISPLAY_CLASS = `screen--with-footer`;

const ScreenId = {
  STORY: `story`,
  INTRO: `top`,
  PRIZES: `prizes`,
};

const INTRO_BACKGROUND_HIDE_CLASS = `intro-background-hide`;
const FOOTER_DISPLAY_CLASS = `footer-display`;

let journeysSvgObject = {};
let isJourneysSvgNeedPaste = true;

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreenIndex = 0;
    this.prevActiveScreen = null;
    this.isInitState = true;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    journeysSvgObject = getPrizesJourneysSvg();

    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
  }

  activate() {
    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      const prevActiveScreenIndex = this.activeScreenIndex;
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreenIndex;
      if (currentPosition !== this.activeScreenIndex) {
        this.prevActiveScreen = this.screenElements[prevActiveScreenIndex];

        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    if (!this.isInitState) {
      this.prevActiveScreen = this.screenElements[this.activeScreenIndex];
    }

    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreenIndex = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    let delayDisablePrevScreen = 0;
    let delayTimeActivateNewScreen = Time.MEDIUM;
    let delayTimeHidePrevScreen = 0;

    if (this.isInitState) {
      delayTimeActivateNewScreen = 10;
      this.isInitState = false;

      if (this.screenElements[this.activeScreenIndex].id !== ScreenId.INTRO) {
        document.body.classList.add(INTRO_BACKGROUND_HIDE_CLASS);
      }
    }

    if (this.prevActiveScreen) {
      if (
        this.screenElements[this.activeScreenIndex].classList.contains(FILL_DISPLAY_CLASS)
        && (
          this.prevActiveScreen.id === ScreenId.STORY
          || this.prevActiveScreen.id === ScreenId.INTRO
        )
      ) {
        delayTimeActivateNewScreen = Time.MEDIUM;
        delayTimeHidePrevScreen = Time.MEDIUM;
        delayDisablePrevScreen = Time.MEDIUM;
      }

      if (this.prevActiveScreen.id !== ScreenId.INTRO) {
        document.body.classList.add(INTRO_BACKGROUND_HIDE_CLASS);
      }

      if (this.prevActiveScreen.id === ScreenId.PRIZES) {
        document.body.classList.add(`prizes-show`);
      }

      if (this.screenElements[this.activeScreenIndex].classList.contains(WITH_FOOTER_DISPLAY_CLASS)
        && this.prevActiveScreen.classList.contains(WITH_FOOTER_DISPLAY_CLASS)) {
        document.body.classList.add(FOOTER_DISPLAY_CLASS);
      } else {
        document.body.classList.remove(FOOTER_DISPLAY_CLASS);
      }

      setTimeout(() => {
        this.prevActiveScreen.classList.remove(ACTIVE_DISPLAY_CLASS);
      }, delayDisablePrevScreen);
    }

    this.screenElements[this.activeScreenIndex].classList.remove(HIDDEN_DISPLAY_CLASS);

    if (this.screenElements[this.activeScreenIndex].id === ScreenId.INTRO) {
      document.body.classList.remove(INTRO_BACKGROUND_HIDE_CLASS);
    } else if (this.screenElements[this.activeScreenIndex].id === ScreenId.PRIZES) {
      if (isJourneysSvgNeedPaste) {
        if (journeysSvgObject.content) {
          const prizesIcon = document.querySelector(`.prizes__item--journeys .prizes__icon`);

          if (prizesIcon) {
            prizesIcon.innerHTML = journeysSvgObject.content;
          }
        }

        isJourneysSvgNeedPaste = false;
      }
    }

    setTimeout(() => {
      this.screenElements[this.activeScreenIndex].classList.add(ACTIVE_DISPLAY_CLASS);

      removeSliderThemeClasses();

      if (this.screenElements[this.activeScreenIndex].id === ScreenId.STORY) {
        dispatchStoryScreenActivateEvent();
      }

      if (this.prevActiveScreen) {
        setTimeout(() => {
          this.prevActiveScreen.classList.add(HIDDEN_DISPLAY_CLASS);
        }, delayTimeHidePrevScreen);
      }
    }, delayTimeActivateNewScreen);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreenIndex].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreenIndex,
        'screenName': this.screenElements[this.activeScreenIndex].id,
        'screenElement': this.screenElements[this.activeScreenIndex]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreenIndex = Math.min(this.screenElements.length - 1, ++this.activeScreenIndex);
    } else {
      this.activeScreenIndex = Math.max(0, --this.activeScreenIndex);
    }
  }
}
