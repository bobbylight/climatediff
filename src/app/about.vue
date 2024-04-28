<template>
    <v-container class="about-container">
        <v-row
            wrap
            justify-center
        >
            <v-col xs6>
                <div class="about-section about-header">
                    <img
                        alt="About image - picture of sunshine"
                        class="about-image"
                        src="/img/263883.svg"
                    >
                    <h3>About Climatediff</h3>
                    <h6>Version: {{ version }}<span class="about-metadata-splitter">|</span>{{ buildDate }}</h6>
                </div>

                <div class="about-section about-content">
                    We were thinking about moving.  Moving to somewhere very cold.  I thought it
                    would be fun to visualize just how much different the weather was in this
                    new city from what it is where I currently live.  Thus, this site was born.
                </div>

                <div class="about-section about-thanks">
                    <h4>A Huge Thanks To:</h4>
                    <ul>
                        <li>
                            This site uses the NOAA's <a href="https://www.ncdc.noaa.gov/cdo-web/webservices/v2">
                                Web services</a> to generate its pretty charts
                        </li>
                        <li>
                            The source code for this application <a href="https://github.com/bobbylight/climatediff">
                                lives on GitHub</a>
                        </li>
                        <li>"About" icon made by Freepik from <a href="https://www.flaticon.com">www.flaticon.com</a></li>
                    </ul>
                </div>

                <div class="about-buttons">
                    <v-btn
                        color="primary"
                        @click="goBack"
                    >
                        Back
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => router.push({ name: 'compare' });
const buildDate = new Date(__APP_BUILD_DATE__).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
const version = __APP_VERSION__;
</script>

<style scoped>
.about-container {
    @media (min-width: 1920px) {
        max-width: 1200px;
    }
}

.about-section {
    padding-bottom: 2rem;
}

.about-header {

    text-align: center;

    /* 50% of actual size */
    .about-image {
        width: 256px;
        height: 256px;
        padding-right: 30px;
    }

    h6 {
        .about-metadata-splitter {
            font-size: larger;
            margin: 0 .5rem;
        }
    }
}

.about-thanks {
    li {
        list-style-position: inside;
    }
}

.about-buttons {
    text-align: center;
}
</style>
