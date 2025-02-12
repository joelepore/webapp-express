import express from 'express';
import moviesController from '../controllers/moviesController.js';
import upload from '../middlewares/multer.js';
const router = express.Router();

router.get('/', moviesController.index);
router.get('/:id', moviesController.show);
router.post('/:id/reviews', moviesController.storeReview);
router.post('/', upload.single('image'), moviesController.store);
router.delete('/:id', moviesController.destroy);

export default router;