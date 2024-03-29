function hasTouch() {
  return (
    "ontouchstart" in window || // html5 browsers
    navigator.maxTouchPoints > 0 || // future IE
    navigator.msMaxTouchPoints > 0
  ); // current IE10
}

export { hasTouch };
