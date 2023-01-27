// const { App, TranslationProvider, RawIconProvider } = window.exports;
const { App, RawIconProvider, TranslationProvider } = window.exports;

const el = document.getElementById("root");
const root = window.ReactDOM.createRoot(el);

root.render(
  <TranslationProvider language={el.getAttribute("language")}>
    <RawIconProvider>
      <App />
    </RawIconProvider>
  </TranslationProvider>
);
