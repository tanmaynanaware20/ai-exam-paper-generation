export const validateDifficulty = (question) => {
  if (question.includes('Define')) return 'easy';
  if (question.includes('Explain')) return 'medium';
  if (question.includes('Analyze')) return 'hard';
};