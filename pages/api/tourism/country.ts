import { NextApiRequest, NextApiResponse } from 'next';
import { translate } from '@vitalets/google-translate-api';
import axios from 'axios';
import cheerio from 'cheerio';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { continent, country } = req.body;

  const response = await axios.get(`https://www.worldtravelguide.net/guides/${continent}/${country}/`);
  const data = response.data;

  // now, extract the parts you want using cheerio ... 

  const cheerio = require('cheerio');

  const $ = cheerio.load(data);

  const firstTwoParagraphs = $('article > p').slice(0, 2);

  const paragraphs: any[] = []

  firstTwoParagraphs.each((element: any) => {
    console.log($(element).text());

    paragraphs.push($(element).text());
  });

  



  res.status(200).json({ message: data });
};
