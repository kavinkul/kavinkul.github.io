const { forwardRef } = window.React;

const Button = forwardRef(({ style, className, children, ...rest }, ref) => {
  const baseStyle = {
    border: "4px solid black",
    background: "white",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "2px",
    paddingBottom: "2px",
  };

  const finalStyle = { ...baseStyle, ...style };

  const finalClassName = "noTextHighlight " + className;

  return (
    <button ref={ref} {...rest} style={finalStyle} className={finalClassName}>
      {children}
    </button>
  );
});

export { Button };
