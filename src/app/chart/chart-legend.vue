<template>
    <div class="chart-legend">
        <span
            v-for="(city, index) in cityLabels"
            :key="city"
            :class="citySpanClass(index)"
            @mouseenter="onMouseEnter(index)"
            @mouseleave="onMouseLeave"
        >
            <div :class="dotDivClass(index)" />
            {{ city }}
        </span>
    </div>
</template>

<script>
const ARMED_CITY = 'armedCity';

export default {

    props: {
        cityLabels: {
            type: Array, // string[]
            required: true,
        },
    },

    methods: {

        dotDivClass(index) {
            return `legend-dot city-${index + 1}`;
        },

        citySpanClass(index) {
            return `city-span city-${index + 1}`;
        },

        onMouseEnter(index) {

            this.$emit(ARMED_CITY, index + 1);

            const otherCityClass = `city-${index === 1 ? 1 : 2}`;
            const citySpans = this.$el.getElementsByClassName(otherCityClass);
            for (let i = 0; i < citySpans.length; i++) { // Should always be 1
                citySpans[i].classList.add('unfocused');
            }
        },

        onMouseLeave() {

            this.$emit(ARMED_CITY, null);

            const citySpans = this.$el.getElementsByClassName('city-span');
            for (let i = 0; i < citySpans.length; i++) {
                citySpans[i].classList.remove('unfocused');
            }
        },
    },
};
</script>

<style scoped>
.chart-legend {
    text-align: center;
}

.city-span {

    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 1rem;
    cursor: pointer;
    transition: opacity @chart-transition-duration;

    .legend-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 0 0.3rem;

        &.city-1 {
            background: var(--chart-color-1);
        }
        &.city-2 {
            background: var(--chart-color-2);
        }
    }

    &.unfocused {
        opacity: var(--chart-unfocused-opacity);
    }
}
</style>
