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

    // findById
    const foundBook1 = await Book.findById(book1.id);
    const unknownBook1 = await Book.findById("xyz");

    console.log("Found book 1 title:", foundBook1.title);
    console.log("Unknown book: ", unknownBook1);

    // findOne
    await Book.findOne({ query: { numberOfPages: { $gte: 200 } } });

    const foundBook2 = await Book.findOne({ query: { title: "First book" } });
    const unknownBook2 = await Book.findOne({
      query: { title: "Unknown book" }
    });

    console.log("foundBook2.title:", foundBook2.title);
    console.log("unknownBook2: ", unknownBook2);

    // findOne - with sorting
    const foundBook3 = await Book.findOne({
      sort: { title: -1 }
    });

    console.log("foundBook3.title:", foundBook3.title);

    // // find
    // let books = await Book.find({
    //   query: {
    //     numberOfPages: { $gte: 200 }
    //   },
    //   sort: { id: 1 }
    // });

    // console.log("Found books:", books.length);
    // console.log("Book 1 title:", books[0].title);

    // books = await Book.find({
    //   query: {
    //     numberOfPages: { $gte: 100 }
    //   },
    //   sort: { id: 1 }
    // });

    // console.log("Found books:", books.length);
    // console.log("Book 1 title:", books[0].title);
    // console.log("Book 2 title:", books[1].title);
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
