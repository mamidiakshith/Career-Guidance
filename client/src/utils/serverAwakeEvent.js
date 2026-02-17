// Simple event emitter for server status
const SERVER_AWAKE_EVENT = 'server-waking-up';
const SERVER_READY_EVENT = 'server-ready';

export const triggerServerWakingUp = () => {
    window.dispatchEvent(new Event(SERVER_AWAKE_EVENT));
};

export const triggerServerReady = () => {
    window.dispatchEvent(new Event(SERVER_READY_EVENT));
};

export const listenServerWakingUp = (callback) => {
    window.addEventListener(SERVER_AWAKE_EVENT, callback);
    return () => window.removeEventListener(SERVER_AWAKE_EVENT, callback);
};

export const listenServerReady = (callback) => {
    window.addEventListener(SERVER_READY_EVENT, callback);
    return () => window.removeEventListener(SERVER_READY_EVENT, callback);
};
