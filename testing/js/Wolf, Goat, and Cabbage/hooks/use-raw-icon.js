// import RawIconContext from "../contexts/RawIcon";

const { useContext } = window.React;
const { RawIconContext } = window.exports;

function useRawIcon() {
  return useContext(RawIconContext);
}

export { useRawIcon };
