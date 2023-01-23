const getPrizesJourneysSvg = () => {
  const svgImg = document.querySelector(`.prizes__item--journeys .prizes__icon img`);
  const svgObject = {};

  if (svgImg) {
    const svgPath = svgImg.src;
    svgObject.src = svgPath;

    if (svgPath) {
      fetch(svgPath)
        .then((response) => {
          if (response.ok) {
            return response.text();
          }

          throw new Error(`failed img load`);
        })
        .then((result) => {
          svgObject.content = result;
        })
        .catch((err) => {
          return err;
        });
    }
  }

  return svgObject;
};

export {
  getPrizesJourneysSvg,
};
