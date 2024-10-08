import { Car } from 'types/graphql';

export default {
  Query: {
    GetCars(parent: any, ctx: any): Car[] {
      return [];
    },
    GetCar(parent: any, ctx: any): Car {
      return {
        model: 'Renault',
        series: 'Fluence',
        productionYear: 2018
      };
    }
  }
};
