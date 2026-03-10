const express = require('express')
const providerControllers = require('../controllers/provider.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const providerValidator = require('../validators/provider.validator')
const upload = require('../middlewares/upload.middleware')
const validateObjectIdMiddleware = require('../middlewares/validateObjectId.middleware')
const router = express.Router()
 
 




router.post(
"/",
authMiddleware.tokenVerify,
upload.fields([
{ name: "aadharCard", maxCount: 1 },
{ name: "certificate", maxCount: 1 },
{ name: "profileImage", maxCount: 1 },
]),
providerValidator.providerValidator,
providerControllers.providerProfileCreate
);


// GET    /api/v1/providers/me
router.get('/me',authMiddleware.tokenVerify,providerControllers.getProvider)



router.put('/me',authMiddleware.tokenVerify,upload.fields([
{ name: "profileImage", maxCount: 1 },
]),providerValidator.providerUpdateValidator,providerControllers.updateProvider)
// GET /api/v1/providers
router.get('/',providerControllers.getProviders)

// GET /api/v1/providers/:id
router.get('/:id',validateObjectIdMiddleware,providerControllers.getOneProviderDetails)
module.exports= router