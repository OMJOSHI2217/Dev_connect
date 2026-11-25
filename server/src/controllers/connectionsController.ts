import { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function getRequests(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const [requests]: any = await pool.query(
      `SELECT r.*, 
              fu.name as from_name, fu.avatar as from_avatar, fu.role as from_role,
              tu.name as to_name, tu.avatar as to_avatar, tu.role as to_role
       FROM connection_requests r
       JOIN users fu ON r.from_user_id = fu.id
       JOIN users tu ON r.to_user_id = tu.id
       WHERE r.from_user_id = ? OR r.to_user_id = ?
       ORDER BY r.created_at DESC`,
      [userId, userId]
    );

    const formatted = requests.map((r: any) => ({
      id: r.id,
      fromUserId: r.from_user_id,
      toUserId: r.to_user_id,
      fromUser: {
        id: r.from_user_id,
        name: r.from_name,
        avatar: r.from_avatar,
        role: r.from_role
      },
      toUser: {
        id: r.to_user_id,
        name: r.to_name,
        avatar: r.to_avatar,
        role: r.to_role
      },
      status: r.status,
      message: r.message,
      projectInterest: r.project_interest,
      createdAt: r.created_at
    }));

    res.json({ requests: formatted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function sendRequest(req: Request, res: Response) {
  try {
    const { fromUserId, toUserId, message, projectInterest } = req.body;
    const id = `req_${Date.now()}`;

    // Clear any previous declined requests between these users so they can reconnect cleanly
    await pool.query(
      `DELETE FROM connection_requests 
       WHERE ((from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?))
         AND status = 'declined'`,
      [fromUserId, toUserId, toUserId, fromUserId]
    );

    await pool.query(
      `INSERT INTO connection_requests (id, from_user_id, to_user_id, status, message, project_interest)
       VALUES (?, ?, ?, 'pending', ?, ?)`,
      [id, fromUserId, toUserId, message || '', projectInterest || null]
    );

    res.status(201).json({ id, status: 'pending' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateRequestStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await pool.query('UPDATE connection_requests SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
