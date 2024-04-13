<template>
    <div class="city-form">
        <v-container :class="formHeaderClasses">
            <v-row wrap justify="center" class="form-header-inner">
                <h1>Cities to compare:</h1>
            </v-row>
        </v-container>

        <form @submit.prevent="onSubmit" id='cityForm' role='form'>

            <v-container>
                <v-row wrap justify="center">

                    <v-col xs3>
                        <Typeahead url="api/locations" v-model="city1" filter-param-name="input"
                                   :query-params="locationQueryParams" icon="location_city"
                                   response-label-field="city_name" response-value-field="city_name" id="city1" label="City 1:"
                                   classes="city-info" focus="true"></Typeahead>
                    </v-col>
                    <v-col xs3 offset-xs1>
                        <Typeahead url="api/locations" v-model="city2" filter-param-name="input"
                                   :query-params="locationQueryParams" icon="location_city"
                                   response-label-field="city_name" response-value-field="city_name" id="city2" label="City 2:"
                                   classes="city-info"></Typeahead>
                    </v-col>
                </v-row>
            </v-container>

            <v-container class="button-panel">
                <v-row>
                    <v-col class="d-flex justify-center">
                        <v-btn type='submit' color="primary" :disabled="loading">Compare!</v-btn>
                    </v-col>
                </v-row>
            </v-container>

        </form>
    </div>
</template>

<script lang="ts">
import Typeahead from './typeahead.vue';

export default {
    components: {
        Typeahead,
    },

    props: {
        initialCity1: String,
        initialCity2: String,
        submitCallback: Function,
        loading: Boolean,
    },

    data() {
        return {
            city1: this.initialCity1,
            city2: this.initialCity2,
            locationQueryParams: {
                limit: 10
            },
            formHeaderClasses: {
                'form-header': true,
                submitted: false
            },
        };
    },

    methods: {
        onSubmit() {
            this.formHeaderClasses.submitted = true;
            this.submitCallback(this.city1, this.city2);
        },
    },
}
</script>

<style lang="less">
.city-form {
    background: white;
    border-bottom: 1px solid rgba(0,0,0,.2);
    //box-shadow: 0 2px 1px -1px rgba(0,0,0,.2);

    .form-header {

        transition: max-height .3s, opacity .3s;
        max-height: 100px;
        padding: unset; // Clear default 16px padding for smooth animation

        .form-header-inner {
            padding: 16px; // Add 16px border typically on the parent .container
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
}
</style>
