// Vehicle base class
class Vehicle {
    constructor(make, model) {
      this.make = make;
      this.model = model;
    }
  
    getInfo() {
      return `${this.make} ${this.model}`;
    }
  }
  
  // Specific vehicle types
  class Car extends Vehicle {
    getInfo() {
      return `Car: ${super.getInfo()}, 4 wheels`;
    }
  }
  
  class Motorcycle extends Vehicle {
    getInfo() {
      return `Motorcycle: ${super.getInfo()}, 2 wheels`;
    }
  }
  
  class Truck extends Vehicle {
    getInfo() {
      return `Truck: ${super.getInfo()}, 6 wheels`;
    }
  }
  
  // Vehicle Factory
  class VehicleFactory {
    createVehicle(type, make, model) {
      switch (type.toLowerCase()) {
        case 'car':
          return new Car(make, model);
        case 'motorcycle':
          return new Motorcycle(make, model);
        case 'truck':
          return new Truck(make, model);
        default:
          throw new Error('Invalid vehicle type');
      }
    }
  }
  
  // Usage
  const factory = new VehicleFactory();
  
  const car = factory.createVehicle('car', 'Toyota', 'Corolla');
  const motorcycle = factory.createVehicle('motorcycle', 'Harley-Davidson', 'Sportster');
  const truck = factory.createVehicle('truck', 'Ford', 'F-150');
  
  console.log(car.getInfo());
  console.log(motorcycle.getInfo());
  console.log(truck.getInfo());
  
  // Try creating an invalid vehicle type
  try {
    const invalidVehicle = factory.createVehicle('boat', 'Yamaha', 'Speedboat');
  } catch (error) {
    console.error(error.message);
  }