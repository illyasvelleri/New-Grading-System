import formidable from 'formidable';
import xlsx from 'xlsx';
import fs from 'fs';
import db from '../../lib/db';
import Student from '../../models/Student';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await db();
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Failed to parse file' });

      const filePath = files.file[0].filepath;
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      for (const entry of data) {
        const { name, batch } = entry;
        const roll = Math.floor(1000 + Math.random() * 9000);
        await Student.create({ name, batch, roll });
      }

      fs.unlinkSync(filePath);
      res.status(200).json({ success: true });
    });
  }
}