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
    try {
      // 1. Fetch current context from the database
      const [players, matches, news] = await Promise.all([
        playerService.getPlayers() as Promise<Player[]>,
        matchService.getUpcomingMatches() as Promise<Match[]>,
        newsService.getNews(5) as Promise<NewsArticle[]>,
      ]);

      // 2. Format context for the AI
      const context = `
        You are the official AI assistant for "Atlas Hoops", a professional basketball club in Morocco.
        Current Team Context:
        
        Players:
        ${players?.map(p => `- ${p.name} (#${p.number}, ${p.position}, ${p.points_per_game} PPG)`).join('\n')}
        
        Upcoming Matches:
        ${matches?.map(m => `- vs ${m.opponent} at ${m.location} on ${new Date(m.date).toLocaleDateString()}`).join('\n')}
        
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
        model: 'gemini-1.5-flash',
        systemInstruction: context,
      });

      // 4. Start chat and get response
      const chat = model.startChat({
        history: chatHistory.map(h => ({
          role: h.role,
          parts: [{ text: h.parts }],
        })),
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return "I'm having a little trouble connecting to the Atlas Hoops data right now. Basketball is all about teamwork, and my teammate (the server) is a bit slow! Please try again in a moment. 🏀";
    }
  },
};
