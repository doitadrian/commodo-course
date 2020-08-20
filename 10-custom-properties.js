import { withFields, string, number } from "@commodo/fields";
import { withProps, withStaticProps } from "repropose";
import { pipe } from "ramda";

const Book = pipe(
  withFields({
    title: string(),
    views: number({ value: 0 })
  }),
  withProps({
    get isPopular() {
      return this.views > Book.MIN_POPULAR_VIEWS;
    },
    incrementViews(increment = 1) {
      this.views = this.views + increment;
    }
  }),
  withStaticProps({
    MIN_POPULAR_VIEWS: 100
  })
)();

const book = new Book();
book.title = "A new book";
book.views = 50;

console.log("Book title:", book.title);
console.log("Book views:", book.views);
console.log("Book is popular:", book.isPopular);

book.incrementViews(100);
console.log("Book views:", book.views);
console.log("Book is popular:", book.isPopular);
