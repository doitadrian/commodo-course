import { withFields, string, number } from "@commodo/fields";
import { pipe } from "ramda";
import { withProps } from "repropose";
import { withHooks } from "@commodo/hooks";

const somePasswordChangedCheck = () => {
  return true;
};

const sendEmail = async () => {
  return true;
};

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
    },
    async beforeSave() {
      const passwordHasChanged = somePasswordChangedCheck();
      if (passwordHasChanged) {
        const removeHook = this.hook("afterSave", async () => {
          removeHook();
          await sendEmail();
        });
      }
    }
  })
)();
