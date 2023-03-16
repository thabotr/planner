import { TimeInMillis } from "@/middleware/helpers";
import ItemType from "@/types/ItemType";
import { describe, expect, it } from "vitest";
import TimeslotPreviewVue from "../TimeslotPreviewCard.vue";
import { CustomVueWrapper } from "./utils";

describe('TimeslotPreview', () => {
    const timeslot: ItemType = new ItemType(TimeInMillis.Day, 10, 20, "id");
    const usage: ItemType = new ItemType(TimeInMillis.Hour, 0, 10, "id");
    const wrapper = new CustomVueWrapper(TimeslotPreviewVue, {
        props: {
            timeslot: timeslot,
            usage: usage,
        },
    });
    it('renders correctly', () => {
        expect(wrapper.wrapper.html()).toMatchSnapshot();
    });
    it("emits 'edit' event on click edit", async () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('edit');
        wrapper.click('edit');
        expect(wrapper.wrapper.emitted()).toHaveProperty('edit');
    });
});