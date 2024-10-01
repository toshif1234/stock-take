const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./user.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'User created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        org_id: Joi.string().required(),
        warehouse: Joi.string().required(),
        email: Joi.string(),
        user_id: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.Operator, Role.Manager).required(),
        status: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        org_id: Joi.string().empty(''),
        warehouse: Joi.string().empty(''),
        email: Joi.string().empty(''),
        user_id: Joi.string().empty(''),
        password: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.Operator, Role.Manager).empty(''),
        status: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}