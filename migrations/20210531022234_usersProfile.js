exports.up = function (knex) {
    return knex.schema.createTable("usersProfile", (table) => {
        table.string("profilepic");
        table.string("gender");
        table.date("birthday");
        table.integer("height");
        table.string("work");
        table.integer("education");
        table.string("ethnicity");
        table.string("religion");
        table.string("hometown");
        table.json("location");
        table.text("aboutme");
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("usersProfile")
};