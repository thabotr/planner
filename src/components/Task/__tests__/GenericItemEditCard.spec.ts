import GenericItemEditCard from "@/components/Task/GenericItemEditCard.vue";
import { TimeInMillis, toSubjectiveEffortScore, verboseTimestamp } from "@/middleware/helpers";
import ItemType from "@/types/ItemType";
import { beforeEach, describe, expect, it } from "vitest";
import { CustomVueWrapper } from "../../__tests__/utils";

describe('GenericItemEditCard', () => {
    const defaultItem = new ItemType(30 * TimeInMillis.Minute, 50, 50, "id");
    const renderComponent = () =>
        new CustomVueWrapper(GenericItemEditCard, {
            props: {
                item: defaultItem,
                itemType: "itemTypeGoesHere",
            },
            slots: {
                default: 'Default',
                header: 'Some header content goes here',
            }
        });
    let wrapper: CustomVueWrapper;
    beforeEach(() => {
        wrapper = renderComponent();
    });
    it('renders correctly', () => {
        expect(wrapper.wrapper.html()).toMatchSnapshot();
    });
    const assertEmmitedEvent = async (name: string) => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty(name);
        await wrapper.click(name);
        expect(wrapper.wrapper.emitted()).toHaveProperty(name);
    };
    it("emits 'delete' event on click delete", async () => {
        await assertEmmitedEvent('delete');
    });
    it("emits 'cancel' event on click cancel", async () => {
        await assertEmmitedEvent('cancel');
    });
    const effortScoreStep = 10;
    it("increments mental effort points on click increment mes", async () => {
        const increasedMes = defaultItem.mES + effortScoreStep;
        const meSMessage = `${toSubjectiveEffortScore(increasedMes)} mental EP`;
        expect(wrapper.wrapper.html()).not.toContain(meSMessage)
        await wrapper.click('increment mes');
        expect(wrapper.wrapper.html()).toContain(meSMessage);
    });
    it("decrements mental effort points on click decrement mes", async () => {
        const decreasedMes = defaultItem.mES - effortScoreStep;
        const mesMessage = `${toSubjectiveEffortScore(decreasedMes)} mental EP`;
        expect(wrapper.wrapper.html()).not.toContain(mesMessage)
        await wrapper.click('decrement mes');
        expect(wrapper.wrapper.html()).toContain(mesMessage);
    });
    it("increments physical effort points on click increment pes", async () => {
        const increasedPes = defaultItem.pES + effortScoreStep;
        const pesMessage = `${toSubjectiveEffortScore(increasedPes)} physical EP`;
        expect(wrapper.wrapper.html()).not.toContain(pesMessage);
        await wrapper.click('increment pes');
        expect(wrapper.wrapper.html()).toContain(pesMessage);
    });
    it("decrements physical effort points on click decrement pes", async () => {
        const decreasedPes = defaultItem.pES - effortScoreStep;
        const pesMessage = `${toSubjectiveEffortScore(decreasedPes)} physical EP`;
        expect(wrapper.wrapper.html()).not.toContain(pesMessage);
        await wrapper.click('decrement pes');
        expect(wrapper.wrapper.html()).toContain(pesMessage);
    });
    const fiveMinutes = 5 * TimeInMillis.Minute;
    it("increments time by five minutes on click increment time", async () => {
        const increasedTime = defaultItem.length + fiveMinutes;
        const increasedTimeMsg = verboseTimestamp(increasedTime);
        expect(wrapper.wrapper.html()).not.toContain(increasedTimeMsg);
        await wrapper.click('increment time');
        expect(wrapper.wrapper.html()).toContain(increasedTimeMsg);
    });
    it("decrements time on click decrement time", async () => {
        const decreasedTime = defaultItem.length - fiveMinutes;
        const decreasedTimeMsg = verboseTimestamp(decreasedTime);
        expect(wrapper.wrapper.html()).not.toContain(decreasedTimeMsg);
        await wrapper.click('decrement time');
        expect(wrapper.wrapper.html()).toContain(decreasedTimeMsg);
    });
    it("emits 'save' event with the contents of the updated item on click save", async () => {
        expect(wrapper.wrapper.emitted()).not.toHaveProperty('save');
        const updatedItem = new ItemType(
            defaultItem.length + fiveMinutes,
            defaultItem.mES + effortScoreStep,
            defaultItem.pES + effortScoreStep,
            defaultItem.id,
        );
        await wrapper.click('increment time');
        await wrapper.click('increment mes');
        await wrapper.click('increment pes');
        await wrapper.click('save');
        
        expect(wrapper.wrapper.emitted()).toHaveProperty('save');
        const [saveEventData] = wrapper.wrapper.emitted()['save'];
        const itemFromSaveEvent = (saveEventData as ItemType[])[0];
        expect(itemFromSaveEvent).toStrictEqual(updatedItem);
    });
});