import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Report from '../../../../models/Report';
import { getAuthUser } from '../../../../lib/auth';

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { location } = resolvedParams;

    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Find the report for this location
    const report = await Report.findOne({ location: location.toLowerCase() });
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Fetch report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const { location } = resolvedParams;
    
    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    // Auth check
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Authorization check - users can only update their own location
    if (authUser.location !== location.toLowerCase()) {
      return NextResponse.json({ error: 'Forbidden: You can only update your own report' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    const { language, data, headerSettings } = body;

    // Mode 1: Header settings update
    if (headerSettings) {
      const report = await Report.findOneAndUpdate(
        { location: location.toLowerCase() },
        { $set: { headerSettings } },
        { new: true, runValidators: true }
      );

      if (!report) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Header settings updated successfully', report });
    }

    // Mode 2: Language data update (existing behavior)
    if (!language || !['en', 'ur'].includes(language)) {
      return NextResponse.json({ error: 'Valid language (en or ur) is required' }, { status: 400 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Update data is required' }, { status: 400 });
    }

    // Determine which field to update
    const updateField = language === 'en' ? 'reportsDataEn' : 'reportsDataUr';
    
    // Using FindOneAndUpdate to modify only the specified language block
    const report = await Report.findOneAndUpdate(
      { location: location.toLowerCase() },
      { $set: { [updateField]: data } },
      { new: true, runValidators: true }
    );
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Report updated successfully', report });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
