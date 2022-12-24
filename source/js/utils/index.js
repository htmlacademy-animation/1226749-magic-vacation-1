const AnimationType = {
  DEFAULT: `default`,
  CUSTOM: `custom`,
  RANDOM: `random`,
};

const getNoise = (noiseLength) => {
  const maxFrequency = 2 ** 5 + 1;
  const frequencies = new Array(maxFrequency).fill(0).map((el, index) => index + 1);
  const noise = new Array(noiseLength).fill(0);

  const getWave = (frequency) => {
    const phase = Math.random() * (2 * Math.PI);

    return new Array(noiseLength).fill(0).map((item, index) => {
      const step = index + 1;
      return Math.sin(2 * Math.PI * frequency * step / noiseLength + phase);
    });
  };

  const waves = frequencies.map((item) => getWave(item));

  for (let i = 0; i < waves.length; i++) {
    for (let j = 0; j < noiseLength; j++) {
      noise[j] += waves[i][j];
    }
  }

  return noise;
};

const getTimesValues = (noiseLength, startDelay, maxStartDelay) => {
  const noise = getNoise(noiseLength);
  const positiveNoise = noise.map((item) => item + Math.abs(Math.min(...noise)));
  const maxNoiseValue = Math.max(...positiveNoise);

  return positiveNoise.map((item) => {
    return startDelay + (maxStartDelay - startDelay) * item / (maxNoiseValue / 100) / 100;
  });
};

const createAnimationText = (node, userAnimateSettings = {}) => {
  if (!node) {
    return;
  }

  /* eslint-disable-next-line no-irregular-whitespace */
  const words = node.textContent.trim().split(/(?! )\s/).filter((word) => word !== ``);
  const lettersNumber = words.map((word) => word.length).reduce((total, length) => total + length, 0);
  let commonLetterIndex = 0;

  const defaultAnimateSettings = {
    property: `transform`,
    time: 0.5,
    timeFunction: `ease`,
    startTimeOffset: 0,
    stepTimeOffset: 0.03,
    animationType: AnimationType.DEFAULT,
  };

  const animateSettings = Object.assign(defaultAnimateSettings, userAnimateSettings);

  let letterTimeOffsets = new Array(lettersNumber).fill(0)
    .map((item, index) => animateSettings.startTimeOffset + animateSettings.stepTimeOffset * index);

  if (animateSettings.animationType === AnimationType.RANDOM) {
    letterTimeOffsets = words.map((word, wordIndex) => {
      let startDelay = animateSettings.startTimeOffset;

      if (wordIndex !== 0) {
        startDelay = words[wordIndex - 1].length * animateSettings.stepTimeOffset;
      }

      let maxStartDelay = startDelay + word.length * animateSettings.stepTimeOffset;

      return getTimesValues(word.length, startDelay, maxStartDelay);
    }).flat();
  } else if (animateSettings.animationType === AnimationType.CUSTOM) {
    letterTimeOffsets = getTimesValues(lettersNumber, animateSettings.startTimeOffset, 0.8 * animateSettings.startTimeOffset);
  }

  const newTextContent = words.reduce((fragmentParent, word, wordIndex) => {
    const wordElement = Array.from(word).reduce((fragment, letter) => {
      const span = document.createElement(`span`);

      span.textContent = letter;

      span.style.transitionProperty = `${animateSettings.property}`;
      span.style.transitionDuration = `${animateSettings.time}s`;
      span.style.transitionTimingFunction = `${animateSettings.timeFunction}`;
      span.style.transitionDelay = `${letterTimeOffsets[commonLetterIndex]}s`;

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

const getIntRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getFloatRandomNumber = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(3), 10);
};

export {
  AnimationType,
  createAnimationText,
  shuffleArray,
  getIntRandomNumber,
  getFloatRandomNumber,
};
