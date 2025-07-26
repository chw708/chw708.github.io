/**
 * Teresa Chatbot Integration for Teresa Health App
 * Adds the embeddable chatbot widget to the main health tracking application
 */

import { useEffect } from 'react';

// Type definition for the global TeresaChatbot
declare global {
  interface Window {
    TeresaChatbotSpark: any;
    teresaChatbotSpark: any;
  }
}

export const useTeresaChatbot = () => {
  useEffect(() => {
    // Load the Spark-integrated chatbot script dynamically
    const script = document.createElement('script');
    script.src = '/src/teresa-chatbot-spark.js';
    script.async = true;
    
    script.onload = () => {
      // Initialize the chatbot with Teresa Health branding
      if (window.TeresaChatbotSpark) {
        window.TeresaChatbotSpark.init({
          buttonText: 'Talk to Teresa 💚',
          primaryColor: '#1B4D3E',
          backgroundColor: '#FCF4DF',
          position: 'bottom-right',
          zIndex: 1000,
          useSparkAPI: true // Use Spark's built-in LLM API
        });
      }
    };
    
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
};

export const TeresaChatbotProvider = ({ children }: { children: React.ReactNode }) => {
  useTeresaChatbot();
  return <>{children}</>;
};