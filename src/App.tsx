/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import DremiCore from './components/DremiCore';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import CodingWorkshop from './components/CodingWorkshop';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('core');
  const [showPermissions, setShowPermissions] = useState(true);

  const requestPermissions = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      setShowPermissions(false);
    } catch (err) {
      console.error("Permissions denied", err);
      setShowPermissions(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'core': return <DremiCore />;
      case 'chat': return <ChatInterface />;
      case 'sys': return <Dashboard />;
      case 'vibe': return <CodingWorkshop />;
      default: return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence>
        {showPermissions && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg p-8 flex flex-col items-center justify-center text-center gap-8"
          >
            <div className="branding text-4xl">
              Dremi<span>.ai</span>
            </div>
            <div className="flex flex-col gap-4 max-w-sm">
              <h2 className="text-xl font-serif italic">Neural Link Required</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                To operate effectively, Dremi requires access to your system's voice interface and presence sensors.
              </p>
            </div>
            <button 
              onClick={requestPermissions}
              className="bg-accent px-12 py-4 rounded-full font-bold text-sm shadow-xl shadow-accent/20 active:scale-95 transition-all"
            >
              INITIALIZE CONNECTION
            </button>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">
              Secure E2EE Channel • PWA Optimized
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
