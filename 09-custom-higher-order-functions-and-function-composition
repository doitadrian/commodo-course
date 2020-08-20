import { withFields, string } from "@commodo/fields";
import { pipe } from "ramda";

const withAddress = () => (Model) =>
  withFields({
    country: string(),
    street: string(),
    city: string(),
    state: string(),
    zip: string()
  })(Model);

// const Customer = withAddress()(
//   withFields({
//     firstName: string(),
//     lastName: string()
//   })()
// );

// const Company = withAddress()(
//   withFields({
//     name: string()
//   })()
// );

const Customer = pipe(
  withAddress(),
  withFields({
    firstName: string(),
    lastName: string()
  })
)();

const Company = pipe(
  withAddress(),
  withFields({
    name: string()
  })
)();

const customer = new Customer();
customer.firstName = "John";
customer.lastName = "Doe";
customer.city = "New York";

console.log("Customer name:", customer.firstName + " " + customer.lastName);
console.log("Customer city:", customer.city);

const company = new Company();
company.name = "ACME";
company.city = "Boston";

console.log("Company name:", company.name);
console.log("Company city:", company.city);
