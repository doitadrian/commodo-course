import { withFields, string, number, boolean, fields } from "@commodo/fields";

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  try {
    const Stats = withFields({
      views: number(),
      books: number(),
      bestYears: number({ 
        list: true,
        validation: (value) => {
          // Since the received value can be null, we also check if the value is an array.
          if (Array.isArray(value) && value.length > 2) {
            throw new Error(
              "You can only set two best years in the author's carrers."
            );
          }
        }
      })
    })();

    const Author = withFields({
      firstName: string(),
      lastName: string(),
      age: number(),
      isFamous: boolean(),
      stats: fields({ instanceOf: Stats })
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
        bestYears: [2010, 2020, 2022]
      }
    });

    console.log("Best years:", author.stats.bestYears);

    await author.validate();
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
