const { useRef } = window.React;

function HelpMessages({ textContent, isShown }) {
  const divEl = useRef();

  const style = {
    height: "auto",
    maxHeight: "0px",
    overflow: "hidden",
    transition: "max-height 0.2s ease-in-out",
    backgroundColor: "#f1f1f1",
  };

  const content = textContent.map((message, index) => {
    return <li key={index}>{message}</li>;
  });

  if (isShown) {
    if (divEl.current) {
      style.maxHeight = divEl.current.scrollHeight + "px";
    } else {
      style.maxHeight = "0px";
    }
  }

  return (
    <div ref={divEl} style={style}>
      <ul>{content}</ul>
    </div>
  );
}

export { HelpMessages };
