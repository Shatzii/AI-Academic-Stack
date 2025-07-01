import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage.js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const accounts = await storage.getSocialMediaAccounts(userId || undefined);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching social media accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch social media accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const account = await storage.createSocialMediaAccount(body);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating social media account:', error);
    return NextResponse.json({ error: 'Failed to create social media account' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    
    const account = await storage.updateSocialMediaAccount(id, body);
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error updating social media account:', error);
    return NextResponse.json({ error: 'Failed to update social media account' }, { status: 500 });
  }
}