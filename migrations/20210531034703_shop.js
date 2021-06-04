
exports.up = function(knex) {
    return knex.schema.createTable("shop", (table) => {
        table.increments();
        table.string("itemname");
        table.string("emoji");
        table.integer('price')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("shop")
};
