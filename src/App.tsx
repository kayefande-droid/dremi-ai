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
  const [isListening, setIsListening] = useState(false);

  const toggleListen = () => {
    setIsListening(!isListening);
    // In a real environment, we'd trigger Web Speech API here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setActiveTab('chat');
      }, 3000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'core': return <DremiCore isListening={isListening} onToggleListen={toggleListen} />;
      case 'chat': return <ChatInterface />;
      case 'sys': return <Dashboard />;
      case 'vibe': return <CodingWorkshop />;
      default: return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
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
