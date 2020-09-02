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
        favoriteBook: ref({
          instanceOf: Book
          // autoDelete: true
        })
      })
    )();

    const book1 = new Book();
    book1.populate({
      title: "First book"
    });

    const author = new Author();
    author.populate({
      nickname: "AwesomeAuthor",
      favoriteBook: book1
    });

    await author.save();

    const book2 = new Book();
    book2.populate({
      title: "Second book"
    });
    await book2.save();

    const id = book2.id;
    console.log("Book2's ID: ", id);

    author.favoriteBook = id;
    await author.save();

    const authorFavoriteBookTitle = (await author.favoriteBook).title;
    console.log(`Author's favorite book: ${authorFavoriteBookTitle}`);

    const favoriteBook = await author.favoriteBook;
    console.log(`Author's favorite book: ${favoriteBook.title}`);

    await author.delete();
    const allBooks = await Book.getStorageDriver()
      .getDatabase()
      .collection("Book")
      .find();

    console.log(
      "After author model instance deletion, the following books are still in the database:"
    );
    console.log(allBooks);
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", JSON.stringify(e.data, null, 2));
  }
})();
