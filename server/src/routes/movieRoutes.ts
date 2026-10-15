import { Router } from 'express';
import {
  getPublicMovies,
  getFeaturedMovies,
  getUpcomingMovies,
  getReleasedMovies,
  getMovieBySlug,
  getAdminMovies,
  getAdminMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { authenticateAdmin } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validate.js';
import { createMovieSchema, updateMovieSchema } from '../validations/movieValidation.js';

export const publicMovieRouter = Router();
publicMovieRouter.get('/', getPublicMovies);
publicMovieRouter.get('/featured', getFeaturedMovies);
publicMovieRouter.get('/upcoming', getUpcomingMovies);
publicMovieRouter.get('/released', getReleasedMovies);
publicMovieRouter.get('/:slug', getMovieBySlug);

export const adminMovieRouter = Router();
adminMovieRouter.use(authenticateAdmin);
adminMovieRouter.get('/', getAdminMovies);
adminMovieRouter.get('/:id', getAdminMovieById);
adminMovieRouter.post('/', validateBody(createMovieSchema), createMovie);
adminMovieRouter.patch('/:id', validateBody(updateMovieSchema), updateMovie);
adminMovieRouter.put('/:id', validateBody(updateMovieSchema), updateMovie);
adminMovieRouter.delete('/:id', deleteMovie);
