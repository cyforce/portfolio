import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filename } = req.query;
    const filePath = path.join(process.cwd(), 'uploads', filename as string);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'image/jpeg'); // Adaptez au type d’image
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).json({ error: 'Image non trouvée' });
    }
}
