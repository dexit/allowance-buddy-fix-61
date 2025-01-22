(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.gpteng.co/gptengineer.js';
  script.type = 'module';
  document.head.appendChild(script);

  const iframe = document.createElement('iframe');
  iframe.src = window.location.origin + '?embedded=true';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  
  const container = document.getElementById('foster-care-calculator');
  if (container) {
    container.appendChild(iframe);
  }
})();