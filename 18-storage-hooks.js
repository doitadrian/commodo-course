const { withFields, string, boolean } = require("@commodo/fields");
const { pipe } = require("ramda");
const { withStorage } = require("@commodo/fields-storage");
const { withHooks } = require("@commodo/hooks");
const { withName } = require("@commodo/name");
const { NeDbDriver, withId } = require("@commodo/fields-storage-nedb");

const sendPasswordChangedEmail = async (email) => {
  console.log(`Dear ${email}, your password has changed! Was that really you?`);
};

// We've wrapped this code sample into an async function, so we can
// make function calls with the await keyword, and make our code look nicer.
(async () => {
  try {
    const User = pipe(
      withName("User"),
      withId(),
      withFields({
        email: string(),
        password: string(),
        hasUnpaidBills: boolean()
      }),
      withHooks({
        beforeUpdate() {
          if (this.password) {
            const remove = this.hook("afterSave", async () => {
              remove();
              await sendPasswordChangedEmail(this.email);
              this.getField("password").reset();
            });
          }
        }
      }),
      withStorage({
        driver: new NeDbDriver()
      }),
      withHooks({
        beforeSave() {},
        afterSave() {},
        beforeUpdate() {},
        afterUpdate() {},
        beforeCreate() {},
        afterCreate() {}
      }),
      withHooks({
        beforeDelete() {
          if (this.hasUnpaidBills) {
            throw new Error(
              "Cannot delete the user - there are unpaid biils that need to be sorted first."
            );
          }
        }
      })
    )();

    const user = new User();
    user.email = "user@xyz.dev";
    user.password = "12345678";
    await user.save();

    user.password = "87654321";
    await user.save();

    user.hasUnpaidBills = true;
    await user.delete();
  } catch (e) {
    console.log("Error message: ", e.message);
    console.log("Error data: ", e.data);
  }
})();
