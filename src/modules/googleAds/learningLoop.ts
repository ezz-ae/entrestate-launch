import { EventEmitter } from 'events';
import type { LearningSignal } from './types';

const learningEmitter = new EventEmitter();

export function emitLearningSignal(signal: LearningSignal) {
  learningEmitter.emit('learning:signal', signal);
}

export function onLearningSignal(handler: (signal: LearningSignal) => void) {
  learningEmitter.on('learning:signal', handler);
  return () => learningEmitter.off('learning:signal', handler);
}
