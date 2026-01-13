import { logger } from '../shared/utils/logger';

export const monitorAudio = () => {
  logger.info('Monitoring tab audio availability...');
  // In the future, this could use the Web Audio API to detect if audio is playing in the tab
};
