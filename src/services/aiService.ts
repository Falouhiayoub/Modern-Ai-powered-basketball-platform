import { GoogleGenerativeAI } from '@google/generative-ai';
import { playerService } from './playerService';
import type { Player } from './playerService';
import { matchService } from './matchService';
import type { Match } from './matchService';
import { newsService } from './newsService';
import type { NewsArticle } from './newsService';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const aiService = {
  async generateChatResponse(userMessage: string, chatHistory: { role: 'user' | 'model'; parts: string }[]) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 10) {
      return "🚨 Coach Arc needs his playbook! (Gemini API Key is missing or invalid in .env). Please check your configuration.";
    }

    try {
      // 1. Fetch current context from the database
      const [players, matches, news] = await Promise.all([
        playerService.getPlayers().catch(() => []) as Promise<Player[]>,
        matchService.getRecentResults().catch(() => []) as Promise<Match[]>,
        newsService.getNews(5).catch(() => []) as Promise<NewsArticle[]>,
      ]);

      // 2. Format context for the AI
      const context = `
        You are "Coach Arc", the official Virtual Head Coach for "Beyond the Arc" basketball club in Morocco.
        
        Personality:
        - You speak like a high-energy basketball coach. Use terms like "Fast Break", "Full-Court Press", "Splash", "Downtown".
        - You are highly knowledgeable about the team's stats.
        - You give tactical advice to fans on how to play better.
        - You analyze player performance with a critical but supportive eye.
        
        Current Team Context:
        
        Players:
        ${players?.map(p => `- ${p.name} (#${p.number}, ${p.position}, ${p.points_per_game} PPG)`).join('\n')}
        
        Latest Results:
        ${matches?.map(m => `- vs ${m.opponent}: ${m.score_team}-${m.score_opponent} (${m.status})`).join('\n')}
        
        Latest News:
        ${news?.map(n => `- ${n.title}`).join('\n')}
        
        Guidelines:
        - Be enthusiastic, professional, and supportive of the team.
        - If asked about joining the team, tell fans to visit the "Join us" page.
        - Keep responses concise and informative.
        - Answer in the same language the user uses (Arabic, French, or English).
      `;

      // 3. Initialize the model
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: context,
      });

      // 4. Start chat and get response
      const formattedHistory = chatHistory
  .filter((h, index) => {
    // ensure first message is always from user
    if (index === 0 && h.role !== "user") return false;
    return true;
  })
  .map(h => ({
    role: h.role,
    parts: [{ text: h.parts }],
  }));

const chat = model.startChat({
  history: formattedHistory,
});

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return "I'm having a little trouble connecting to the Beyond the Arc data right now. Basketball is all about teamwork, and my teammate (the server) is a bit slow! Please try again in a moment. 🏀";
    }
  },

  async generateMatchSummary(match: Match) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
        You are a top-tier sports journalist for "Beyond the Arc" basketball club in Morocco.
        Write a professional, high-energy match report in English based on these stats:
        
        Date: ${new Date(match.date).toLocaleDateString()}
        Opponent: ${match.opponent}
        Score: ${match.score_team} (Our Team) - ${match.score_opponent} (Opponent)
        Result: ${match.score_team > match.score_opponent ? 'Win' : 'Loss'}
        Venue: ${match.location}
        
        Requirements:
        1. Create an exciting headline.
        2. Write a 3-4 paragraph story about the "clash" and key takeaways.
        3. Use basketball jargon.
        4. Focus on the pride of the club.
        5. Return ONLY the content in Markdown format.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Match summary generation error:', error);
      throw error;
    }
  },

  async translateContent(text: string, targetLanguage: 'Arabic' | 'French' | 'English') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `
        Translate the following basketball news article into ${targetLanguage}.
        Maintain the professional sports tone and preserve the Markdown formatting.
        
        Content:
        ${text}
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
};
