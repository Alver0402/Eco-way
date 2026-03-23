const { Router } = require('express');
const { ProfileController } = require('../controllers/ProfileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = Router();
const controller = new ProfileController();

router.get('/', authMiddleware, (req: any, res: any) => controller.getProfile(req, res));
router.put('/', authMiddleware, (req: any, res: any) => controller.updateProfile(req, res));

module.exports = router;
