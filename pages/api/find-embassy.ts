import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { source, destination } = req.query;


  if (typeof source !== 'string' || typeof destination != 'string') {
    return res.status(400).json({ error: 'Invalid or missing parameter' });
  }

  try {
    // Construct the URL with sanitized source and destination values
    const url = `https://embassy-finder.com/${sanitizeText(source)}_in_${sanitizeText(destination)}`;
    
    // Make a GET request to the specified URL
    const response = await axios.get(url);

    // Load the HTML content into Cheerio
    const cheerio = require('cheerio');
    const $ = cheerio.load(response.data);

   // Select all tables with the class "embassy-info"
   const embassyTables = $('.embassy-info');

   // Extract table data into an array of objects
   const tablesData = embassyTables.map((index: any, element: any) => {
     const tableData: { [key: string]: string } = {};
     $(element).find('tr').each((i: any, row: any) => {
       const key = $(row).find('th').text().trim().toLowerCase();
       const value = $(row).find('td').text().trim().replace(/\n/g, " ");
       tableData[key] = value;
     });
     return tableData;
   }).get(); // Convert Cheerio collection to an array

   res.status(200).json({ data: tablesData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping data.' });
  }
};

function sanitizeText(text:string) {
    return text.replace(/\s+/g, '-');
  }

