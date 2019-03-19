const url = process.env.NODE_ENV === 'production'
  ? 'https://paper-soccer-be.herokuapp.com:28512'
  : 'https://localhost:3001';

const config = {
  serverBaseUrl: url,
};

export { config };
