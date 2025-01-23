(function() {
  // Create a unique ID for the container if not provided
  function generateContainerId() {
    return 'foster-care-calculator-' + Math.random().toString(36).substr(2, 9);
  }

  // Initialize the widget
  function initWidget(containerId) {
    // Add required styles
    const style = document.createElement('style');
    style.textContent = `
      #${containerId} {
        width: 100%;
        height: 700px;
        border: none;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    // Create container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.currentScript.parentElement.appendChild(container);
    }

    // Create and append iframe
    const iframe = document.createElement('iframe');
    iframe.src = window.location.origin + '/embed?embedded=true';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    container.appendChild(iframe);
  }

  // Main initialization
  const containerId = document.currentScript.getAttribute('data-container-id') || generateContainerId();
  initWidget(containerId);
})();