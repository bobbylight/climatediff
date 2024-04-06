<template>
    <v-container class="about-container">

        <v-layout row wrap justify-center>

            <v-flex xs6>

                <div class="about-section about-header">
                    <img class="about-image" src="/img/263883.svg">
                    <h3>About Climatediff</h3>
                    <h6>Version: [AIV]{version}[/AIV]<span class="about-metadata-splitter">|</span>[AIV]{date}[/AIV]</h6>
                </div>

                <div class="about-section about-content">
                    We were thinking about moving.  Moving to somewhere very cold.  I thought it
                    would be fun to visualize just how much different the weather was in this
                    new city from what it is where I currently live.  Thus, this site was born.
                </div>

                <div class="about-section about-thanks">
                    <h4>A Huge Thanks To:</h4>
                    <ul>
                        <li>This site uses the NOAA's <a href='https://www.ncdc.noaa.gov/cdo-web/webservices/v2'>
                            Web services</a> to generate its pretty charts</li>
                        <li>The source code for this application <a href='https://github.com/bobbylight/climatediff'>
                            lives on GitHub</a></li>
                        <li>"About" icon made by Freepik from <a href="https://www.flaticon.com">www.flaticon.com</a></li>
                    </ul>
                </div>

                <div class="about-buttons">
                    <v-btn color="primary" @click="goBack">Back</v-btn>
                </div>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script lang="ts">
export default {

    methods: {
        goBack() {
            this.$router.push({ name: 'compare' });
        }
    }
}
</script>

<style lang="less">
.about-container {

    .about-section {
        padding-bottom: 2rem;
    }

    .about-header {

        text-align: center;

        // 50% of actual size
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
}
</style>
