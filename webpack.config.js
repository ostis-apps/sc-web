module.exports = {
    entry: ["./client/js/Ui/eekbPanel.js"],
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: "./build/eekbPanel.bundle.js",
        library: "EekbPanel"
    },
    module: {
      loaders: [{
          test: /.js$/,
          loader : 'babel-loader'
      }]
    }
};