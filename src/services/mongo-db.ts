import mongoose, { Mongoose } from 'mongoose';

export function initConnection(): Promise<Mongoose> {
  return mongoose.connect('mongodb://127.0.0.1:27017/test').then(con => {
    console.log('Connected successfully to database!!!');
    return con as Mongoose;
  });
}
