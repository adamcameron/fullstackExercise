module.exports = {
    devServer: {
        host: "vuejs.backend",
        disableHostCheck: false,
        port: 8080,
        watchOptions : {
            ignored: /node_modules/,
            poll: 1000
        }
    }
}
