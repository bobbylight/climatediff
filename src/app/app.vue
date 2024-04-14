<template>
    <v-app>
        <v-app-bar
            color="black"
            class="app-toolbar"
        >
            <v-app-bar-title
                class="app-title"
                @click="onReset()"
            >
                <v-icon icon="mdi-cloud" /> ClimateDiff
            </v-app-bar-title>

            <v-spacer />

            <v-btn
                :icon="true"
                title="View on GitHub"
                @click="viewOnGitHub"
            >
                <v-icon icon="mdi-github" />
            </v-btn>
            <v-btn
                :icon="true"
                title="About ClimateDiff"
                @click="showAboutDialog"
            >
                <v-icon icon="mdi-help" />
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view v-slot="{ Component, route }">
                <transition
                    name="page"
                    mode="out-in"
                >
                    <component
                        :is="Component"
                        :key="route.path"
                    />
                </transition>
            </router-view>
        </v-main>

        <AppFooter app />
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
};
</script>

<style scoped>
.app-toolbar {
    padding: 0 3rem !important;
}

.app-title {
    cursor: pointer;
}
</style>
