import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Integration test - tests against real Supabase database
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

describe('Escrow Integration Tests', () => {
  let supabase: ReturnType<typeof createClient>;
  let buyerId: string;
  let sellerId: string;
  let escrowId: string;

  beforeAll(async () => {
    // Initialize Supabase client
    supabase = createClient(supabaseUrl, supabaseKey);

    // Create test users
    const buyerEmail = `buyer-${Date.now()}@test.com`;
    const sellerEmail = `seller-${Date.now()}@test.com`;

    // Note: In real integration tests, you would create actual auth users
    // For now, we'll use mock IDs that would exist in the database
    buyerId = 'test-buyer-id';
    sellerId = 'test-seller-id';
  });

  afterAll(async () => {
    // Cleanup test data
    if (escrowId) {
      await supabase.from('escrows').delete().eq('id', escrowId);
    }
  });

  it('should create an escrow with valid data', async () => {
    const { data, error } = await supabase
      .from('escrows')
      .insert({
        title: 'Integration Test Escrow',
        description: 'Test escrow for integration testing',
        buyer_id: buyerId,
        seller_id: sellerId,
        amount: '100.00',
        currency: 'USD',
        status: 'created',
        transaction_type: 'products',
        delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        inspection_period_days: 3,
      })
      .select();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.[0]?.status).toBe('created');

    if (data?.[0]) {
      escrowId = data[0].id;
    }
  });

  it('should retrieve created escrow', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .select('*')
      .eq('id', escrowId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.title).toBe('Integration Test Escrow');
    expect(data?.amount).toBe('100.00');
  });

  it('should update escrow status to funded', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .update({
        status: 'funded',
        funded_at: new Date().toISOString(),
      })
      .eq('id', escrowId)
      .select();

    expect(error).toBeNull();
    expect(data?.[0]?.status).toBe('funded');
    expect(data?.[0]?.funded_at).toBeDefined();
  });

  it('should update escrow status to accepted', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', escrowId)
      .select();

    expect(error).toBeNull();
    expect(data?.[0]?.status).toBe('accepted');
    expect(data?.[0]?.accepted_at).toBeDefined();
  });

  it('should update escrow status to delivered', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
      })
      .eq('id', escrowId)
      .select();

    expect(error).toBeNull();
    expect(data?.[0]?.status).toBe('delivered');
    expect(data?.[0]?.delivered_at).toBeDefined();
  });

  it('should update escrow status to released', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
      })
      .eq('id', escrowId)
      .select();

    expect(error).toBeNull();
    expect(data?.[0]?.status).toBe('released');
    expect(data?.[0]?.released_at).toBeDefined();
  });

  it('should list escrows for buyer', async () => {
    const { data, error } = await supabase
      .from('escrows')
      .select('*')
      .eq('buyer_id', buyerId)
      .limit(10);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should list escrows for seller', async () => {
    const { data, error } = await supabase
      .from('escrows')
      .select('*')
      .eq('seller_id', sellerId)
      .limit(10);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should verify all timestamp columns exist and are populated', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .select('funded_at, accepted_at, delivered_at, released_at, disputed_at, created_at, updated_at')
      .eq('id', escrowId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.funded_at).toBeDefined();
    expect(data?.accepted_at).toBeDefined();
    expect(data?.delivered_at).toBeDefined();
    expect(data?.released_at).toBeDefined();
    expect(data?.created_at).toBeDefined();
    expect(data?.updated_at).toBeDefined();
  });

  it('should verify transaction_type enum is stored correctly', async () => {
    if (!escrowId) {
      throw new Error('No escrow ID from previous test');
    }

    const { data, error } = await supabase
      .from('escrows')
      .select('transaction_type')
      .eq('id', escrowId)
      .single();

    expect(error).toBeNull();
    expect(data?.transaction_type).toBe('products');
  });
});
