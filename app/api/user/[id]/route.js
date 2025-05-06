// app/api/user/[id]/route.js
import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongoose'; // adjust the path as needed
import User from '@/models/User';

// GET /api/user/[id]
export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}

// PUT /api/user/[id]
export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;
  const data = await request.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: 'Update failed', error: error.message }, { status: 500 });
  }
}

// DELETE /api/user/[id]
export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Delete failed', error: error.message }, { status: 500 });
  }
}
