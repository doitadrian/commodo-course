const { withFields, string } = require("@commodo/fields");
const { pipe } = require("ramda");
const { withStorage } = require("@commodo/fields-storage");
const { ref } = require("@commodo/fields-storage-ref");
const { withName } = require("@commodo/name");
const { NeDbDriver, withId } = require("@commodo/fields-storage-nedb");

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  // With the base model factory, we can reduce the amount of copied code.
  const withBase = () => (Model) => {
    return pipe(
      withId(),
      withStorage({
        driver: new NeDbDriver()
      })
    )(Model);
  };

  try {
    const Book = pipe(
      withBase(),
      withName("Book"),
      withFields({
        title: string({
          validation: (value) => {
            if (!value) {
              throw new Error("A book must have a title.");
            }
          }
        })
      })
    )();

    const Author = pipe(
      withBase(),
      withName("Author"),
      withFields({
        nickname: string({
          validation: (value) => {
            if (!value) {
              throw new Error("An author must have a nickname.");
            }
          }
        }),
        favoriteBooks: ref({
          list: true,
          instanceOf: Book
        })
      })
    )();

    const book1 = new Book();
    book1.populate({
      title: "First book"
    });

    const book2 = new Book();
    book2.populate({
      title: "Second book"
    });

    const author = new Author();
    author.populate({
      nickname: "AwesomeAuthor",
      favoriteBooks: [book1, book2]
    });

    console.log("woah");
    await author.save();

    let foundBooks = await book1
      .getStorageDriver()
      .getDatabase()
      .collection("Book")
      .find();
    console.log(`Before delete, we have ${foundBooks.length} in the database.`);
    await author.delete();

    foundBooks = await book1
      .getStorageDriver()
      .getDatabase()
      .collection("Book")
      .find();
    console.log(`After delete, we have ${foundBooks.length} in the database.`);
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", JSON.stringify(e.data, null, 2));
  }
})();
