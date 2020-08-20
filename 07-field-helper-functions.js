import {
  withFields,
  string,
  number,
  boolean,
  fields,
  onSet,
  onGet,
  setOnce,
  skipOnPopulate
} from "@commodo/fields";

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  try {
    const Stats = withFields({
      views: number(),
      books: number(),
      awards: number()
    })();

    const Author = withFields({
      firstName: onSet((value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      })(string()),
      lastName: onSet((value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      })(string()),
      age: number(),
      avatar: onGet((value) => {
        return "https://mysite.com/images/" + value;
      })(string()),
      active: setOnce()(boolean()),
      stats: skipOnPopulate()(
        fields({
          instanceOf: Stats
        })
      )
    })();

    const author = new Author();
    author.populate({
      firstName: "john",
      lastName: "doe",
      age: 10,
      avatar: "myAvatar.jpg",
      stats: {
        views: 12
      }
    });

    console.log(`First name: `, author.firstName);
    console.log(`Last name: `, author.lastName);

    console.log(`Avatar : `, author.avatar);

    author.active = true;
    author.active = false;
    console.log(`Active: `, author.active);

    console.log(`Stats: `, author.stats);

    author.stats = {
      views: 13
    };
    console.log(`Stats.views: `, author.stats.views);
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
