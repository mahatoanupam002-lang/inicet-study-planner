export interface ServiceWorkerStatus {
  registered: boolean;
  ready: boolean;
  updateAvailable: boolean;
  error: Error | null;
}

let swStatus: ServiceWorkerStatus = {
  registered: false,
  ready: false,
  updateAvailable: false,
  error: null,
};

const listeners: Array<(status: ServiceWorkerStatus) => void> = [];

/**
 * Register service worker
 */
export async function registerServiceWorker(scriptUrl: string = "/sw.js"): Promise<ServiceWorkerStatus> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    swStatus.error = new Error("Service Workers not supported");
    notifyListeners();
    return swStatus;
  }

  try {
    const registration = await navigator.serviceWorker.register(scriptUrl, {
      scope: "/",
    });

    swStatus.registered = true;
    swStatus.error = null;

    // Check for updates periodically
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "activated") {
            swStatus.updateAvailable = true;
            notifyListeners();
          }
        });
      }
    });

    // Check if controller is already active
    if (navigator.serviceWorker.controller) {
      swStatus.ready = true;
    } else {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        swStatus.ready = true;
        notifyListeners();
      });
    }

    notifyListeners();
    return swStatus;
  } catch (error) {
    swStatus.error = error instanceof Error ? error : new Error(String(error));
    swStatus.registered = false;
    notifyListeners();
    return swStatus;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    swStatus.registered = false;
    swStatus.ready = false;
    notifyListeners();
    return true;
  } catch (error) {
    swStatus.error = error instanceof Error ? error : new Error(String(error));
    notifyListeners();
    return false;
  }
}

/**
 * Get current service worker status
 */
export function getServiceWorkerStatus(): ServiceWorkerStatus {
  return { ...swStatus };
}

/**
 * Check for service worker updates
 */
export async function checkForServiceWorkerUpdates(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.update();
    }
    return true;
  } catch (error) {
    swStatus.error = error instanceof Error ? error : new Error(String(error));
    return false;
  }
}

/**
 * Request update from service worker
 */
export async function requestServiceWorkerUpdate(): Promise<boolean> {
  const checked = await checkForServiceWorkerUpdates();
  if (checked && swStatus.updateAvailable) {
    // Reload page to activate new service worker
    window.location.reload();
    return true;
  }
  return false;
}

/**
 * Listen for service worker status changes
 */
export function onServiceWorkerStatusChange(
  listener: (status: ServiceWorkerStatus) => void
): () => void {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Send message to service worker
 */
export async function sendMessageToServiceWorker(message: unknown): Promise<void> {
  if (typeof window === "undefined" || !navigator.serviceWorker.controller) {
    throw new Error("Service Worker not available");
  }

  navigator.serviceWorker.controller.postMessage(message);
}

/**
 * Listen for messages from service worker
 */
export function onServiceWorkerMessage(
  handler: (event: any) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  navigator.serviceWorker.addEventListener("message", handler as EventListener);

  return () => {
    navigator.serviceWorker.removeEventListener("message", handler as EventListener);
  };
}

/**
 * Notify all listeners of status change
 */
function notifyListeners(): void {
  listeners.forEach(listener => listener({ ...swStatus }));
}

/**
 * Get service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations[0] ?? null;
  } catch {
    return null;
  }
}
