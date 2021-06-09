
exports.up = function(knex) {
    return knex.schema.createTable("photos", (table) => {
        table.increments();
        table.string("pc1");
        table.string("pc2");
        table.string("pc3");
        table.string("pc4");
        table.string("pc5");
        table.string("pc6");
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("photos")
};
