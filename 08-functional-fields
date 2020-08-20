import { withFields, string, onSet } from "@commodo/fields";
import slugify from "slugify";

const Book = withFields((instance) => ({
  title: onSet((value) => {
    instance.slug = slugify(value).toLowerCase();
    return value;
  })(string()),
  slug: string()
}))();

const book = new Book();
book.title = "A nice book"; // Must assign "a-nice-book" value to the "slug" field.

console.log(`Book title: `, book.title);
console.log(`Book slug: `, book.slug);
