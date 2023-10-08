// pages/api/countryinfo.ts

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const fetchCountryInfo = async (country: string) => {
    try {
        // Fetch the HTML content of the page
        const response = await axios.get<string>(`https://www.countryflags.com/flag-of-${country.replace(/\s+/g, '-')}/`); // Replace with the actual URL

        const cheerio = require('cheerio');
        // Load the HTML content into Cheerio
        const $ = cheerio.load(response.data);

        // Select the container with class "cf-countryinfo"
        const container = $('.cf-countryinfo');

        // Extract the relevant information from the container
        const population = container.find('.h3').eq(0).text();
        const surfaceAreaSqMi = container.find('.h3').eq(1).text();
        const surfaceAreaKm2 = container.find('.h3').eq(2).text();
        const populationDensitySqMi = container.find('.h3').eq(3).text();
        const populationDensityKm2 = container.find('.h3').eq(4).text();

        const container2 = $('.col-12.col-md-4.p-2.p-md-5.my-3.my-md-0');

        // Extract the relevant information from the container
        const countryName = container2.find('.col-7.text-primary.text-md-nowrap').eq(0).text();
        const continent = container2.find('.col-7.text-primary.text-md-nowrap').eq(1).text();
        const officialLanguages = container2.find('.col-7.text-primary').eq(2).text();
        const capital = container2.find('.col-7.text-primary.text-md-nowrap').eq(2).text();
        const government = container2.find('.col-7.text-primary').eq(4).text();
        const borderLength = container2.find('.col-7.text-primary.text-md-nowrap').eq(3).text();

        const neighborsList: string[] = [];

        var counter = 0;
        container2.find('.col-4').each((index: any, element: any) => {
            if (counter % 3 === 0) {
                const text = $(element).text().split(":")[0];
                neighborsList.push(text);
            }
            counter++;
        });



        // Create an object with the extracted data
        const responseData = {
            countryName,
            continent,
            officialLanguages,
            capital,
            government,
            borderLength,
            population,
            surfaceAreaSqMi,
            surfaceAreaKm2,
            populationDensitySqMi,
            populationDensityKm2,
            neighborsList
        };

        // Return the response data
        return responseData;
    } catch (error) {
        console.error('Error fetching and parsing data:', error);
        return null;
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { country } = req.query;

    if (typeof country === 'string') {
        const data = await fetchCountryInfo(country);
    
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(500).json({ error: 'Error fetching data' });
        }
      } else {
        res.status(400).json({ error: 'Invalid country parameter' });
      }
};
