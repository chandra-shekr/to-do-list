//jshint esversion:6

"use strict";

let getDate = function () {
    const today = new Date();
    const options = { month: "long", day: "numeric", weekday: "long" };

    return today.toLocaleDateString("en-US", options);
};

String.prototype.title = function () {
    return this.split(" ")
        .map((c) => c.charAt(0).toUpperCase() + c.substring(1).toLowerCase())
        .join(" ");
};


export default getDate;
