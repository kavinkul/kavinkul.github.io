const { useContext } = window.React;
const { TranslationContext } = window.exports;

function useTranslation() {
  return useContext(TranslationContext);
}

export { useTranslation };
