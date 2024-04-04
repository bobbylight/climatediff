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

export default {
    props: {
        /**
         * "value" facilitates v-model support
         */
        value: String,

        url: String,

        filterParamName: String,

        responseLabelField: String,

        responseValueField: String,

        queryParams: Object, /*QueryParams*/

        id: String,

        icon: String,

        label: String,

        placeholder: String,

        focus: Object,//boolean | string;

        debounceMillis: Number, // default: 300

        classes: String,
    },

    data() {
        return {
            curValue: this.value, // string
            items: [], // any[]
            loading: false,
            search: null, // string
        };
    },

    computed: {
        spanId() {
            return `${this.id}-span`;
        },
    },

    created() {
        if (this.value) {
            const item: any = {};
            item[this.responseLabelField] = this.value;
            item[this.responseValueField] = this.value;
            this.items.push(item);
        }
    },

    mounted() {
        // if (this.focus === 'true' || !!this.focus) {
        //     (this.$refs.select as HTMLElement).focus();
        // }
    },

    watch: {
        search: function (newValue: string, oldValue: string) {
            if (newValue) {
                this.runQuery(newValue);
            }
        },
    },

    methods: {
        /**
         * Fires an "input" event stating our value has changed.  Part of implementing v-model for this component.
         */
        fireUpdateEvent(newValue: string) {
            console.log(`New value: ${newValue}`);
            this.$emit('input', newValue);
        },

        runQuery(query: string) {

            this.loading = true;

            const queryParams: QueryParams = JSON.parse(JSON.stringify(this.queryParams));
            queryParams[this.filterParamName] = query;

            Ajax.get(this.url, queryParams, this.ajaxSuccess, this.ajaxFailure);
        },

        ajaxSuccess(responseData: any[]) {
            this.items = responseData;
            this.loading = false;
        },

        ajaxFailure() {
            this.loading = false;
        },
    },
}
</script>

<style lang="less">
</style>
