// Import necessary modules and models
import { NextResponse } from "next/server";
import connectDb from "../../../../../backend/middleware/db";
import axios from 'axios'; //for calling external APi
import * as cheerio from 'cheerio'; //Cheerio is a library for working with HTML and XML documents
import { EventEmitter } from 'events'; // Used to manage and track the progress of multiple scraping job

// Event emitter to track scraping progress
const scrapeEmitter = new EventEmitter();
scrapeEmitter.setMaxListeners(20);
const progressTracker = {};

// Function to map score to difficulty and dynamically generate Amazon URL based on the subject
const getAmazonUrlByScore = (score, subject) => {
  let difficulty = '';
  let urlBase = `https://www.amazon.com/s?k=${encodeURIComponent(subject)}+books`;

  if (score >= 0 && score <= 10) {
    difficulty = 'beginner';
  } else if (score > 10 && score <= 20) {
    difficulty = 'intermediate';
  } else if (score > 20 && score <= 30) {
    difficulty = 'advanced';
  } else if (score > 30 && score <= 40) {
    difficulty = 'professional';
  } else if (score > 40 && score <= 50) {
    difficulty = 'expert';
  } else {
    difficulty = 'generic';
  }

  const url = `${urlBase}+${difficulty}`;
  return { url, difficulty };
};

// Function to scrape books from Amazon using Cheerio
const scrapeBooksFromAmazon = async (url, jobId) => {
  progressTracker[jobId] = 0; // Initialize progress
  try {
    // Make a request to the Amazon URL
    //create object name data
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    progressTracker[jobId] = 50;

    //  Load the HTML data into Cheerio
    // data come in unformated way so we can
    //  store it in structured way with the help of cheerio
    const $ = cheerio.load(data);
    const books = [];

    // Iterate through the Amazon search results and extract book information,tags
    $('.s-result-item').each((index, element) => {
      const title = $(element).find('h2 a span').text().trim();
      const author = $(element).find('.a-row.a-size-base.a-color-secondary .a-size-base+ .a-size-base').text().trim();
      const description = $(element).find('.a-size-base.a-color-secondary').text().trim();
      const thumbnailUrl = $(element).find('.s-image').attr('src');
      const bookUrl = $(element).find('h2 a').attr('href');
// puch in books empty array
      if (title && thumbnailUrl) {
        books.push({
          title,
          author: author || 'Unknown Author',
          description: description || 'No description available',
          thumbnailUrl,
          bookUrl: `https://www.amazon.com${bookUrl}`
        });
      }
    });

    progressTracker[jobId] = 100;
    return books;
  } catch (error) {
    console.error(`Job ${jobId}: Scraping error:`, error);
    throw error;
  }
};

// Define the handler function for fetching books based on score and subject
const fetchBooksHandler = async (request) => {
  try {
    // Extract score and subject from the request body
    const { score, subject } = await request.json();

    // Validate score and subject input
    if (!subject || typeof subject !== 'string') {
      return NextResponse.json(
        { message: 'Invalid subject. Please provide a valid subject.' },
        { status: 400 }
      );
    }

    // Map score and subject to difficulty level and generate the corresponding Amazon URL
    const { url, difficulty } = getAmazonUrlByScore(score, subject);

    // Create a unique jobId for this scrape request
    const jobId = Date.now();

    // Scrape books from the Amazon URL
    const books = await scrapeBooksFromAmazon(url, jobId);

    // Return the scraped books
    return NextResponse.json(
      {
        message: 'Books fetched successfully',
        difficulty,
        books,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { message: 'Failed to fetch books' },
      { status: 500 }
    );
  }
};

// Connect the handler function to the POST method
export const POST = connectDb(fetchBooksHandler);
