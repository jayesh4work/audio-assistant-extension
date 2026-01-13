import { logger } from '../shared/utils/logger';
import { setupListeners } from './listeners';

chrome.runtime.onInstalled.addListener(() => {
  logger.info('Enhanced Audio Assistant installed');
});

setupListeners();
