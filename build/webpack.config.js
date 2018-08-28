const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/impl/Engine.ts",
    devtool: "source-map",

    resolve: {
        extensions: [".ts"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: [/node_modules/, /test/]
            }
        ]
    },

    output: {
        filename: "validator.min.js",
        path: path.resolve(__dirname, "..", "publish"),
        libraryTarget: "umd",
        library: "RuleValidator",
        libraryExport: "default"
    }
};
