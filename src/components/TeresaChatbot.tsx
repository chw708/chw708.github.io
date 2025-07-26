/**
 * Teresa Chatbot Integration for Teresa Health App
 * Adds the embeddable chatbot widget to the main health tracking application
 */

import { useEffect, useRef } from 'react';

// Type definition for the global TeresaChatbot
declare global {
  interface Window {
    TeresaChatbotSpark: {
      init: (config?: any) => any;
    } | undefined;
    teresaChatbotSpark: any;
    teresaChatbotSparkInitialized: boolean | undefined;
  }
}

export const useTeresaChatbot = () => {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) {
      return;
    }

    // Check if the chatbot is already loaded
    if (window.TeresaChatbotSpark) {
      initialized.current = true;
      return;
    }

    // Check if the script is already in the DOM
    const existingScript = document.querySelector('script[src="/src/teresa-chatbot-spark.js"]');
    if (existingScript) {
      initialized.current = true;
      return;
    }

    // Load the Spark-integrated chatbot script dynamically
    const script = document.createElement('script');
    script.src = '/src/teresa-chatbot-spark.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Initialize the chatbot with Teresa Health branding
      try {
        if (window.TeresaChatbotSpark && !window.teresaChatbotSpark) {
          window.TeresaChatbotSpark.init({
            buttonText: 'Talk to Teresa 💚',
            primaryColor: '#1B4D3E',
            backgroundColor: '#FCF4DF',
            position: 'bottom-right',
            zIndex: 1000,
            useSparkAPI: true // Use Spark's built-in LLM API
          });
        }
        initialized.current = true;
      } catch (error) {
        console.error('Error initializing Teresa Chatbot:', error);
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Teresa Chatbot script');
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
  // Only load chatbot once at the app level
  useTeresaChatbot();
  return <>{children}</>;
};