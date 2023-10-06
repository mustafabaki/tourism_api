// pages/api/myendpoint.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { translate } from '@vitalets/google-translate-api';
import axios from 'axios';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { param1, param2 } = req.query;

  const { text } = await translate(`Neden böyle yapıyorsun? ${param1} ${param2}`, { to: 'fr' });
  res.status(200).json({ message: text });
};
