const Groq = require('groq-sdk');
const {
  blogPostIdeasPrompt,
  generateReplyPrompt,
  blogSummaryPrompt,
} = require('../utils/prompts');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateByBlogPost = async (req, res) => {
  try {
    const { title, tone } = req.body;
    if (!title || !tone)
      return res.status(400).json({ message: 'Missing require Fields' });

    const prompt = `Write a markdown-formatted blog post titled "${title}". Use a ${tone} tone. Include an introduction, subheadings, code examples if relevant, and a conclusion.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.choices[0].message.content;
    res.json(rawText);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to generate blog post', error: error.message });
  }
};

const generateBlogPostIdeas = async (req, res) => {
  try {
    const { topics } = req.body;
    if (!topics)
      return res.status(400).json({ message: 'Missing require fields' });

    const prompt = blogPostIdeasPrompt(topics);

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.choices[0].message.content;
    const cleanedText = rawText
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim();

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to generate blog post ideas',
      error: error.message,
    });
  }
};

const generateCommentReply = async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content)
      return res.status(400).json({ message: 'Missing require fields' });

    const prompt = generateReplyPrompt({ author, content });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.choices[0].message.content;
    res.status(200).json(rawText);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to generate comment', error: error.message });
  }
};

const generatePostSummary = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: 'Missing required fields' });

    const prompt = blogSummaryPrompt(content);

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.choices[0].message.content;
    console.log('RAW TEXT:', rawText);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'No JSON found in AI response' });
    }

    const fixedJson = jsonMatch[0].replace(
      /"(title|summary)":\s*"([\s\S]*?)"\s*(?=[,}])/g,
      (match, key, value) => {
        const escaped = value
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        return `"${key}": "${escaped}"`;
      }
    );

    let data;
    try {
      data = JSON.parse(fixedJson);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Fixed JSON:', fixedJson);
      return res
        .status(500)
        .json({ message: 'AI returned invalid JSON format' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Summary Error:', error.message);
    res.status(500).json({
      message: 'Failed to generate blog post summary',
      error: error.message,
    });
  }
};

module.exports = {
  generateByBlogPost,
  generateBlogPostIdeas,
  generateCommentReply,
  generatePostSummary,
};
