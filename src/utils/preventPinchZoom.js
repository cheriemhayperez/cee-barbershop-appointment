export function preventPinchZoom() {
  const block = (event) => event.preventDefault();

  document.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey) event.preventDefault();
    },
    { passive: false }
  );

  ['gesturestart', 'gesturechange', 'gestureend'].forEach((type) => {
    document.addEventListener(type, block, { passive: false });
  });

  document.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length > 1) event.preventDefault();
    },
    { passive: false }
  );
}
