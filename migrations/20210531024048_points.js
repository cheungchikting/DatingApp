
exports.up = function(knex) {
    return knex.schema.createTable("points", (table) => {
        table.integer("balance");
        table.json("transactions");
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("points")
};
