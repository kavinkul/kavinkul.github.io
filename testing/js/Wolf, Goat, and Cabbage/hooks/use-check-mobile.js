// import hasTouch from '../utility/HasTouch';

const { useEffect, useState } = window.React;
const { hasTouch } = window.exports;

function useCheckMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(hasTouch());
  }, []);

  return { isMobile };
}

export { useCheckMobile };
