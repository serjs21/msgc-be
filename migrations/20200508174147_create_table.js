
exports.up = function(knex) {
  return knex.schema.createTable('emails', function(t) {
        t.increments('id').unsigned().primary();
        t.string('uuid').notNull();
        t.dateTime('createdAt').notNull();
        t.string('recipient').notNull();
        t.string('subject').notNull();
        t.string('sender').notNull();
        t.enum('category', ['physing', 'ransomware', 'hacking']).notNull();
        t.enum('status', ['open', 'approved', 'rejected']).notNull();
        t.dateTime('requestedAt').notNull();
        t.string('requestedBy').notNull();
        t.string('requestReason').nullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('emails');
};
