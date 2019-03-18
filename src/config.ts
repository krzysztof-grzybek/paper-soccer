const url = process.env.NODE_ENV === 'production'
  ? 'https://paper-soccer-be.herokuapp.com:8312'
  : 'https://localhost:3001';

const config = {
  serverBaseUrl: url,
};

export { config };
