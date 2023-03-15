import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { mount } from "@vue/test-utils";
import type { DOMWrapper, VueWrapper } from '@vue/test-utils';

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

class CustomVueWrapper {
    wrapper: VueWrapper;
    constructor(component: any, options?: any) {
        this.wrapper = mount(component, {
            ...options,
            global: {
                plugins: [vuetify],
            }
        });
    }
    findByLabel(label: string): DOMWrapper<Element> {
        return this.wrapper.find(`[aria-label="${label}"]`);
    }
    async click(label: string) {
        return await this.findByLabel(label).trigger('click');
    }
}

export { CustomVueWrapper };