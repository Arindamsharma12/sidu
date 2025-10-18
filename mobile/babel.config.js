module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // The Reanimated v4 plugin is now part of the worklets package
      "react-native-worklets/plugin",
    ],
  };
};
