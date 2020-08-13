import { withFields, string, number, boolean } from "@commodo/fields";

const Author = withFields({
  firstName: string(),
  lastName: string(),
  age: number(),
  isFamous: boolean()
})();

console.log(typeof Author);

const author = new Author();
console.log(author);

author.firstName = "John";
author.lastName = "Doe";
author.age = 25;
author.isFamous = false;

console.log(author.firstName);
console.log(author.age);

const author2 = new Author();
author2.populate({
  firstName: "Jane",
  lastName: "Doe",
  age: 26,
  isFamous: true
});

console.log(author2.firstName);
console.log(author2.age);
