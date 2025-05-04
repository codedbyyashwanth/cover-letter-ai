const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple resume parsing function
function parseResume(text) {
  // Extract name - look for a name at the beginning of the resume
  const nameRegex = /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m;
  const nameMatch = text.match(nameRegex);
  const name = nameMatch ? nameMatch[1] : 'Unknown';
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';
  
  // Extract phone number (various formats)
  const phoneRegex = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // Extract skills - look for common section headers and lists
  const skillsSection = text.match(/skills:?(.*?)(?=\n\n|\n[A-Z]|$)/is);
  let skills = [];
  
  if (skillsSection && skillsSection[1]) {
    // Split by commas, bullet points, or new lines
    skills = skillsSection[1]
      .split(/[,•\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 30);
  }
  
  // Extract profile/summary - often at the beginning after name/contact
  const profileSection = text.match(/(?:profile|summary|about|objective):?(.*?)(?=\n\n|\n[A-Z]|$)/is);
  let profile = '';
  
  if (profileSection && profileSection[1]) {
    profile = profileSection[1].trim();
  } else {
    // If no profile section found, use first paragraph after contact info
    const firstPara = text.split('\n\n')[1];
    if (firstPara && firstPara.length > 50) {
      profile = firstPara.trim();
    }
  }
  
  return {
    name,
    email,
    phone,
    skills,
    profile
  };
}

// Route to parse resume
app.post('/api/parse-resume', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    const parsedResume = parseResume(text);
    res.json(parsedResume);
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});