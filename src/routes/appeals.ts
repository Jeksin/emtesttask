import { Router } from 'express';
import * as appealController from '../controllers/appealController';

const router = Router();

router.post('/create', appealController.createAppeal); //создание
router.get('/list', appealController.getAppeals); //получить список обращений
router.get('/:id', appealController.getAppealById); //получить обращение по id
router.patch('/:id/take-to-work', appealController.takeAppealToWork); //взять обращение в работу
router.patch('/:id/complete', appealController.completeAppeal); //завершить обращение
router.patch('/:id/cancel', appealController.cancelAppeal); //отменить обращение
router.post('/cancel-all-in-progress', appealController.cancelAllInProgress); //отменить все обращения в работе

export default router;