module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    'extends': [
        'plugin:vue/vue3-strongly-recommended',
        'eslint:recommended'
    ],
    plugins: [
        '@stylistic',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        '@stylistic/arrow-parens': [ 'error', 'as-needed' ],
        '@stylistic/brace-style': [ 'error', '1tbs' ],
        '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
        '@stylistic/indent': [ 'error', 4 ],
        '@stylistic/semi': [ 'error', 'always' ],
        'vue/html-indent': ['error', 4 ],
        //'vue/valid-v-slot': [ 'error', { allowModifiers: true, }, ],
        'vue/multi-word-component-names': 'off', // TODO: Change about.vue and chart.vue to multi-word
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ],
    globals: {
        // vite.config.ts defines
        __APP_BUILD_DATE__: true,
        __APP_VERSION__: true,
    }
}
