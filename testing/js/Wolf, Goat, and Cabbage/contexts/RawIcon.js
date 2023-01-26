const { createContext, useState, useEffect } = window.React;

const RawIconContext = createContext();

function RawIconProvider({ children }) {
    const [rawGoCheck, setRawGoCheck] = useState('');
    const [rawGoArrowBoth, setRawGoArrowBoth] = useState('');
    const [rawGoArrowUp, setRawGoArrowUp] = useState('');
    const [rawGoArrowDown, setRawGoArrowDown] = useState('');

    const checkIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="white" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"/></svg>';
    const arrowBothIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16.05 12.05L21 17l-4.95 4.95-1.414-1.414 2.536-2.537L4 18v-2h13.172l-2.536-2.536 1.414-1.414zm-8.1-10l1.414 1.414L6.828 6 20 6v2H6.828l2.536 2.536L7.95 11.95 3 7l4.95-4.95z"/></svg>';

    const arrowUpIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"/></svg>';

    const arrowDownIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z"/></svg>';

    useEffect(() => {
        setRawGoCheck(checkIcon);
        setRawGoArrowBoth(arrowBothIcon);
        setRawGoArrowUp(arrowUpIcon);
        setRawGoArrowDown(arrowDownIcon);
    }, []);

    return (
        <RawIconContext.Provider
            value={{ rawGoCheck, rawGoArrowBoth, rawGoArrowUp, rawGoArrowDown }}
        >
            {children}
        </RawIconContext.Provider>
    );
}

export { RawIconProvider };
export default RawIconContext;
