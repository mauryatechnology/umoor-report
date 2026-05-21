import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../lib/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Make sure we have the required Vercel Blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Vercel Blob storage is not configured' }, { status: 500 });
    }

    // Create a folder path specific to the user to organize blobs
    const userPath = `${authUser.location}/${Date.now()}-${filename}`;

    const blob = await put(userPath, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
