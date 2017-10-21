var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");

gulp.task("bundle", function () {
    return browserify({
        entries: "./reactApp/main.jsx",
        debug: true
    }).transform("babelify", {presets: "react"})
        .exclude("jquery")
        .bundle()
        .pipe(source("app.js"))
        .pipe(gulp.dest("./public/javascripts/dist"))
});

gulp.task("default", ["bundle"], function () {
    console.log("Gulp completed...");
});

