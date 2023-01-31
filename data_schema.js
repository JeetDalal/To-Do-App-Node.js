const mongoose = require('mongoose');

const itemsSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model("Item",itemsSchema);