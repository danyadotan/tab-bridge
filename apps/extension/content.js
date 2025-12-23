// TAB Overlay - Content Script
// Injects the floating spark button and overlay panel

(function() {
    'use strict';

   // Prevent multiple injections
   if (window.__TAB_OVERLAY_INJECTED__) return;
    window.__TAB_OVERLAY_INJECTED__ = true;

   // Create spark button
   const spark = document.createElement('button');
    spark.className = 'tab-spark';
    spark.setAttribute('aria-label', 'Open TAB Settings');
    spark.innerHTML = '✦';

   // Create overlay panel
   const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.innerHTML = `
        <div class="tab-panel-header">
              <h2>TAB Overlay</h2>
                    <button class="tab-close">×</button>
                        </div>
                            <div class="tab-panel-content">
                                  <p>TAB AI Assistant is active.</p>
                                        <p>Click the spark button or press <kbd>Ctrl</kbd>+<kbd>;</kbd> to toggle this panel.</p>
                                              <div class="tab-status">
                                                      <span class="tab-chip">Mode: Local-Only</span>
                                                              <span class="tab-chip">Sensing: S0</span>
                                                                    </div>
                                                                        </div>
                                                                          `;

   // State
   let isOpen = false;

   // Toggle panel
   function togglePanel() {
         isOpen = !isOpen;
         panel.classList.toggle('tab-panel-visible', isOpen);
         spark.classList.toggle('tab-spark-active', isOpen);
   }

   // Event listeners
   spark.addEventListener('click', togglePanel);
    panel.querySelector('.tab-close').addEventListener('click', togglePanel);

   // Keyboard shortcut
   document.addEventListener('keydown', (e) => {
         if ((e.ctrlKey || e.metaKey) && e.key === ';') {
                 e.preventDefault();
                 togglePanel();
         }
   });

   // Inject elements
   document.body.appendChild(spark);
    document.body.appendChild(panel);

   console.log('TAB Overlay loaded successfully');
})();
