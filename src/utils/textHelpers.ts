/**
 * Count words in a string
 * Handles multiple spaces, newlines, and punctuation
 */
export const countWords = (text: string): number => {
  if (!text.trim()) return 0;
  
  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Get remaining words from limit
 */
export const getRemainingWords = (text: string, limit: number): number => {
  const wordCount = countWords(text);
  return Math.max(0, limit - wordCount);
};

/**
 * Check if text exceeds word limit
 */
export const exceedsWordLimit = (text: string, limit: number): boolean => {
  return countWords(text) > limit;
};

/**
 * Get word count display message
 */
export const getWordCountMessage = (text: string, limit: number): string => {
  const wordCount = countWords(text);
  const remaining = limit - wordCount;
  
  if (remaining < 0) {
    return `${Math.abs(remaining)} words over limit`;
  } else if (remaining <= 20) {
    return `${remaining} words remaining`;
  }
  
  return `${wordCount} / ${limit} words`;
};