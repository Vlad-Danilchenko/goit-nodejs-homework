const express = require("express");

const { isValidId, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/contacts-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteContact);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavoriteById
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContactById
);

module.exports = router;
