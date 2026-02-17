import { useState, useEffect } from 'react';
import { listenServerWakingUp, listenServerReady } from '../utils/serverAwakeEvent';
import { motion, AnimatePresence } from 'framer-motion';
import { FaServer } from 'react-icons/fa';

const ServerAwakeMessage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const show = () => setIsVisible(true);
        const hide = () => {
            // Delay hiding slightly to prevent flickering
            setTimeout(() => setIsVisible(false), 2000);
        };

        const cleanupWake = listenServerWakingUp(show);
        const cleanupReady = listenServerReady(hide);

        return () => {
            cleanupWake();
            cleanupReady();
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        background: '#3b82f6',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontWeight: '500'
                    }}
                >
                    <FaServer className="animate-pulse" />
                    <span>Server is waking up, please wait...</span>
                    <div className="spinner" style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                        .animate-pulse {
                            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: .5; }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ServerAwakeMessage;
