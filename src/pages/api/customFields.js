import db from '../../lib/db';
import Field from '../../models/Field';

export default async function handler(req, res) {
  await db();

  if (req.method === 'GET') {
    const fields = await Field.find({});
    res.status(200).json(fields);
  } else {
    res.status(405).end();
  }
}
