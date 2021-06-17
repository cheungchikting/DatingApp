
exports.up = function(knex) {
    return knex.schema.createTable("token", (table) => {
        table.boolean("likeme");
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("token")
};
