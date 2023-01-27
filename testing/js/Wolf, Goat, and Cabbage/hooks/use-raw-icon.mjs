import RawIconContext from "../contexts/RawIcon";

const { useContext } = window.React;

function useRawIcon() {
  return useContext(RawIconContext);
}

export default useRawIcon;
