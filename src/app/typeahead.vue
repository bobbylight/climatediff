<template>
    <span :id="spanId" :class="classes">
        <label v-if="label" :for="id">{{label}}</label>
        <input :id="id" ref="inputField" type="text" class="form-control"
               :value="value" @input="fireUpdateEvent($event.target.value)"
               autocomplete="off" :placeholder="placeholder">
    </span>
</template>

<script>
import debounce from 'debounce';

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
        dataMapFunction: {
            type: Function, // map to { id: string, name: string }
            required: false
        },
        queryParams: {
            type: Object,
            required: false
        },
        id: {
            type: String,
            required: true
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

    mounted() {

        const typeaheadOptions = {

            /**
             * Returns a promise for the typeahead data.
             */
            source: debounce((query, process) => {

                const queryParams = $.extend(true, {}, this.queryParams);
                queryParams[this.filterParamName] = query;

                return $.get(this.url, queryParams, (data) => {
                    if (this.dataMapFunction) {
                        data = data.map(this.dataMapFunction);
                    }
                    return process(data);
                });
            }, this.debounceMillis),

            /**
             * Called when an item is selected from the typeahead dropdown.  Here we manually update our model to
             * stay in sync.
             *
             * @param newValue The newly-selected value.
             */
            afterSelect: (newValue) => {
                this.fireUpdateEvent(newValue.name);
            }
        };

        const $input = $(this.$el).find(`#${this.id}`);
        $input.typeahead(typeaheadOptions);

        if (this.focus === 'true' || !!this.focus) {
            $input.focus();
        }
    },

    methods: {

        /**
         * Fires an "input" event stating our value has changed.  Part of implementing v-model for this component.
         */
        fireUpdateEvent(newValue) {
            this.$emit('input', newValue);
        }
    }
}
</script>

<style lang="less">
</style>