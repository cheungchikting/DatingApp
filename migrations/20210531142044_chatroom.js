
exports.up = function(knex) {
    return knex.schema.createTable("chatroom", (table) => {
        table.increments();
        table.string("matchedPair");
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("chatroom")
};
