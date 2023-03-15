import { describe, it, expect, beforeEach } from "vitest";
import CreateItemGroupVue from "../CreateItemGroup.vue";
import { CustomVueWrapper } from "./utils";

describe('CreateItemGroup', () => {
    let wrapper: CustomVueWrapper;
    beforeEach(() => {
        wrapper = new CustomVueWrapper(CreateItemGroupVue);
    });
    const openCreateMenu = async () => {
        await wrapper.click("open create item menu");
    };
    it("can open and close the create item menu on press 'open/close create item menu'", async () => {
        expect(wrapper.findByLabel("create task").exists()).toBeFalsy();
        await openCreateMenu();
        expect(wrapper.findByLabel("create task").exists()).toBeTruthy();
        await wrapper.click("close create item menu");
        expect(wrapper.findByLabel("create task").exists()).toBeFalsy();
    });
    it("emits a 'create-task' event on press 'create task'", async () => {
        await openCreateMenu();
        await wrapper.click("create task");
        const emittedEvents = wrapper.wrapper.emitted();
        expect(emittedEvents).toHaveProperty('create-task');
    });
    it("emits a 'create-timeslot' event on press 'create timeslot'", async () => {
        await openCreateMenu();
        await wrapper.click("create timeslot");
        const emittedEvents = wrapper.wrapper.emitted();
        expect(emittedEvents).toHaveProperty('create-timeslot');
    });
});