import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_TIMEOUT = 45000; // 45 seconds

export const generateCoverLetter = async (resumeData, jobDescription, companyName) => {
  try {
    // Construct a detailed prompt
    const prompt = `
You are an expert cover letter writer following these exact guidelines:

# COVER LETTER FORMAT
- Start with applicant's address and contact info
- Include date, recipient's name and company address
- Use a professional greeting
- Introduction: Mention the position, company name, and brief statement of interest
- Body (2-3 paragraphs): Highlight relevant skills from resume that match job requirements
- Include specific praise about ${companyName}: Mention their recent achievements, company values, or industry position
- Conclusion: Express enthusiasm, request interview, thank the reader
- Professional closing (e.g., "Sincerely")
- Applicant's name and signature

# INSTRUCTIONS
- Highlight these key skills from the resume: ${getTopSkills(resumeData, jobDescription)}
- Mention this specific company achievement: ${getCompanyInfo(companyName)}
- Use confident but respectful language
- Keep length to 350-400 words
- Do not fabricate experience not mentioned in the resume

## Resume Data:
${JSON.stringify(resumeData, null, 2)}

## Job Description:
${jobDescription}

Write a complete, ready-to-send cover letter.
`;
    // Send request to local Ollama instance
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: "mistral",
        prompt: prompt,
        stream: false
      },
      {
        timeout: OLLAMA_TIMEOUT
      }
    );
    
    return { coverLetter: response.data.response };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to Ollama. Make sure it is running.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Request to Ollama timed out. Try again or use a smaller model.');
    }
    console.error('Error generating cover letter:', error);
    throw error;
  }
};