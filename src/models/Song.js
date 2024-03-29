const tables = require('../../config/tables')
const Model = require('../../config/model')
const Admin = require('./Admin')
const Catalog = require('./Catalog')

class Song extends Model
{
    static get tableName()
    {
        return tables.songs
    }
  
    static get relationMappings()
    {
        return {
            catalog:
            {
                relation: Model.BelongsToOneRelation,
                modelClass: Catalog,
                join:
                {
                    from: `${tables.songs}.catalog_id`,
                    to: `${tables.catalogs}.id`
                }
            },
            author:
            {
                relation: Model.BelongsToOneRelation,
                modelClass: Admin,
                join:
                {
                    from: `${tables.songs}.author_id`,
                    to: `${tables.admin_accounts}.uuid`
                }
            }
        }
    }
}

module.exports = Song
