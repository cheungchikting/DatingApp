
exports.up = function(knex) {
    return knex.schema.createTable("photos", (table) => {
        table.increments();
        table.string("filename");
        table.string("description");
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("photos")
};
