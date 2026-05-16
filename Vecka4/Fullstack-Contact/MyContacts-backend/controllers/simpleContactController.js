// controllers/contactController.js

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public
const getContacts = (req, res) => {
  res.status(200).json({ message: "Get all contacts" });
};

// @desc    Get single contact by ID
// @route   GET /api/contacts/:id
// @access  Public
const getContact = (req, res) => {
  res.status(200).json({ message: `Get contact with ID ${req.params.id}` });
};

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Public
const createContact = (req, res) => {
  res.status(201).json({ message: "Create new contact", body: req.body });
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Public
const updateContact = (req, res) => {
  res.status(200).json({
    message: `Update contact with ID ${req.params.id}`,
    body: req.body,
  });
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = (req, res) => {
  res.status(200).json({ message: `Delete contact with ID ${req.params.id}` });
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
