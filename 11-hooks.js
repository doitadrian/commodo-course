import { withFields, string, number } from "@commodo/fields";
import { pipe } from "ramda";
import { withProps } from "repropose";
import { withHooks } from "@commodo/hooks";

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  try {
    const Book = pipe(
      withFields({
        title: string(),
        views: number({ value: 0 })
      }),
      withProps({
        async incrementViews(increment = 1) {
          this.views = this.views + increment;
          await this.hook("viewsIncremented", increment);
        }
      }),
      withHooks({
        async viewsIncremented(increment) {
          console.log(
            `Views incremented on the ${this.title} book by ${increment}.`
          );
        }
      })
    )();

    const bookA = new Book();
    bookA.title = "Book A";
    await bookA.incrementViews(10);
    console.log("Book A views:", bookA.views);

    const bookB = new Book();
    bookB.title = "Book B";
    await bookB.incrementViews(20);
    console.log("Book B views:", bookB.views);
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
