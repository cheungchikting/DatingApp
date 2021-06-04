
exports.up = function(knex) {
    return knex.schema.createTable("filter", (table) => {
        table.string("preferredGender");
        table.integer("min_age");
        table.integer("max_age");
        table.integer("min_height");
        table.integer("max_height");
        table.integer("distance");
        table.string("preferredEthnicity");
        table.integer("preferredEducation");
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("filter")
};
