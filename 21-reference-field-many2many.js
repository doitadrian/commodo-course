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
    const Author2Book = pipe(
      withBase(),
      withName("Author2Book"),
      withFields(() => ({
        author: ref({ instanceOf: Author }),
        book: ref({ instanceOf: Book })
      }))
    )();

    const Book = pipe(
      withBase(),
      withName("Book"),
      withFields(() => ({
        authors: ref({ list: true, instanceOf: Author, using: Author2Book }),
        title: string({
          validation: (value) => {
            if (!value) {
              throw new Error("A book must have a title.");
            }
          }
        })
      }))
    )();

    const Author = pipe(
      withBase(),
      withName("Author"),
      withFields(() => ({
        nickname: string({
          validation: (value) => {
            if (!value) {
              throw new Error("An author must have a nickname.");
            }
          }
        }),
        books: ref({
          list: true,
          instanceOf: Book,
          using: Author2Book
        })
      }))
    )();

    const author = new Author();
    await author
      .populate({
        nickname: "AwesomeAuthor"
      })
      .save();

    const book1 = new Book();
    await book1
      .populate({
        title: "First book",
        authors: [author]
      })
      .save();

    const book2 = new Book();
    await book2
      .populate({
        title: "Second book",
        authors: [author]
      })
      .save();

    const authorsBooks = await author.books;
    console.log(
      `Author1's books: `,
      authorsBooks.map((item) => item.title).join(", ")
    );

    let foundAuthor2BookEntries = await Author2Book.getStorageDriver()
      .getDatabase()
      .collection("Author2Book")
      .find();

    console.log(
      `There is a total of ${foundAuthor2BookEntries.length} entries in the "Author2Book" table:`
    );

    console.log(foundAuthor2BookEntries);

    author.books = [];
    await author.save();

    foundAuthor2BookEntries = await Author2Book.getStorageDriver()
      .getDatabase()
      .collection("Author2Book")
      .find();

    console.log(
      `After unlinking, there is a total of ${foundAuthor2BookEntries.length} entries in the "Author2Book" table.`
    );
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", JSON.stringify(e.data, null, 2));
  }
})();
