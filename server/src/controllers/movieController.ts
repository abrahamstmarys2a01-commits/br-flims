import { Request, Response } from 'express';
import { Movie } from '../models/Movie.js';
import { AuthRequest } from '../middlewares/auth.js';
import { recordAuditLog } from '../services/auditService.js';
import { deleteUploadedFile } from '../services/uploadService.js';

// ================= PUBLIC METHODS =================

export const getPublicMovies = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 12, 50);
  const skip = (page - 1) * limit;

  const { search, language, genre, status, sort } = req.query;

  // Strict public filter: only Published movies
  const query: any = { publicationStatus: 'Published' };

  if (status && status !== 'all') {
    if (status === 'Upcoming' || status === 'Released') {
      query.releaseStatus = status;
    }
  }

  if (language && language !== 'all') {
    query.language = language;
  }

  if (genre && genre !== 'all') {
    query.genres = { $in: [genre] };
  }

  if (search) {
    query.title = { $regex: search as string, $options: 'i' };
  }

  let sortOption: any = { createdAt: -1, releaseDate: -1 };
  if (sort === 'releaseDate') {
    sortOption = { releaseDate: -1, createdAt: -1 };
  } else if (sort === 'title') {
    sortOption = { title: 1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  const [movies, total] = await Promise.all([
    Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Movie.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: movies,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasMore: skip + movies.length < total,
    },
  });
};

export const getFeaturedMovies = async (_req: Request, res: Response): Promise<void> => {
  let movies = await Movie.find({
    publicationStatus: 'Published',
    isFeatured: true,
  })
    .sort({ createdAt: -1, releaseDate: -1 })
    .limit(8)
    .lean();

  // If no movies are explicitly tagged as featured, fall back to latest published movies
  if (!movies || movies.length === 0) {
    movies = await Movie.find({
      publicationStatus: 'Published',
    })
      .sort({ createdAt: -1, releaseDate: -1 })
      .limit(8)
      .lean();
  }

  res.status(200).json({
    success: true,
    data: movies,
  });
};

export const getUpcomingMovies = async (_req: Request, res: Response): Promise<void> => {
  const movies = await Movie.find({
    publicationStatus: 'Published',
    releaseStatus: 'Upcoming',
  })
    .sort({ releaseDate: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: movies,
  });
};

export const getReleasedMovies = async (_req: Request, res: Response): Promise<void> => {
  const movies = await Movie.find({
    publicationStatus: 'Published',
    releaseStatus: 'Released',
  })
    .sort({ releaseDate: -1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: movies,
  });
};

export const getMovieBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  const movie = await Movie.findOne({
    slug: slug.toLowerCase(),
    publicationStatus: 'Published',
  }).lean();

  if (!movie) {
    res.status(404).json({
      success: false,
      message: `Movie with slug '${slug}' not found or not published.`,
    });
    return;
  }

  // Related movies
  const related = await Movie.find({
    publicationStatus: 'Published',
    _id: { $ne: movie._id },
    $or: [{ language: movie.language }, { genres: { $in: movie.genres } }],
  })
    .sort({ releaseDate: -1 })
    .limit(4)
    .lean();

  res.status(200).json({
    success: true,
    data: movie,
    related,
  });
};

// ================= ADMIN METHODS =================

export const getAdminMovies = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const { search, publicationStatus, releaseStatus } = req.query;
  const query: any = {};

  if (publicationStatus && publicationStatus !== 'all') {
    query.publicationStatus = publicationStatus;
  }

  if (releaseStatus && releaseStatus !== 'all') {
    query.releaseStatus = releaseStatus;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { slug: { $regex: search as string, $options: 'i' } },
    ];
  }

  const [movies, total] = await Promise.all([
    Movie.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Movie.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: movies,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
};

export const getAdminMovieById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const movie = await Movie.findById(id).lean();

  if (!movie) {
    res.status(404).json({
      success: false,
      message: 'Movie not found.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: movie,
  });
};

export const createMovie = async (req: AuthRequest, res: Response): Promise<void> => {
  const movieData = req.body;

  // Check unique slug
  const existing = await Movie.findOne({ slug: movieData.slug.toLowerCase() });
  if (existing) {
    res.status(409).json({
      success: false,
      message: `The slug '${movieData.slug}' is already taken. Please choose a distinct slug.`,
    });
    return;
  }

  const movie = await Movie.create(movieData);

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'MOVIE_CREATED',
    entityType: 'Movie',
    entityId: movie._id.toString(),
    details: { title: movie.title, slug: movie.slug, publicationStatus: movie.publicationStatus },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: 'Movie successfully created.',
    data: movie,
  });
};

export const updateMovie = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  const movie = await Movie.findById(id);
  if (!movie) {
    res.status(404).json({
      success: false,
      message: 'Movie not found.',
    });
    return;
  }

  // Check unique slug if changed
  if (updateData.slug && updateData.slug.toLowerCase() !== movie.slug) {
    const existing = await Movie.findOne({
      slug: updateData.slug.toLowerCase(),
      _id: { $ne: id },
    });
    if (existing) {
      res.status(409).json({
        success: false,
        message: `The slug '${updateData.slug}' is already taken.`,
      });
      return;
    }
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedMovie) {
    res.status(404).json({
      success: false,
      message: 'Movie not found.',
    });
    return;
  }

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'MOVIE_UPDATED',
    entityType: 'Movie',
    entityId: updatedMovie._id.toString(),
    details: { title: updatedMovie.title, slug: updatedMovie.slug, publicationStatus: updatedMovie.publicationStatus },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Movie successfully updated.',
    data: updatedMovie,
  });
};

export const deleteMovie = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const movie = await Movie.findById(id);

  if (!movie) {
    res.status(404).json({
      success: false,
      message: 'Movie not found.',
    });
    return;
  }

  // Delete associated images safely if desired
  if (movie.posterUrl) {
    await deleteUploadedFile(movie.posterUrl);
  }
  if (movie.bannerUrl) {
    await deleteUploadedFile(movie.bannerUrl);
  }

  await Movie.findByIdAndDelete(id);

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'MOVIE_DELETED',
    entityType: 'Movie',
    entityId: id,
    details: { title: movie.title, slug: movie.slug },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: `Movie '${movie.title}' deleted successfully.`,
  });
};
