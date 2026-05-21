import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { verifyPassword, generateToken, setAuthCookie } from '../../../../lib/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user and explicitly select password field (which is select: false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate token and set cookie
    const token = generateToken({ userId: user._id, location: user.location });
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
