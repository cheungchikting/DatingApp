exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("firstname");
        table.string("lastname");
        table.string("email");
        table.string("phone");
        table.string("hash");
        table.string("facebookid");
        table.string("googleid");
        table.string("accessToken");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("users")
};