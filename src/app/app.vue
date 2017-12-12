<template>
    <v-app>
        <v-toolbar app dark color="primary" style="padding: 0 3rem">

            <v-toolbar-title class="white--text">
                <i class="fa fa-cloud"></i> ClimateDiff
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="viewOnGitHub">
                <i class="banner-item fa fa-github" title="View on GitHub"></i>
                <span class="banner-item-label visible-xs-inline">View on GitHub</span>
            </v-btn>
            <v-btn icon @click="showAboutDialog">
                <v-icon>help</v-icon>
            </v-btn>
        </v-toolbar>

        <v-content>
            <MainPage></MainPage>
        </v-content>

        <AppFooter app></AppFooter>

        <AboutDialog :show="showAbout" @hidden="hideAboutDialog"></AboutDialog>
    </v-app>
</template>

<script>
import AboutDialog from './about-dialog';
import MainPage from './main-page.vue';
import AppFooter from './app-footer';

export default {

    components: {
        AboutDialog,
        MainPage,
        AppFooter
    },

    data: function() {
        return {
            showAbout: false
        };
    },

    methods: {

        hideAboutDialog() {
            this.showAbout = false;
        },

        showAboutDialog() {
            this.showAbout = true;
        },

        viewOnGitHub() {
            window.open('https://github.com/bobbylight/climatediff', '_blank');
        }
    }
};
</script>

<style lang="less">
.banner-item {
    font-size: 24px; //@font-size-large;

    a {
        padding: 11px; // Just right so icons are centered without navbar getting taller
    }
}
</style>