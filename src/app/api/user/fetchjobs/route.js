import { NextResponse } from "next/server";
import axios from "axios"; //for calling external APi
import * as cheerio from "cheerio"; //Cheerio is a library for working with HTML and XML documents

// Function to convert score to years of experience
const convertScoreToExperience = (score) => {
    if (score < 1 || score > 100) {
        throw new Error("Score must be between 1 and 100");
    }
    
    // Calculate years of experience
    const yearsOfExperience = Math.ceil(score / 10); // This will give you 1 to 10 years
    return yearsOfExperience;
};

// Main handler for fetching jobs by interest and score
const fetchJobsByInterestHandler = async (request) => {
    try {
        const { interest, score } = await request.json();

        // Validate input
        if (!interest || (score !== undefined && (typeof score !== 'number' || score < 1 || score > 100))) {
            return NextResponse.json(
                { message: "Invalid interest or score not provided" },
                { status: 400 }
            );
        }

        // Convert score to years of experience
        const yearsOfExperience = score ? convertScoreToExperience(score) : 0;

        // Fetch job listings from LinkedIn
        const jobListings = await fetchLinkedInJobs(interest, yearsOfExperience);

        return NextResponse.json(
            { jobs: jobListings || [] },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json(
            { message: "Failed to fetch jobs", error: error.message },
            { status: 500 }
        );
    }
};

// Function to fetch jobs from LinkedIn using Axios and Cheerio for web scraping
const fetchLinkedInJobs = async (profession, yearsOfExperience) => {
    const allSearchResults = [];
    const fetchedTitles = new Set();

    // Construct the search URL based on the profession and years of experience
    const experienceFilter = yearsOfExperience > 0 ? `&f_E=2&f_JB=${yearsOfExperience}` : '';
    const searchUrl = `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(profession)}${experienceFilter}`;

    try {
        const response = await axios.get(searchUrl, {
            headers: {
                // Add headers to avoid being blocked by LinkedIn
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });
        
        const $ = cheerio.load(response.data);
        
        // Scrape job listings
        $('ul.jobs-search__results-list li').each((_, jobElement) => {
            const titleElement = $(jobElement).find('h3'); // Adjust to actual title selector
            const linkElement = $(jobElement).find('a');

            if (titleElement.length && linkElement.length) {
                const jobTitle = titleElement.text().trim();
                const jobLink = linkElement.attr('href');

                if (!fetchedTitles.has(jobTitle)) {
                    fetchedTitles.add(jobTitle);
                    allSearchResults.push({ jobTitle, jobLink });
                }
            }
        });
    } catch (error) {
        console.error('Error fetching LinkedIn jobs:', error.message);
    }

    return allSearchResults;
};

// Export the handler function for the POST method
export const POST = fetchJobsByInterestHandler;
