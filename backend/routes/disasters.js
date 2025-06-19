const express = require('express');
const router = express.Router();

const {
    createDisaster,
    getDisasters,
    updateDisaster,
    deleteDisaster,
    extractAndGeocode,
    getNearbyResources,
    createReport,
    getReports,
    verifyImage,
    submitSocialPost,
} = require('../controllers/disasterController');

// Disaster CRUD
router.post('/', createDisaster);                    // POST /disasters
router.get('/', getDisasters);                       // GET /disasters or /disasters?tag=flood
router.put('/:id', updateDisaster);                  // PUT /disasters/:id
router.delete('/:id', deleteDisaster);               // DELETE /disasters/:id

// Gemini Location + Geocoding
router.post('/geocode', extractAndGeocode);          // POST /disasters/geocode

// Geospatial Resource Lookup
router.get('/:id/resources', getNearbyResources);    // GET /disasters/:id/resources?lat=...&lon=...

// Reports (Social Media Posts)
router.post('/:id/reports', createReport);           // POST /disasters/:id/reports
router.get('/:id/reports', getReports);              // GET /disasters/:id/reports

// Image Verification
router.post('/:id/verify-image', verifyImage);       // POST /disasters/:id/verify-image

router.post('/:id/social-media', submitSocialPost);

module.exports = router;

