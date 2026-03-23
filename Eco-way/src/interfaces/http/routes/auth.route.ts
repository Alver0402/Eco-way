const { Router } = require('express');
const { AuthController } = require('../controllers/AuthController');

const router = Router();
const controller = new AuthController();

router.post('/register', (req: any, res: any) => controller.register(req, res));
router.post('/login', (req: any, res: any) => controller.login(req, res));

module.exports = router;
