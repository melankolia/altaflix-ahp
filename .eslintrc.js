module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        'vue/multi-word-component-names': 'off',      
        'vue/valid-v-slot': 'off'
    }
};