<template>
    <span
        :id="spanId"
        :class="classes"
    >
        <v-autocomplete
            :id="id"
            ref="select"
            v-model="curValue"
            :label="label"
            :placeholder="placeholder"
            :loading="loading"
            :prepend-icon="icon"
            required
            :debounce-search="debounceMillis"
            :items="items"
            :item-title="responseLabelField"
            :item-value="responseValueField"
            @input="fireUpdateEvent($event)"
        />
    </span>
</template>

<script setup lang="ts">
import { ModelRef, computed, ref } from 'vue';
import Ajax, { QueryParams } from './ajax';

const props = defineProps({
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
});

const emit = defineEmits(['input']);

const curValue: ModelRef<string> = defineModel<string>({ required: true });
const items = ref([]);
const loading = ref(false);

const spanId = computed(() => `${props.id}-span`);

if (curValue.value) {
    const item: any = {};
    item[props.responseLabelField] = curValue.value;
    item[props.responseValueField] = curValue.value;
    items.value.push(item);
}

// onMounted(() => {
// // if (this.focus === 'true' || !!this.focus) {
// //     (this.$refs.select as HTMLElement).focus();
// // }
// });

/**
 * Fires an "input" event stating our value has changed.  Part of implementing v-model for this component.
 */
const fireUpdateEvent = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;
    emit('input', value);
    if (value) {
        runQuery(value);
    }
};

const runQuery = (query: string) => {

    loading.value = true;

    const queryParams: QueryParams = JSON.parse(JSON.stringify(props.queryParams));
    queryParams[props.filterParamName] = query;

    Ajax.get(props.url, queryParams, ajaxSuccess, ajaxFailure);
};

const ajaxSuccess = (responseData: any[]) => {
    items.value = responseData;
    loading.value = false;
};

const ajaxFailure = () => {
    loading.value = false;
};
</script>

<style scoped>
</style>
