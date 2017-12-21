<template>
    <div>
        <v-container>
            <v-layout row wrap justify-center>
                <h1>Cities to compare:</h1>
            </v-layout>
        </v-container>

        <form @submit.prevent="onSubmit" id='cityForm' role='form' class='city-form'>

            <v-container>
                <v-layout row wrap justify-center>

                    <v-flex xs3>
                        <Typeahead url="api/locations" v-model="city1" filter-param-name="input"
                                   :query-params="locationQueryParams" icon="location_city"
                                   response-label-field="city_name" response-value-field="city_name" id="city1" label="City 1:"
                                   classes="city-info" autofocus="true"></Typeahead>
                    </v-flex>
                    <v-flex xs3 offset-xs1>
                        <Typeahead url="api/locations" v-model="city2" filter-param-name="input"
                                   :query-params="locationQueryParams" icon="location_city"
                                   response-label-field="city_name" response-value-field="city_name" id="city2" label="City 2:"
                                   classes="city-info"></Typeahead>
                    </v-flex>

                </v-layout>
            </v-container>

            <v-container class="city-form-no-top-padding">
                <v-layout row-wrap justify-center>
                    <v-btn type='submit' color="primary">Compare!</v-btn>
                </v-layout>
            </v-container>

        </form>
    </div>
</template>

<script lang="ts">
import Typeahead from './typeahead.vue';

export default {

    components: {
        Typeahead
    },

    props: {
        initialCity1: {
            type: String,
            required: true
        },
        initialCity2: {
            type: String,
            required: true
        },
        submitCallback: {
            type: Function,
            required: true
        }
    },

    data: function() {

        return {
            city1: this.initialCity1,
            city2: this.initialCity2,
            typeaheadWaitMillis: 500,
            locationQueryParams: {
                limit: 10
            }
        };
    },

    methods: {

        onSubmit() {
            this.submitCallback(this.city1, this.city2);
        }
    }
};
</script>

<style lang="less">
.city-form-no-top-padding {
    padding-top: 0;
}
</style>