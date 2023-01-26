import App from './js/Wolf, Goat, and Cabbage/App.js';
import { TranslationProvider } from './contexts/translation';
import { RawIconProvider } from './contexts/RawIcon';

const el = document.getElementById('root');
const root = window.ReactDOM.createRoot(el);
console.log(window);
root.render(
    <TranslationProvider language={el.getAttribute('language')}>
        <RawIconProvider>
            <App />
        </RawIconProvider>
    </TranslationProvider>
);
