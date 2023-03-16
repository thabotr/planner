import TaskEditCard from "@/components/Task/TaskEditCard.vue";
import { TimeInMillis } from "@/middleware/helpers";
import DescriptiveItemType from "@/types/DescriptiveItemType";
import { describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../../__tests__/utils";

describe('TaskEditCard', () => {
    const task = new DescriptiveItemType(
        "id", TimeInMillis.Hour, 10, 10, "description here"
    );
    const wrapper = new CustomVueWrapper(TaskEditCard, {
        props: {
            task: task,
        },
        slots: {
            default: 'Default',
            actions: 'Actions go here',
            controls: 'Card effort controls go here',
        },
    });
    it('renders correctly', () => {
        expect(wrapper.wrapper.html()).toMatchSnapshot();
    });
    it("emits 'save' with the updated task on click save", async () => {
        const updatedTask = new DescriptiveItemType(
            task.id, task.length, task.pES, task.mES, 'a different description',
        );
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('save');
        await wrapper.findByLabel('description').setValue(updatedTask.description);
        await wrapper.click('save');
        expect(wrapper.wrapper.emitted()).toHaveProperty('save');
        const [event] = wrapper.wrapper.emitted()['save'];
        const [emittedTask] = event as any[];
        expect(emittedTask).toStrictEqual(updatedTask);
    });
})