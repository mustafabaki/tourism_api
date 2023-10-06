import { NextApiRequest, NextApiResponse } from 'next';
import { translate } from '@vitalets/google-translate-api';
import axios from 'axios';
import cheerio from 'cheerio';
import { HttpProxyAgent } from 'http-proxy-agent';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { continent, country, language } = req.body;

  const agent = new HttpProxyAgent('http://168.63.76.32:3128');

  var response = await axios.get(`https://www.worldtravelguide.net/guides/${continent}/${country}/`);
  var data = response.data;

  const cheerio = require('cheerio');

  var $ = cheerio.load(data);

  // Select the container with class "keyfacts"
  const keyFactsContainer = $('.keyfacts');

  // Initialize an empty object to store the extracted information
  const keyFacts: Record<string, string> = {};

  // Select all rows with class "row info" within the container
  const rows = keyFactsContainer.find('.row.info');

  // Loop through each row and extract the key-value pairs
  rows.each(async (_index: any, rowElement: any) => {
    const row = $(rowElement);
    const keyElement = row.find('.col-md-4');
    const valueElement = row.find('.col-md-8 p');

    // Extract and format the key
    const key = keyElement.text().trim().replace(/:/g, '').replace(/\s+/g, '_').toLowerCase();
    const value = valueElement.text().trim().replace(/./g, '');

    // Translate the value using Google Translate API
    const translatedValue = await translate(value, { to: language }); // Replace 'your_target_language' with the desired target language code

    keyFacts[key] = translatedValue.text;
  });

  // now, extract the parts you want using cheerio ... 


  var $ = cheerio.load(data);

  var paragraphs = "";

  $('article p').each((index: number, element: any) => {
    if (index < 2) {
      paragraphs = paragraphs + $(element).text();
    }
  });

  const imageUrl = $('#myCarousel img').eq(0).attr('src');

  response = await axios.get(`https://www.worldtravelguide.net/guides/${continent}/${country}/pictures/`);

  $ = cheerio.load(response.data);

  // Select all img elements within the article
  const imgElements = $('article img').slice(0, -1);

  // Extract and store the image URLs and their corresponding h2 elements in an array of objects
  const imageInfoArray = imgElements.map((index: any, element: any) => {
    const imageUrl = $(element).attr('src');
    const title = $(element).prev('h2').text(); // Select the previous h2 element
    return { imageUrl, title };
  }).get();



  const { text } = await translate(paragraphs, { to: language });



  res.status(200).json({
    data: {
      info: text,
      image_url: imageUrl,
      country_images: imageInfoArray,
      key_facts: keyFacts
    }
  });
};


