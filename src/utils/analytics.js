// Google Analytics event tracking utility

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Pre-defined event trackers for common actions
export const analytics = {
  // Terminal events
  terminalCommand: (command) => {
    trackEvent('terminal_command', {
      event_category: 'Terminal',
      event_label: command,
    });
  },

  terminalAskAI: (question) => {
    trackEvent('terminal_ask_ai', {
      event_category: 'Terminal',
      event_label: question.substring(0, 100), // Truncate for privacy
    });
  },

  // AI Chat events
  askAIQuestion: (question) => {
    trackEvent('ask_ai_question', {
      event_category: 'AI Chat',
      event_label: question.substring(0, 100),
    });
  },

  // Books events
  bookClick: (bookTitle) => {
    trackEvent('book_click', {
      event_category: 'Books',
      event_label: bookTitle,
    });
  },

  bookPopupOpen: (bookTitle) => {
    trackEvent('book_popup_open', {
      event_category: 'Books',
      event_label: bookTitle,
    });
  },

  // Projects events
  projectClick: (projectTitle) => {
    trackEvent('project_click', {
      event_category: 'Projects',
      event_label: projectTitle,
    });
  },

  projectPopupOpen: (projectTitle) => {
    trackEvent('project_popup_open', {
      event_category: 'Projects',
      event_label: projectTitle,
    });
  },

  // Software events
  softwareClick: (softwareTitle) => {
    trackEvent('software_click', {
      event_category: 'Software',
      event_label: softwareTitle,
    });
  },

  // Navigation events
  navClick: (destination) => {
    trackEvent('navigation_click', {
      event_category: 'Navigation',
      event_label: destination,
    });
  },

  // Feature card clicks on home page
  featureCardClick: (featureTitle) => {
    trackEvent('feature_card_click', {
      event_category: 'Home',
      event_label: featureTitle,
    });
  },

  // Dark mode toggle
  darkModeToggle: (isDarkMode) => {
    trackEvent('dark_mode_toggle', {
      event_category: 'Settings',
      event_label: isDarkMode ? 'enabled' : 'disabled',
    });
  },
};
