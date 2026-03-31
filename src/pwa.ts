export function initPWA(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/homer/sw.js').catch(() => {});
    });
  }

  const installBtn = document.getElementById('install-btn') as HTMLButtonElement | null;
  if (!installBtn) return;

  const isStandalone =
    (navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;

  if (isStandalone) return;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) && !(window as any).MSStream;
  const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/i.test(navigator.userAgent);

  let deferredPrompt: any = null;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = '';
  });

  if (isIOS && isSafari) {
    installBtn.style.display = '';
  }

  installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((result: any) => {
        if (result.outcome === 'accepted') {
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      });
    } else if (isIOS && isSafari) {
      const modal = document.getElementById('ios-install-modal');
      if (modal) modal.style.display = 'flex';
    }
  });

  window.matchMedia('(display-mode: standalone)').addEventListener('change', (e: MediaQueryListEvent) => {
    if (e.matches) installBtn.style.display = 'none';
  });

  const iosModal = document.getElementById('ios-install-modal');
  const iosModalClose = document.getElementById('ios-modal-close');
  if (iosModal) {
    if (iosModalClose) {
      iosModalClose.addEventListener('click', () => {
        iosModal.style.display = 'none';
      });
    }
    iosModal.addEventListener('click', (e: Event) => {
      if (e.target === iosModal) iosModal.style.display = 'none';
    });
  }
}
