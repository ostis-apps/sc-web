let scriptTag = (url) => `<script type="text/javascript" charset="utf-8" src="${url}"></script>`;
let styleTag = (url) => `<link rel="stylesheet" type="text/css" href="${url}" />`;
let buildCurrentJs = (a) => a.current.js.map(scriptTag);
let buildCss = (arr) => arr.map(styleTag).join('\n');
let buildJs = (arr) => arr.map(scriptTag).join('\n');
let buildCurrent = (js, css) => `${buildJs(js)}\n${buildCss(css)}`;

let a = require('./all-files.js');
let fs = require('fs');
let writeHTML = (buildFile) => (fileName) => (source) =>
    fs.writeFileSync(fileName, buildFile(source.js, source.css));

let state = a[process.argv[2]];
let file = process.argv[3];

//don't scare, it's just function which returns function which returns function
writeHTML(buildCurrent)(file)(state);
