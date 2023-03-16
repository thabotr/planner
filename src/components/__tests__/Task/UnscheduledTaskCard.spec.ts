import UnscheduledTaskCardVue from "@/components/Task/UnscheduledTaskCard.vue";
import { readFileSync } from "fs";
import { beforeEach, describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../utils";

describe('UnscheduledTaskCard', () => {
    let wrapper: CustomVueWrapper;
    beforeEach(() => {
        wrapper = new CustomVueWrapper(UnscheduledTaskCardVue, {
            props: {
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                id: "id",
                mES: 19,
                pES: 70,
                length: 1_000_000,
            },
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