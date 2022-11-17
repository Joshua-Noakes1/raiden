function color() {
    // random array of hex pastels
    var colors = ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];
    return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = color