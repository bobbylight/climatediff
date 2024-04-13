<template>
    <span
        :id="spanId"
        :class="classes"
    >
        <v-autocomplete
            :id="id"
            ref="select"
            v-model:search-input="search"
            :label="label"
            :placeholder="placeholder"
            :loading="loading"
            :prepend-icon="icon"
            required
            :debounce-search="debounceMillis"
            :items="items"
            :item-text="responseLabelField"
            :item-value="responseValueField"
            :value="curValue"
            @input="fireUpdateEvent($event)"
        />
    </span>
</template>

<script lang="ts">
import Ajax, { QueryParams } from './ajax';

export default {
    props: {
        /**
         * "value" facilitates v-model support
         */
        value: {
            type: String,
            default: '',
        },

        url: {
            type: String,
            required: true,
        },

        filterParamName: {
            type: String,
            required: true,
        },

        responseLabelField: {
            type: String,
            required: true,
        },

        responseValueField: {
            type: String,
            required: true,
        },

        queryParams: {
            type: Object, /*QueryParams*/
            required: true,
        },

        id: {
            type: String,
            required: true,
        },

        icon: {
            type: String,
            required: true,
        },

        label: {
            type: String,
            required: true,
        },

        placeholder: {
            type: String,
            default: '',
        },

        focus: {
            type: Boolean,
            default: false,
        },

        debounceMillis: {
            type: Number,
            default: 300,
        },

        classes: {
            type: String,
            required: true,
        },
    },

    emits: ['input'],

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

    watch: {
        search: function (newValue: string) {
            if (newValue) {
                this.runQuery(newValue);
            }
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
};
</script>

<style scoped>
</style>
