import GenericCardVue from "@/components/Task/GenericCard.vue";
import { describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../utils";

describe('Card', () => {
    const wrapper = new CustomVueWrapper(GenericCardVue, {
        props: {
            id: "id",
            mES: 19,
            pES: 70,
            length: 1_000_000,
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