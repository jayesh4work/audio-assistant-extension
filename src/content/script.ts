import { logger } from '../shared/utils/logger';
import { monitorAudio } from './audio-monitor';

logger.info('Enhanced Audio Assistant content script injected');

monitorAudio();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({ title: document.title, url: location.href });
  }
});
