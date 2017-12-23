<template>
    <v-app>
        <v-toolbar app dark color="primary" class="app-toolbar">

            <v-toolbar-title class="app-title" @click="onReset()">
                <i class="fa fa-cloud"></i> ClimateDiff
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="viewOnGitHub" title="View on GitHub">
                <i class="banner-item fa fa-github"></i>
            </v-btn>
            <v-btn icon @click="showAboutDialog" title="About ClimateDiff">
                <v-icon>help</v-icon>
            </v-btn>
        </v-toolbar>

        <v-content>
            <transition name="page" mode="out-in">
                <router-view></router-view>
            </transition>
        </v-content>

        <AppFooter app></AppFooter>
    </v-app>
</template>

<script lang="ts">
import AppFooter from './app-footer.vue';

export default {

    components: {
        AppFooter
    },

    data: function() {
        return {
        };
    },

    methods: {

        onReset() {
            this.$router.push({ name: 'start' });
        },

        showAboutDialog() {
            this.$router.push({ name: 'about' });
        },

        viewOnGitHub() {
            window.open('https://github.com/bobbylight/climatediff', '_blank');
        }
    }
};
</script>

<style lang="less">
.app-toolbar {

    padding: 0 3rem !important;

    .app-title {
        cursor: pointer;
    }

    .banner-item {
        font-size: 24px; //@font-size-large;

        a {
            padding: 11px; // Just right so icons are centered without navbar getting taller
        }
    }
}

</style>