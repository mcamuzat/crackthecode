const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    // Other rules...
    resolve: {fallback: { 
        "path": require.resolve("path-browserify") 
    }},
    plugins: [
        new NodePolyfillPlugin()
    ]
}
