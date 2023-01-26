import hasTouch from '../utility/HasTouch';

const { useEffect, useState } = window.React;

function useCheckMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(hasTouch());
    }, []);

    return { isMobile };
}

export default useCheckMobile;
