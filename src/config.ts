const url = process.env.NODE_ENV === 'production'
  ? 'https://paper-soccer-be.herokuapp.com'
  : 'https://localhost:3001';

const config = {
  serverBaseUrl: url,
};

export { config };
