
exports.up = function(knex) {
    return knex.schema.createTable("inventory", (table) => {
        table.increments();
        table.integer('quantity')
        table.integer('item_id').unsigned();
        table.foreign('item_id').references('shop.id')
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })

};

exports.down = function(knex) {
    return knex.schema.dropTable("inventory")
};
