/* eslint-disable no-undef */
const base_uri = process.env.VUE_APP_BASE_URL;
const debug = process.env.VUE_APP_DEBUG;

module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  devServer: {
    proxy: {
      "/image": {
        target: base_uri,
        changeOrigin: debug,
        secure: debug,
        logLevel: debug ? "debug" : "silent",
        pathRewrite: { "^/image": "/image" },
      },
    },
  },
};
