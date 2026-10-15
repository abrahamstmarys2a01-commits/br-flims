import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { runSeed } from '../src/seed/seed.js';
import { Movie } from '../src/models/Movie.js';
import { Enquiry } from '../src/models/Enquiry.js';
import { AdminUser } from '../src/models/AdminUser.js';

let adminToken: string = '';

beforeAll(async () => {
  await connectDB();
  await runSeed();
  
  // Login as admin
  const loginRes = await request(app)
    .post('/api/v1/admin/auth/login')
    .send({
      email: 'admin@brfilms.in',
      password: 'Admin@BRFilms2026',
    });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.success).toBe(true);
  expect(loginRes.body.token).toBeDefined();
  adminToken = loginRes.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe('1. Authentication & Security', () => {
  it('should reject invalid admin credentials with 401', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@brfilms.in',
        password: 'wrong_password_123',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should deny unauthorized access to admin endpoints', async () => {
    const res = await request(app).get('/api/v1/admin/movies');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should allow access to admin endpoints with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/admin/movies')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('2. Movie Management & Public Catalog Integrity', () => {
  it('should load initial seeded movies in public catalogue', async () => {
    const res = await request(app).get('/api/v1/movies');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    const slugs = res.body.data.map((m: any) => m.slug);
    expect(slugs).toContain('lenin-pandiyan');
    expect(slugs).toContain('train');
  });

  it('should fetch single movie details by slug', async () => {
    const res = await request(app).get('/api/v1/movies/lenin-pandiyan');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Lenin Pandiyan');
    expect(res.body.data.posterUrl).toContain('lenin-pandiyan');
  });

  it('should create a new movie as draft and ensure it is NOT visible publicly', async () => {
    const draftMovie = {
      title: 'Secret Upcoming Project',
      slug: 'secret-upcoming-project',
      posterUrl: '/uploads/movies/test.webp',
      language: 'Tamil',
      genres: ['Thriller'],
      publicationStatus: 'Draft',
      releaseStatus: 'Upcoming',
    };

    const createRes = await request(app)
      .post('/api/v1/admin/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(draftMovie);

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.publicationStatus).toBe('Draft');

    // Verify it is NOT returned on public endpoints
    const publicList = await request(app).get('/api/v1/movies');
    const slugs = publicList.body.data.map((m: any) => m.slug);
    expect(slugs).not.toContain('secret-upcoming-project');

    // Verify 404 on direct public detail route
    const publicDetail = await request(app).get('/api/v1/movies/secret-upcoming-project');
    expect(publicDetail.status).toBe(404);
  });

  it('should reject creating duplicate movie slugs', async () => {
    const duplicate = {
      title: 'Lenin Pandiyan Part 2',
      slug: 'lenin-pandiyan', // Already exists
      posterUrl: '/uploads/movies/lenin-pandiyan.webp',
      publicationStatus: 'Published',
    };

    const res = await request(app)
      .post('/api/v1/admin/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(duplicate);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe('3. Business Enquiries Workflow', () => {
  let createdRef = '';

  it('should submit enquiry, persist in DB, and generate reference number', async () => {
    const enquiryData = {
      fullName: 'Vetrivel Theatre Admin',
      companyOrTheatre: 'Vetrivel Cinemas Chennai',
      email: 'exhibitor@vetrivelcinemas.com',
      mobileNumber: '+91 98840 99887',
      enquiryType: 'Theatre / Exhibitor Partnership',
      movieTitle: 'Lenin Pandiyan',
      territory: 'Chennai & Chengalpet',
      message: 'Requesting screening terms and distribution dates for Lenin Pandiyan for 4 shows daily.',
    };

    const res = await request(app)
      .post('/api/v1/enquiries')
      .send(enquiryData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.referenceNumber).toMatch(/^BRF-\d{4}-\d{4}$/);
    expect(res.body.whatsappUrl).toBeDefined();
    createdRef = res.body.referenceNumber;

    // Verify persisted in DB
    const dbRecord = await Enquiry.findOne({ referenceNumber: createdRef });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.fullName).toBe('Vetrivel Theatre Admin');
  });

  it('should allow admin to inspect, update status, and add notes to enquiry', async () => {
    const listRes = await request(app)
      .get(`/api/v1/admin/enquiries?search=${createdRef}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);
    const enquiryId = listRes.body.data[0]._id;

    // Update status to 'In Progress'
    const updateRes = await request(app)
      .patch(`/api/v1/admin/enquiries/${enquiryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'In Progress' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('In Progress');

    // Add note
    const noteRes = await request(app)
      .post(`/api/v1/admin/enquiries/${enquiryId}/notes`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ text: 'Spoke with theatre manager, agreed on 50% sharing ratio.' });

    expect(noteRes.status).toBe(200);
    expect(noteRes.body.data.internalNotes.length).toBeGreaterThanOrEqual(1);
  });
});

describe('4. Site Settings & Dynamic Updates', () => {
  it('should retrieve public site settings without sensitive fields', async () => {
    const res = await request(app).get('/api/v1/site-settings');
    expect(res.status).toBe(200);
    expect(res.body.data.companyName).toBe('BR Films');
    expect(res.body.data.officialLogoUrl).toBeDefined();
    expect(res.body.data.services.length).toBeGreaterThanOrEqual(4);
  });

  it('should allow admin to update company profile and reflect dynamically', async () => {
    const updatePayload = {
      tagline: 'Leading South Indian Cinema Distribution Network',
      contactPhone: '+91 94440 99999',
    };

    const updateRes = await request(app)
      .patch('/api/v1/admin/site-settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatePayload);

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.tagline).toBe('Leading South Indian Cinema Distribution Network');

    // Verify public settings immediately reflect the change
    const publicRes = await request(app).get('/api/v1/site-settings');
    expect(publicRes.body.data.tagline).toBe('Leading South Indian Cinema Distribution Network');
    expect(publicRes.body.data.contactPhone).toBe('+91 94440 99999');
  });
});
