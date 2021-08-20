<template>
    <div>
        <v-container :class="formHeaderClasses">
            <v-layout row wrap justify-center class="form-header-inner">
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
                                   classes="city-info" focus="true"></Typeahead>
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
                    <v-btn type='submit' color="primary" :disabled="loading">Compare!</v-btn>
                </v-layout>
            </v-container>

        </form>
    </div>
</template>

<script lang="ts">
import Typeahead from './typeahead.vue';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component({ components: { Typeahead }})
export default class CityForm extends Vue {

    @Prop({ required: true })
    private initialCity1!: string;

    @Prop({ required: true })
    private initialCity2!: string;

    @Prop({ required: true })
    private submitCallback: Function;

    @Prop({ required: true })
    loading: boolean; // Not private since tsc doesn't know about usage in vue template

    city1: string = this.initialCity1;
    city2: string = this.initialCity2;
    locationQueryParams: any = {
        limit: 10
    };
    formHeaderClasses: any = {
        'form-header': true,
        submitted: false
    };

    onSubmit() {
        this.formHeaderClasses.submitted = true;
        this.submitCallback(this.city1, this.city2);
    }
}
</script>

<style lang="less">
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

.city-form-no-top-padding {
    padding-top: 0;
}

.city-info {
    white-space: nowrap;
}
</style>
