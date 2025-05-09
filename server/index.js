const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to generate cover letter using OpenAI's cheapest model
async function generateCoverLetter(resumeData) {
    try {
        // Use OpenAI's gpt-3.5-turbo which is their most cost-effective model
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Most cost-effective OpenAI model
                messages: [
                {
                    role: 'system',
                    content: 'You are a professional cover letter writer. Write a concise, one-page cover letter using the provided resume information.'
                },
                {
                    role: 'user',
                    content: `Generate a professional cover letter for a job application based on the following resume information:
                    Name: ${resumeData.name}
                    Profile: ${resumeData.profile}
                    Skills: ${resumeData.skills.join(', ')}
                    
                    The cover letter should be one page, professional in tone, and highlight the candidate's skills and experiences mentioned in their profile.
                    Do not include date, address or recipient information.`
                }
                ],
                max_tokens: 400, // Limiting tokens to reduce cost
                temperature: 0.7
            },
            {
                headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating cover letter with OpenAI:', error);
        // Fallback to template if API call fails
        return generateFallbackCoverLetter(resumeData);
    }
}

// Simple template-based fallback for cover letter generation
function generateFallbackCoverLetter(resumeData) {
    const { name, profile, skills } = resumeData;
    
    return `
    Dear Hiring Manager,

    I am writing to express my interest in the open position at your company. As a ${skills[0] || 'professional'} with experience in ${skills.slice(1, 3).join(' and ') || 'various areas'}, I believe I would be a valuable addition to your team.

    ${profile || 'I am a dedicated professional with a strong track record of success in my field.'}

    My key skills include ${skills.slice(0, 5).join(', ') || 'various technical and professional abilities'} which I have developed through my professional experiences. I am confident that these skills, combined with my passion for excellence, would allow me to make significant contributions to your organization.

    I look forward to the opportunity to discuss how my background and skills would be a good match for this position. Thank you for your consideration.

    Sincerely,
    ${name || 'Candidate'}`;
}

// Route to generate cover letter
app.post('/api/generate-cover-letter', async (req, res) => {
    try {
        const resumeData = req.body;
        
        if (!resumeData) {
            return res.status(400).json({ error: 'No resume data provided' });
        }
        
        // Check if OpenAI API key is available
        if (!process.env.OPENAI_API_KEY) {
            console.warn('Warning: OpenAI API key not found. Using fallback template method.');
            const coverLetter = generateFallbackCoverLetter(resumeData);
            return res.json({ coverLetter });
        }
        
        const coverLetter = await generateCoverLetter(resumeData);
        res.json({ coverLetter });
    } catch (error) {
        console.error('Error in cover letter generation endpoint:', error);
        res.status(500).json({ error: 'Failed to generate cover letter' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`OpenAI API Key ${process.env.OPENAI_API_KEY ? 'is' : 'is NOT'} configured`);
});