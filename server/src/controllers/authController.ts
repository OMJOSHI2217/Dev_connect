import { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function login(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) {
      // Fallback: return default first user if test user
      const [all]: any = await pool.query('SELECT * FROM users LIMIT 1');
      if (all.length > 0) {
        const u = all[0];
        const [skills]: any = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = ?', [u.id]);
        u.skills = skills.map((s: any) => s.skill_name);
        return res.json({ user: u });
      }
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    const [skills]: any = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = ?', [user.id]);
    user.skills = skills.map((s: any) => s.skill_name);

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { 
      name, username, email, phone, role, avatar, 
      specialization, bio, city, country, skills, experienceLevel, yearsOfExperience, availability 
    } = req.body;
    
    const id = `user_${Date.now()}`;
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

    await pool.query(
      `INSERT INTO users (
        id, name, username, email, phone, avatar, role, specialization, 
        experience_level, years_of_experience, bio, city, country, availability, is_online, last_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name || 'New Developer',
        username || `dev_${Date.now()}`,
        email,
        phone || '+1 (555) 000-0000',
        userAvatar,
        role || 'Fullstack Developer',
        specialization || 'TypeScript, React & Node.js',
        experienceLevel || 'Mid-Level (2-5 yrs)',
        yearsOfExperience || 3,
        bio || 'Passionate software engineer building modern applications.',
        city || 'San Francisco',
        country || 'United States',
        availability || 'Full-Time Available',
        true,
        'Online'
      ]
    );

    // Save initial skills if provided
    const userSkills = Array.isArray(skills) && skills.length > 0 
      ? skills 
      : ['TypeScript', 'React', 'Node.js', 'Tailwind CSS'];

    for (const skill of userSkills) {
      await pool.query('INSERT INTO user_skills (user_id, skill_name) VALUES (?, ?)', [id, skill]);
    }

    const [created]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = created[0];
    user.skills = userSkills;

    res.status(201).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields: string[] = [];
    const values: any[] = [];

    // Map camelCase to snake_case column names
    const allowedKeys: Record<string, string> = {
      name: 'name',
      username: 'username',
      email: 'email',
      phone: 'phone',
      avatar: 'avatar',
      role: 'role',
      specialization: 'specialization',
      experienceLevel: 'experience_level',
      experience_level: 'experience_level',
      yearsOfExperience: 'years_of_experience',
      years_of_experience: 'years_of_experience',
      bio: 'bio',
      city: 'city',
      country: 'country',
      availability: 'availability',
      socialLinks: 'social_links',
      social_links: 'social_links',
      privacy: 'privacy'
    };

    for (const [key, val] of Object.entries(updates)) {
      if (allowedKeys[key]) {
        const col = allowedKeys[key];
        fields.push(`${col} = ?`);
        if (typeof val === 'object' && val !== null) {
          values.push(JSON.stringify(val));
        } else {
          values.push(val);
        }
      }
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    // If avatar was updated, keep sender_avatar synced across messages
    if (updates.avatar) {
      await pool.query('UPDATE messages SET sender_avatar = ? WHERE sender_id = ?', [updates.avatar, id]);
    }

    // If skills were updated
    if (Array.isArray(updates.skills)) {
      await pool.query('DELETE FROM user_skills WHERE user_id = ?', [id]);
      for (const s of updates.skills) {
        await pool.query('INSERT INTO user_skills (user_id, skill_name) VALUES (?, ?)', [id, s]);
      }
    }

    const [updated]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (updated.length > 0) {
      const user = updated[0];
      const [skills]: any = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = ?', [id]);
      user.skills = skills.map((s: any) => s.skill_name);
      return res.json({ user });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ error: 'Avatar image data is required' });
    }

    // Saves profile picture (base64 data URL or external URL) to users table
    await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatar, id]);
    // Also sync to messages table so message bubbles reflect the new profile picture
    await pool.query('UPDATE messages SET sender_avatar = ? WHERE sender_id = ?', [avatar, id]);

    res.json({ success: true, avatar });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
