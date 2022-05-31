// Importing modules
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { validationResult } = require('express-validator')

// Importing models
const AccountType = require('../../models/account_type')
const User = require('../../models/user')

const getAccount = require('../../utils/get-account')

const register = async (req, res, next) =>
{
    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(422).json({ errors: errors.mapped() })
    }
    
    try
    {
        const { username, fullname, email, password, account_type_code } = req.body
        const uuid = uuidv4()

        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)
        const accountType = await AccountType.query()
            .where('code', account_type_code)
            .select('id')
            .first()

        await User.query()
            .insert({
                uuid,
                username,
                fullname,
                email,
                password: passwordHash,
                account_type_id: accountType.id
            })

        return res.status(201)
            .json({
                statusCode: 201,
                statusText: 'Created',
                message: 'Successfully created user account.'
            })
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}

const login = async (req, res, next) =>
{
    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(422).json({ errors: errors.mapped() })
    }
    
    try
    {
        const account = await getAccount(req.query.account_type, { username: req.body.username })

        const generateToken = jwt.sign({
                uuid: account.uuid,
                username: account.username
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            })

        return res.status(200)
            .json({
                statusCode: 200,
                statusMessage: 'OK',
                message: 'Log in successful.',
                token: generateToken
            })
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}

const logout = (req, res, next) =>
{
    // 
}

module.exports = { register, login, logout }