import ActiveTaskCard from "@/components/Task/ActiveTaskCard.vue";
import { TimeInMillis } from "@/middleware/helpers";
import DescriptiveItemType from "@/types/DescriptiveItemType";
import { describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../../__tests__/utils";

describe('ActiveTaskCard', () => {
    const wrapper = new CustomVueWrapper(ActiveTaskCard, {
        props: {
            task: new DescriptiveItemType(
                '13', 30 * TimeInMillis.Minute, 10, 10, 'this is a task description ',
            ),
        },
    });
    it('renders correctly', () => {
        expect(wrapper.wrapper.html()).toMatchSnapshot();
    });
    it("emits 'unschedule' event when unschedule is click", () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('unschedule');
        wrapper.click('unschedule');
        expect(wrapper.wrapper.emitted()).toHaveProperty('unschedule');
    });
    it("emits 'done' event when done is clicked", () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('done');
        wrapper.click('done');
        expect(wrapper.wrapper.emitted()).toHaveProperty('done');
    });
})