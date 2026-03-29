(function () {
  async function loadRuntime() {
    let status;
    try {
      const response = await fetch('/api/nyx-status', { credentials: 'same-origin' });
      if (!response.ok) return;
      status = await response.json();
    } catch {
      return;
    }

    if (!status || !status.showEye) return;

    const script = document.createElement('script');
    script.src = '/api/runtime';
    script.defer = true;
    document.body.appendChild(script);
  }

  loadRuntime();
})();
