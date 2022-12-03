const AnimationType = {
  DEFAULT: `default`,
  CUSTOM: `custom`,
  RANDOM: `random`,
};

const createAnimationText = (node, userAnimateSettings = {}) => {
  if (!node) {
    return;
  }

  const words = node.textContent.trim().split(` `).filter((word) => word !== ``);
  const lettersNumber = words.map((word) => word.length).reduce((total, length) => total + length, 0);
  let commonLetterIndex = 0;

  const defaultAnimateSettings = {
    property: `transform`,
    time: 0.5,
    timeFunction: `ease`,
    startTimeOffset: 0,
    stepTimeOffset: 0.03,
    animationType: AnimationType.DEFAULT,
    lettersTimeOffset: [0],
    lettersOrder: new Array(lettersNumber).fill(0).map((_, index) => index),
  };

  const animateSettings = Object.assign(defaultAnimateSettings, userAnimateSettings);
  let letterTimeOffset = animateSettings.startTimeOffset;

  if (animateSettings.animationType === AnimationType.RANDOM) {
    shuffleArray(animateSettings.lettersOrder);
  }

  const newTextContent = words.reduce((fragmentParent, word, wordIndex) => {
    const wordElement = Array.from(word).reduce((fragment, letter) => {
      const span = document.createElement(`span`);

      span.textContent = letter;

      if (animateSettings.animationType === AnimationType.CUSTOM) {
        letterTimeOffset = animateSettings.startTimeOffset + (animateSettings.lettersTimeOffset[commonLetterIndex % animateSettings.lettersTimeOffset.length]);
      } else if (animateSettings.animationType === AnimationType.RANDOM) {
        letterTimeOffset = animateSettings.startTimeOffset + animateSettings.lettersOrder[commonLetterIndex] * animateSettings.stepTimeOffset;
      }

      span.style.transition = `${animateSettings.property} ${animateSettings.time}s ${animateSettings.timeFunction} ${letterTimeOffset}s`;

      if (animateSettings.animationType === AnimationType.DEFAULT) {
        letterTimeOffset += animateSettings.stepTimeOffset;
      }

      commonLetterIndex++;

      fragment.appendChild(span);

      return fragment;
    }, document.createDocumentFragment());

    const wordContainer = document.createElement(`span`);
    wordContainer.classList.add(`text__word`);
    wordContainer.appendChild(wordElement);
    fragmentParent.appendChild(wordContainer);

    if (wordIndex !== words.length - 1) {
      fragmentParent.appendChild(document.createTextNode(` `));
    } else {
      commonLetterIndex--;
    }

    return fragmentParent;
  }, document.createDocumentFragment());

  node.innerHTML = ``;
  node.appendChild(newTextContent);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const index = Math.floor(Math.random() * (i + 1));
    const elem = array[index];
    array[index] = array[i];
    array[i] = elem;
  }

  return array;
};

export {
  AnimationType,
  createAnimationText,
  shuffleArray,
};
