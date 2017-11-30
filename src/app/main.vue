<template>
    <div>
        <nav class="navbar navbar-inverse" role="navigation">
            <div class="container">

                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#/"><i class="fa fa-cloud"></i> ClimateDiff</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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
                </div>

            </div>
        </nav>

        <AboutDialog :show="showAbout" @hidden="hideAboutDialog"></AboutDialog>

        <MainPage></MainPage>

        <AppFooter></AppFooter>
    </div>
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