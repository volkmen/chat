import mongoose from 'mongoose';

export function initConnection() {
  return mongoose
    .connect('mongodb://127.0.0.1:27017/test')
    .then(con => {
      console.log('Connected successfully to database!!!');
      return con;
    })
    .catch(() => {
      console.warn('Connection failed!');
    });
}
