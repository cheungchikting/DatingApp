
exports.up = function(knex) {
    return knex.schema.createTable("matches", (table) => {
        table.json("like");
        table.json("dislike");
        table.json('randomlist')
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("matches")
};
