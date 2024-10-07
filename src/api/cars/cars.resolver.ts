import { Car } from './types';

export default {
  Query: {
    GetCars(parent: any, ctx: any): Car[] {
      return [];
    },
    GetCar(parent: any, ctx: any): Car {
      return {
        id: 1,
        model: 'Renault',
        series: 'Fluence',
        productionYear: 2018
      };
    }
  }
};
