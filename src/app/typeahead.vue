<template>
    <span :id="spanId" :class="classes">
        <v-autocomplete
            ref="select"
            :id="id"
            :label="label"
            :placeholder="placeholder"
            :loading="loading"
            :prepend-icon="icon"
            required
            :debounce-search="debounceMillis"
            :items="items"
            :item-text="responseLabelField"
            :item-value="responseValueField"
            :search-input.sync="search"
            :value="curValue"
            @input="fireUpdateEvent($event)"
            ></v-autocomplete>
    </span>
</template>

<script lang="ts">
import Ajax, { QueryParams } from './ajax';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component
export default class Typeahead extends Vue {

    /**
     * "value" facilitates v-model support
     */
    @Prop({ required: true })
    value!: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    filterParamName: string;

    @Prop()
    responseLabelField: string;

    @Prop()
    responseValueField: string;

    @Prop()
    queryParams: QueryParams;

    @Prop({ required: true })
    id: string;

    @Prop()
    icon: string;

    @Prop()
    label: string;

    @Prop()
    placeholder: string;

    @Prop()
    focus: boolean | string;

    @Prop({ 'default': 300 })
    debounceMillis: number;

    @Prop()
    classes: string;

    curValue: string = this.value;
    items: any[] = [];
    loading: boolean = false;
    search: string = null;

    get spanId() {
        return `${this.id}-span`;
    }

    created() {
        if (this.value) {
            const item: any = {};
            item[this.responseLabelField] = this.value;
            item[this.responseValueField] = this.value;
            this.items.push(item);
        }
    }

    mounted() {
        // if (this.focus === 'true' || !!this.focus) {
        //     (this.$refs.select as HTMLElement).focus();
        // }
    }

    @Watch('search')
    onSearchChanged(newValue: string, oldValue: string) {
        if (newValue) {
            this.runQuery(newValue);
        }
    }

    private static clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Fires an "input" event stating our value has changed.  Part of implementing v-model for this component.
     */
    fireUpdateEvent(newValue: string) {
        console.log(`New value: ${newValue}`);
        this.$emit('input', newValue);
    }

    private runQuery(query: string) {

        this.loading = true;

        const queryParams: QueryParams = Typeahead.clone(this.queryParams);
        queryParams[this.filterParamName] = query;

        Ajax.get(this.url, queryParams, this.ajaxSuccess, this.ajaxFailure);
    }

    private ajaxSuccess(responseData: any[]) {
        this.items = responseData;
        this.loading = false;
    }

    private ajaxFailure() {
        this.loading = false;
    }
}
</script>

<style lang="less">
</style>
