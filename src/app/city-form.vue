<template>
    <div class="city-form">
        <v-container :class="formHeaderClasses">
            <v-row
                wrap
                justify="center"
                class="form-header-inner"
            >
                <h1>Cities to compare:</h1>
            </v-row>
        </v-container>

        <v-form
            id="cityForm"
            @submit.prevent="onSubmit"
        >
            <v-container>
                <v-row
                    wrap
                    justify="center"
                >
                    <v-col
                        cols="12"
                        md="6"
                    >
                        <Typeahead
                            id="city1"
                            v-model="city1"
                            url="api/locations"
                            filter-param-name="input"
                            :query-params="locationQueryParams"
                            icon="mdi-city"
                            response-label-field="city_name"
                            response-value-field="city_name"
                            label="City 1:"
                            classes="city-info"
                            :focus="true"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="6"
                    >
                        <Typeahead
                            id="city2"
                            v-model="city2"
                            url="api/locations"
                            filter-param-name="input"
                            :query-params="locationQueryParams"
                            icon="mdi-city"
                            response-label-field="city_name"
                            response-value-field="city_name"
                            label="City 2:"
                            classes="city-info"
                        />
                    </v-col>
                </v-row>

                <v-row class="button-panel">
                    <v-col class="d-flex justify-center">
                        <v-btn
                            type="submit"
                            color="primary"
                            :disabled="loading"
                        >
                            Compare!
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Typeahead from './typeahead.vue';

const props = defineProps({
    initialCity1: {
        type: String,
        default: '',
    },
    initialCity2: {
        type: String,
        default: '',
    },
    submitCallback: {
        type: Function,
        required: true,
    },
    loading: Boolean,
});

const city1 = ref(props.initialCity1);
const city2 = ref(props.initialCity2);
const locationQueryParams = {
    limit: 10,
};
const formHeaderClasses = ref({
    'form-header': true,
    submitted: false,
});

const onSubmit = () => {
    formHeaderClasses.value = {
        'form-header': true,
        submitted: true,
    };
    props.submitCallback(city1.value, city2.value);
};
</script>

<style scoped>
.city-form {
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.form-header {

    transition: max-height .3s, opacity .3s;
    max-height: 100px;
    padding: unset; /* Clear default 16px padding for smooth animation */

    .form-header-inner {
        padding: 16px; /* Add 16px border typically on the parent .container */
    }

    &.submitted {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
    }
}

.button-panel {
    padding-bottom: 24px;
}

.city-info {
    white-space: nowrap;
}
</style>
