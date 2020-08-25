const { withFields, string, number } = require("@commodo/fields");
const { pipe } = require("ramda");
const { withStorage } = require("@commodo/fields-storage");
const { withName } = require("@commodo/name");
const { NeDbDriver, withId } = require("@commodo/fields-storage-nedb");

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  try {
    const Book = pipe(
      withName("Book"),
      withId(),
      withFields({
        title: string(),
        numberOfPages: number({
          value: 0,
          validation: (value) => {
            if (value > 1000) {
              throw new Error("A book cannot have more than 1000 pages.");
            }
          }
        })
      }),
      withStorage({
        driver: new NeDbDriver()
      })
    )();

    const book1 = new Book();

    book1.populate({
      title: "First book",
      numberOfPages: 100
    });
    await book1.save();

    const book2 = new Book();
    book2.populate({
      title: "Second book",
      numberOfPages: 200
    });

    await book2.save();

    book2.numberOfPages = 250;
    await book2.save();
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
