const CarsTypedefs = `
	type Car {
		model: String!
		series: String!
		productionYear: Int!	
	}
	
	type Query {
		GetCars: [Car]
		GetCar(id: Int!): Car
	}
`;

export default CarsTypedefs;
