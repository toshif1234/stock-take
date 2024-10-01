const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./bin.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/import', importCSV);

module.exports = router;

// route functions
function importCSV(req, res, next) {
    userService.importCSV('./bin/meta_csv/sample.csv')
        .then(bin => res.json(bin))
        .catch(next);
}


function getAll(req, res, next) {
    userService.getAll()
        .then(bin => res.json(bin))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(bin => res.json(bin))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Bin created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Bin updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'Bin deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        org_id: Joi.string().required(),
        warehouse: Joi.string().required(),
        bin_id: Joi.string().required(),
        storage_type: Joi.string().required(),
        storage_sec: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        org_id: Joi.string().empty(''),
        warehouse: Joi.string().empty(''),
        bin_id: Joi.string().empty(''),
        storage_type: Joi.string().empty(''),
        storage_sec: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}