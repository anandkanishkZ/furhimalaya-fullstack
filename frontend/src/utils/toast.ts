interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

class ToastManager {
  private container: HTMLElement | null = null;
  private toastCount = 0;

  private createContainer() {
    if (this.container) return this.container;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(this.container);
    
    return this.container;
  }

  show(message: string, options: ToastOptions = {}) {
    const {
      type = 'info',
      duration = 4000,
      position = 'top-right'
    } = options;

    const container = this.createContainer();
    const toastId = `toast-${++this.toastCount}`;
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `
      transform transition-all duration-300 ease-in-out
      max-w-sm w-full shadow-lg rounded-lg pointer-events-auto
      overflow-hidden ring-1 ring-black ring-opacity-5
      ${type === 'success' ? 'bg-green-50 border-green-200' : ''}
      ${type === 'error' ? 'bg-red-50 border-red-200' : ''}
      ${type === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}
      ${type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
      translate-x-full opacity-0
    `;

    const iconMap = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const colorMap = {
      success: 'text-green-800',
      error: 'text-red-800', 
      warning: 'text-yellow-800',
      info: 'text-blue-800'
    };

    toast.innerHTML = `
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span class="text-lg ${colorMap[type]}">${iconMap[type]}</span>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium ${colorMap[type]}">${message}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="rounded-md inline-flex ${colorMap[type]} hover:${colorMap[type]} focus:outline-none" onclick="this.closest('[id^=toast-]').remove()">
              <span class="sr-only">Close</span>
              <span class="text-sm">×</span>
            </button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.className = toast.className.replace('translate-x-full opacity-0', 'translate-x-0 opacity-100');
    }, 10);

    // Auto remove
    setTimeout(() => {
      if (toast.parentElement) {
        toast.className = toast.className.replace('translate-x-0 opacity-100', 'translate-x-full opacity-0');
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }
    }, duration);
  }

  success(message: string, duration?: number) {
    this.show(message, { type: 'success', duration });
  }

  error(message: string, duration?: number) {
    this.show(message, { type: 'error', duration });
  }

  warning(message: string, duration?: number) {
    this.show(message, { type: 'warning', duration });
  }

  info(message: string, duration?: number) {
    this.show(message, { type: 'info', duration });
  }
}

export const toast = new ToastManager();