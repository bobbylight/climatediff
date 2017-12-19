<template>
    <span :id="spanId" :class="classes">
        <v-select
            ref="select"
            :id="id"
            :label="label"
            :placeholder="placeholder"
            :loading="loading"
            :prepend-icon="icon"
            autocomplete
            browser-autocomplete="off"
            required
            :debounce-search="debounceMillis"
            :items="items"
            :item-text="responseLabelField"
            :item-value="responseValueField"
            :search-input.sync="search"
            :value="curValue"
            @input="fireUpdateEvent($event)"
            ></v-select>
    </span>
</template>

<script>
import Ajax from './ajax';

export default {

    props: {
        // "value" facilitates for v-model support
        value: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        filterParamName: {
            type: String,
            required: true
        },
        responseLabelField: {
            type: String
        },
        responseValueField: {
            type: String
        },
        queryParams: {
            type: Object,
            required: false
        },
        id: {
            type: String,
            required: true
        },
        icon: {
            type: String
        },
        label: {
            type: String,
            required: false
        },
        placeholder: {
            type: String,
            required: false
        },
        focus: {
            type: Boolean | String,
            required: false
        },
        debounceMillis: {
            type: Number,
            'default': 300
        },
        classes: {
            type: String,
            required: false
        }
    },

    computed: {
        spanId() {
            return `${this.id}-span`;
        }
    },

    data: function() {
        const items = [];
        if (this.value) {
            const item = {};
            item[this.responseLabelField] = this.value;
            item[this.responseValueField] = this.value;
            items.push(item);
        }
        return {
            curValue: this.value,
            items: items,
            loading: false,
            search: null
        };
    },

    mounted() {
        if (this.focus === 'true' || !!this.focus) {
            select.focus();
        }
    },

    watch: {
        search(val) {
            val && this.runQuery(val);
        }
    },

    methods: {

        clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        /**
         * Fires an "input" event stating our value has changed.  Part of implementing v-model for this component.
         */
        fireUpdateEvent(newValue) {
            console.log(`New value: ${newValue}`);
            this.$emit('input', newValue);
        },

        runQuery(query) {

            this.loading = true;

            const queryParams = this.clone(this.queryParams);
            queryParams[this.filterParamName] = query;

            Ajax.get(this.url, queryParams, this.ajaxSuccess, this.ajaxFailure);
        },

        ajaxSuccess(responseData) {
            this.items = responseData;
            this.loading = false;
        },

        ajaxFailure() {
            this.loading = false;
        }
    }
}
</script>

<style lang="less">
</style>