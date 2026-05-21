import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Report from '../../../../models/Report';
import { hashPassword, generateToken, setAuthCookie } from '../../../../lib/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, contact, location } = body;

    // Validation
    if (!name || !email || !password || !contact || !location) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const slugifiedLocation = location.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Check existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Check existing location
    const existingLocation = await User.findOne({ location: slugifiedLocation });
    if (existingLocation) {
      return NextResponse.json({ error: 'Location is already taken' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      location: slugifiedLocation,
    });

    // Create initial report
    await Report.create({
      userId: user._id,
      location: slugifiedLocation,
    });

    // Generate token and set cookie
    const token = generateToken({ userId: user._id, location: user.location });
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        name: user.name,
        email: user.email,
        location: user.location,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
