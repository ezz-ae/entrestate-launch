import { compileWithRules } from '@/lib/server/edits/compiler/rules';

export function compileEditRequest(rawText: string) {
  return {
    rawText,
    tasks: compileWithRules(rawText),
    compiledAt: new Date().toISOString(),
  };
}
