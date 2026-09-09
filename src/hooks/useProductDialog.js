import { useEffect } from 'react';

export function useProductDialog(productId, setState) {
  useEffect(() => {
    if (!productId) return;
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth)
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    const focusable = () => [
      ...dialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex="0"]',
      ),
    ];
    const controls = focusable();
    (
      dialog.querySelector('[aria-label="Закрыть окно изделия"]') || controls[0]
    )?.focus({ preventScroll: true });
    const keydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setState({ open: null });
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const index = elements.indexOf(document.activeElement);
      const next = event.shiftKey
        ? index <= 0
          ? elements.length - 1
          : index - 1
        : (index + 1) % elements.length;
      event.preventDefault();
      elements[next]?.focus();
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [productId, setState]);
}
