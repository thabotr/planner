import UnscheduledTaskCardVue from "@/components/Task/UnscheduledTaskCard.vue";
import DescriptiveItemType from "@/types/DescriptiveItemType";
import { beforeEach, describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../utils";

describe('UnscheduledTaskCard', () => {
    let wrapper: CustomVueWrapper;
    const item: DescriptiveItemType = new DescriptiveItemType(
        "id", 1_000_000, 70, 19, "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    );
    beforeEach(() => {
        wrapper = new CustomVueWrapper(UnscheduledTaskCardVue, {
            props: { item: item, },
        });
    });
    it('renders correctly', () => {
        expect(wrapper.wrapper.html()).toMatchSnapshot();
    });
    it("emits all the drag events occuring on the drag action", async () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('drag');
        await wrapper.findByLabel('drag').trigger('drag');
        expect(wrapper.wrapper.emitted()).toHaveProperty('drag');

        expect(wrapper.wrapper.emitted()).not.toHaveProperty('dragstart');
        await wrapper.findByLabel('drag').trigger('dragstart');
        expect(wrapper.wrapper.emitted()).toHaveProperty('dragstart');

        expect(wrapper.wrapper.emitted()).not.toHaveProperty('dragend');
        await wrapper.findByLabel('drag').trigger('dragend');
        expect(wrapper.wrapper.emitted()).toHaveProperty('dragend');

        expect(wrapper.wrapper.emitted()).not.toHaveProperty('drop');
        await wrapper.findByLabel('drag').trigger('drop');
        expect(wrapper.wrapper.emitted()).toHaveProperty('drop');
    });
    it("emits 'delete' event on click delete action", async () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('delete');
        await wrapper.click('delete');
        expect(wrapper.wrapper.emitted()).toHaveProperty('delete');
    });
    it("emits 'edit' event on click edit action", async () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('edit');
        await wrapper.click('edit');
        expect(wrapper.wrapper.emitted()).toHaveProperty('edit');
    });
})