const tables = require('../../config/tables')
const Model = require('./init-model')
const Admin = require('./admin')

class Artist extends Model
{
    static get tableName()
    {
        return tables.artists
    }

    static get relationMappings()
    {
        return {
            author:
            {
                relation: Model.BelongsToOneRelation,
                modelClass: Admin,
                join:
                {
                    from: `${tables.artists}.author_id`,
                    to: `${tables.admin_accounts}.uuid`
                }
            }
        }
    }
}

module.exports = Artist