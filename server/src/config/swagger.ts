export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'BR Films Cinema Distribution & Admin CMS API',
    version: '1.0.0',
    description:
      'Production REST API for BR Films: Movie Catalog, Enquiries, Admin CMS, Media Management, and Dynamic Site Settings.',
    contact: {
      name: 'BR Films Engineering Team',
      email: 'tech@brfilms.in',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
      },
    },
    schemas: {
      Movie: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          shortDescription: { type: 'string' },
          synopsis: { type: 'string' },
          posterUrl: { type: 'string' },
          bannerUrl: { type: 'string' },
          galleryImages: { type: 'array', items: { type: 'string' } },
          trailerUrl: { type: 'string' },
          language: { type: 'string' },
          genres: { type: 'array', items: { type: 'string' } },
          durationMinutes: { type: 'number' },
          releaseDate: { type: 'string', format: 'date-time' },
          releaseDateConfirmed: { type: 'boolean' },
          releaseStatus: { type: 'string', enum: ['Draft', 'Upcoming', 'Released', 'Postponed'] },
          distributionTerritories: { type: 'array', items: { type: 'string' } },
          isFeatured: { type: 'boolean' },
          publicationStatus: { type: 'string', enum: ['Draft', 'Published', 'Archived'] },
        },
      },
      EnquiryInput: {
        type: 'object',
        required: ['fullName', 'email', 'mobileNumber', 'enquiryType', 'message'],
        properties: {
          fullName: { type: 'string' },
          companyOrTheatre: { type: 'string' },
          email: { type: 'string', format: 'email' },
          mobileNumber: { type: 'string' },
          enquiryType: {
            type: 'string',
            enum: [
              'Theatre / Exhibitor Partnership',
              'Film Distribution Proposal',
              'Producer / Film Submission',
              'Business Partnership',
              'General Enquiry',
            ],
          },
          movieTitle: { type: 'string' },
          territory: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'System health check',
        responses: { '200': { description: 'API is running' } },
      },
    },
    '/movies': {
      get: {
        summary: 'Get published movie catalogue',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'Upcoming', 'Released'] } },
          { name: 'genre', in: 'query', schema: { type: 'string' } },
          { name: 'language', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'List of published movies' } },
      },
    },
    '/movies/featured': {
      get: {
        summary: 'Get featured movies for homepage',
        responses: { '200': { description: 'List of featured movies' } },
      },
    },
    '/movies/upcoming': {
      get: {
        summary: 'Get upcoming movies',
        responses: { '200': { description: 'List of upcoming movies' } },
      },
    },
    '/movies/released': {
      get: {
        summary: 'Get released movies',
        responses: { '200': { description: 'List of released movies' } },
      },
    },
    '/movies/{slug}': {
      get: {
        summary: 'Get single movie details by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Movie details with related titles' }, '404': { description: 'Not found' } },
      },
    },
    '/enquiries': {
      post: {
        summary: 'Submit a new business enquiry',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/EnquiryInput' } } },
        },
        responses: { '201': { description: 'Enquiry received with reference number and WhatsApp chat link' } },
      },
    },
    '/site-settings': {
      get: {
        summary: 'Get public site settings and company profile',
        responses: { '200': { description: 'Public site settings' } },
      },
    },
    '/pages/{slug}': {
      get: {
        summary: 'Get website page by slug (e.g. privacy-policy, terms-of-use)',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Page content' }, '404': { description: 'Page not found' } },
      },
    },
    '/admin/auth/login': {
      post: {
        summary: 'Admin login',
        responses: { '200': { description: 'JWT token and session cookie' } },
      },
    },
    '/admin/dashboard': {
      get: {
        summary: 'Admin dashboard statistics and KPI overview',
        security: [{ BearerAuth: [] }],
        responses: { '200': { description: 'Dashboard metrics' } },
      },
    },
  },
};
