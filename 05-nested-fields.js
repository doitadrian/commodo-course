import { withFields, string, number, boolean, fields } from "@commodo/fields";

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword and make our code look nicer.
(async () => {
  try {
    const Stats = withFields({
      views: number(),
      books: number(),
      awards: number({
        validation: (value) => {
          if (value < 0) {
            throw new Error(
              "Awards count must be greater than or equal to zero."
            );
          }
        }
      })
    })();

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
      isFamous: boolean(),
      stats: fields({
        instanceOf: Stats,
        validation: (value) => {
          if (!value) {
            throw new Error("Stats are required.");
          }
        }
      })
    })();

    const author = new Author();
    author.populate({
      firstName: "John",
      lastName: "Doe",
      age: 25,
      isFamous: false,
      stats: {
        views: 150,
        books: 7,
        awards: 1
      }
    });

    const stats = new Stats();
    stats.populate({
      views: 150,
      books: 7,
      awards: -1
    });

    author.populate({
      firstName: "John",
      lastName: "Doe",
      age: 25,
      isFamous: false,
      stats: stats
    });

    await author.validate();
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
