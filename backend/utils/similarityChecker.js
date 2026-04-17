export const similarityCheck = (oldText, newText) => {
  const oldWords = oldText.split(' ');
  const newWords = newText.split(' ');

  const common = oldWords.filter(word => newWords.includes(word));

  return common.length;
};