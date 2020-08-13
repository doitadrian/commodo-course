import { withFields, string, number, boolean } from "@commodo/fields";

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  try {
    const Author = withFields({
      firstName: string(),
      lastName: string(),
      age: number({
        validation: (value) => {
          if (value < 25) {
            throw new Error("Author must be at least 25 years old.");
          }
        }
      }),
      isFamous: boolean()
    })();

    const author = new Author();
    author.populate({
      firstName: "John",
      lastName: "Doe",
      age: 25,
      isFamous: false
    });

    author.age = 24;
    await author.validate();
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
