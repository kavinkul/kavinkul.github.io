import TranslationContext from '../contexts/translation';

const { useContext } = window.React;

function useTranslation() {
    return useContext(TranslationContext);
}

export default useTranslation;
