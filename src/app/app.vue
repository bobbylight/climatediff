<template>
    <v-app>
        <v-toolbar app dark color="primary" style="padding: 0 3rem">
            <!--<nav class="navbar navbar-inverse" role="navigation">-->

            <v-toolbar-title class="white--text">
                <i class="fa fa-cloud"></i> ClimateDiff
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <ul class='nav navbar-nav navbar-right'>
                <li class="banner-item"><a href="#/" v-on:click="viewOnGitHub()">
                    <i class="banner-item-icon fa fa-github" title="View on GitHub"></i>
                    <span class="banner-item-label visible-xs-inline">View on GitHub</span>
                </a></li>
                <li class="banner-item"><a href='#/' v-on:click="showAboutDialog()">
                    <i class="banner-item-icon fa fa-question-circle" title="About"></i>
                    <span class="banner-item-label visible-xs-inline">About</span>
                </a></li>
            </ul>

            <!--</nav>-->
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
.navbar {
    border-radius: 0; /* Remove 4-pixel radius in bootstrap default */

    .banner-item {
        font-size: 28px; //@font-size-large;

        a {
            padding: 11px; // Just right so icons are centered without navbar getting taller
        }
    }
}
</style>