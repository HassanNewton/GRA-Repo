const express = require('express');
const router = express.Router();
const {getContacts, 
    createContacts, 
    getContact, 
    updateContact, 
    deleteContact} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

//GET all contacts
router.route('/').get(getContacts).post(createContacts);

//POST contact
//router.route('/').post(createContacts);

//GET contact
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);

//PUT contact
// router.route('/:id').put(updateContact);

//DELETE contact
// router.route('/:id').delete(deleteContact);

module.exports = router;

