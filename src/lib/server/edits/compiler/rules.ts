import { SUPPORTED_INTENTS } from '@/lib/server/edits/compiler/intents';

export function compileWithRules(rawText: string) {
  const text = rawText.toLowerCase();
  const tasks: Array<Record<string, unknown>> = [];

  Object.values(SUPPORTED_INTENTS).forEach((intent) => {
    if (intent.keywords.some((keyword) => text.includes(keyword))) {
      tasks.push({
        intent: intent.id,
        requiredInputs: intent.requiredInputs,
      });
    }
  });

  if (!tasks.length) {
    tasks.push({ intent: 'generic.update', requiredInputs: ['details'] });
  }

  return tasks;
}
