import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log('[SETUP] 🔧 Setting admin password for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if admin exists in admins table
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (adminError || !admin) {
      console.log('[SETUP] ❌ Admin not found in database:', email);
      return NextResponse.json(
        { error: 'Admin user not found in database' },
        { status: 404 }
      );
    }

    console.log('[SETUP] ✅ Admin found in database:', {
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Check if user exists in Supabase Auth
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('[SETUP] ❌ Failed to list auth users:', listError.message);
      return NextResponse.json(
        { error: `Failed to list auth users: ${listError.message}` },
        { status: 500 }
      );
    }

    const existingUser = existingUsers?.users?.find(user => user.email === email);

    let authData;
    if (existingUser) {
      // Update existing user password
      console.log('[SETUP] 🔄 Updating existing user password...');
      const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: password }
      );
      
      if (updateError) {
        console.log('[SETUP] ❌ Failed to update password:', updateError.message);
        return NextResponse.json(
          { error: `Failed to update password: ${updateError.message}` },
          { status: 500 }
        );
      }
      authData = data;
    } else {
      // Create new user
      console.log('[SETUP] ➕ Creating new auth user...');
      const { data, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });
      
      if (createError) {
        console.log('[SETUP] ❌ Failed to create user:', createError.message);
        return NextResponse.json(
          { error: `Failed to create user: ${createError.message}` },
          { status: 500 }
        );
      }
      authData = data;
    }

    console.log('[SETUP] ✅ Password updated successfully for:', email);

    // Update last_login in admins table
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    return NextResponse.json({
      success: true,
      message: 'Admin password set successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        full_name: admin.full_name
      }
    });

  } catch (error) {
    console.error('[SETUP] 💥 Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('[SETUP] 📋 Listing all admin users...');

    // Get all admins
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('*');

    if (adminsError) {
      return NextResponse.json(
        { error: `Failed to fetch admins: ${adminsError.message}` },
        { status: 500 }
      );
    }

    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json(
        { error: `Failed to fetch auth users: ${authError.message}` },
        { status: 500 }
      );
    }

    const adminList = admins?.map(admin => {
      const authUser = authUsers?.users?.find(user => user.email === admin.email);
      return {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        created_at: admin.created_at,
        last_login: admin.last_login,
        auth_user_id: authUser?.id,
        auth_confirmed: !!authUser?.email_confirmed_at
      };
    });

    return NextResponse.json({
      success: true,
      admins: adminList || [],
      total: adminList?.length || 0
    });

  } catch (error) {
    console.error('[SETUP] 💥 Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
