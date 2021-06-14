
exports.up = function(knex) {
    return knex.schema.createTable("shop", (table) => {
        table.increments();
        table.string("token");
        table.integer('price')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("shop")
};
