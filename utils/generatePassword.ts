import generatePassword from 'generate-password';

export const createSecurePassword = (length = 8) => {
  return generatePassword.generate({
    length,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true,
    strict: true,
  });
};