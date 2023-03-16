import GenericCardVue from "@/components/Task/GenericCard.vue";
import ItemType from "@/types/ItemType";
import { describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../../__tests__/utils";

describe('Card', () => {
    const wrapper = new CustomVueWrapper(GenericCardVue, {
        props: {
            item: new ItemType(1_000_000, 19, 70, "id"),
        },
        slots: {
            default: 'Default',
            actions: 'Actions go here',
            controls: 'Card effort controls go here',
        }
    });
    it('renders correctly', () => {
        expect(wrapper.wrapper.html()).toMatchSnapshot();
    });
})