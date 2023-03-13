import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    }
})

import TaskEditor from '../TaskEditor.vue';
import type { TaskType } from '@/middleware/helpers';

describe('TaskEditor', () => {
    const initTask = {
        description: "description1",
        id: "1",
        length: 0,
        mES: 0,
        pES: 0,
    } as TaskType;
    let wrapper: VueWrapper;
    it('renders the initial values', () => {
        expect(wrapper.text()).toContain(initTask.description);
        expect(wrapper.text()).toMatch(/.*0 minutes\s+0 hours\s+0 days.*/);
    });
    it('emits update:modelValue event with the correct task as the event data on click save', async () => {
        await wrapper.find('[aria-label="save task"]').trigger('click');

        const updateEventName = "update:modelValue";
        expect(wrapper.emitted()).toHaveProperty(updateEventName);
        expect(wrapper.emitted()[updateEventName]).toStrictEqual([[initTask]]);

    });
    it.skip('emits update:modelValue event with task containing all the custom input on click save', () => {
    });
    it('emits discard event on click discard', async () => {
        await wrapper.find('[aria-label="discard task"]').trigger('click');

        expect(wrapper.emitted()).toHaveProperty('discard');
    });
    beforeEach(() => {
        wrapper = mount(TaskEditor, {
            props: {
                modelValue: initTask
            },
            global: {
                plugins: [vuetify]
            }
        });
    });
})
