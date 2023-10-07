import { NextApiRequest, NextApiResponse } from 'next';
import { translate } from '@vitalets/google-translate-api';
import axios from 'axios';
import cheerio from 'cheerio';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { continent, country, language } = req.body;


    var response = await axios.get(`https://www.worldtravelguide.net/guides/${continent}/${country}/things-to-do/`);
    var data = response.data;

    const cheerio = require('cheerio');

    // now, extract the parts you want using cheerio ... 

    var $ = cheerio.load(data);

    var paragraphs = "";

    const things_to_do = $('article p').map((index: number, element: any) => {


        const title = $(element).prev('h3').text();
        const activity = $(element).text();
        if (title !== "") {
            return { title, activity };
        }

    }).get();


    let text = paragraphs;
    if (language) {

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const translationResult = await translate(paragraphs, { to: language });

        text = translationResult.text;

    }

    res.status(200).json({
        data: {
            activities: things_to_do
        }
    });
};


