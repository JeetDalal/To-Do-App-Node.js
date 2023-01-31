const mongoose = require('mongoose');

const itemsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Items',itemsSchema)
// module.exports = mongoose.model('Items',itemsSchema);

const customListSchema = mongoose.Schema({
    listName: String,
    items: [itemsSchema],
});

// const listStruct = mongoose.model('CustomList',customListSchema)

module.exports = {
    listStruct : mongoose.model('CustomList',customListSchema),
    itemStruct : mongoose.model('Items',itemsSchema)
}
