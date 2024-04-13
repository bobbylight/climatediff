<template>
    <v-app>
        <v-app-bar color="black" class="app-toolbar">

            <v-app-bar-title class="app-title" @click="onReset()">
                <i class="fa fa-cloud"></i> ClimateDiff
            </v-app-bar-title>

            <v-spacer></v-spacer>

            <v-btn :icon=true @click="viewOnGitHub" title="View on GitHub">
                <v-icon icon="mdi-github"></v-icon>
            </v-btn>
            <v-btn :icon=true @click="showAboutDialog" title="About ClimateDiff">
                <v-icon icon="mdi-help"></v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view v-slot="{ Component, route }">
                <transition name="page" mode="out-in">
                    <component
                        :is="Component"
                        :key="route.path"
                    />
                </transition>
            </router-view>
        </v-main>

        <AppFooter app></AppFooter>
    </v-app>
</template>

<script lang="ts">
import AppFooter from './app-footer.vue';

export default {
    components: {
        AppFooter,
    },

    methods: {
        onReset() {
            this.$router.push({name: 'start'});
        },

        showAboutDialog() {
            this.$router.push({name: 'about'});
        },

        viewOnGitHub() {
            window.open('https://github.com/bobbylight/climatediff', '_blank');
        },
    },
}
</script>

<style lang="less">
.app-toolbar {

    padding: 0 3rem !important;

    .app-title {
        cursor: pointer;
    }
}
</style>
