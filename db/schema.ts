import {sqliteTable,text,integer,index,primaryKey} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('records',{id:text('id').primaryKey(),kind:text('kind').notNull(),data:text('data').notNull(),draft:text('draft'),updated:integer('updated').notNull(),deleted:integer('deleted').notNull().default(0)},t=>[index('records_kind').on(t.kind)]);
export const revisions=sqliteTable('revisions',{id:text('id').primaryKey(),recordId:text('record_id').notNull(),data:text('data').notNull(),created:integer('created').notNull()},t=>[index('revisions_record').on(t.recordId)]);
export const sessions=sqliteTable('sessions',{token:text('token').primaryKey(),userId:text('user_id').notNull(),name:text('name'),photo:text('photo'),admin:integer('admin').notNull().default(0),expires:integer('expires').notNull()});
export const progress=sqliteTable('progress',{userId:text('user_id').notNull(),key:text('key').notNull(),data:text('data').notNull(),updated:integer('updated').notNull()},t=>[primaryKey({columns:[t.userId,t.key]})]);
export const imports=sqliteTable('imports',{id:text('id').primaryKey(),hash:text('hash').notNull()});
