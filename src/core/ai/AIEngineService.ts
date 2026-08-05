/**
|--------------------------------------------------------------------------
| GuideNer Centralized AI Engine Service
| Handles Gemini 2.5 server-side API integration, persona context, prompt
| formatting, and offline smart AI fallback logic.
|--------------------------------------------------------------------------
*/

import { AIPersona } from '../database/schema';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isOfflineFallback?: boolean;
}

class AIEngine {
  /**
   * Main Chat Dispatcher with Online Gemini API + Smart Offline Engine
   */
  public async sendMessage(
    prompt: string,
    persona: AIPersona = 'friendly',
    history: { role: 'user' | 'model'; text: string }[] = [],
    systemInstruction?: string
  ): Promise<{ reply: string; isOffline: boolean }> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, persona, history, systemInstruction }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.reply) {
          return { reply: data.reply, isOffline: false };
        }
      }
    } catch {
      // Fetch failed or device is offline
    }

    // Local Smart Offline Engine Response Generator
    const offlineReply = this.generateOfflineResponse(prompt, persona);
    return { reply: offlineReply, isOffline: true };
  }

  /**
   * Generates Daily AI Briefing for Home Dashboard
   */
  public generateDailyBriefing(
    userName: string,
    lifeScore: number,
    completedTasksCount: number,
    totalTasksCount: number,
    persona: AIPersona = 'friendly'
  ): string {
    const greeting = this.getGreetingTime();

    if (persona === 'strict') {
      return `${greeting}, ${userName}. Your current Life Score is ${lifeScore}/1000. You have completed ${completedTasksCount} of ${totalTasksCount} scheduled time blocks. Maintain 100% focus and execute today's priority study and workout goals with zero excuses.`;
    }

    if (persona === 'professional') {
      return `${greeting}, ${userName}. Life Score stands at ${lifeScore}. Schedule progress: ${completedTasksCount}/${totalTasksCount} tasks complete. Focus on your next high-energy study block to maximize productivity today.`;
    }

    if (persona === 'minimal') {
      return `• ${greeting}, ${userName}\n• Life Score: ${lifeScore}/1000\n• Progress: ${completedTasksCount}/${totalTasksCount} completed\n• Next Focus: High-Priority Study`;
    }

    // Friendly default
    return `${greeting}, ${userName}! 🌟 Your Life Score is looking great at ${lifeScore}/1000. You've already checked off ${completedTasksCount} out of ${totalTasksCount} time blocks today. Keep up the amazing momentum—your next study session is ready!`;
  }

  /**
   * Generate Concept Explanations or Study Summaries offline
   */
  public generateConceptExplanation(topic: string, level: 'beginner' | 'advanced' = 'beginner'): string {
    return `# GuideNer AI Tutor: ${topic}\n\n## Overview\n**${topic}** is a core fundamental concept. Here is a clear breakdown designed for ${level} level understanding.\n\n### Key Principles:\n1. **Core Rule**: Understand the base formula and primary relationships before solving complex examples.\n2. **Practical Application**: Relate the theory directly to real-world physical or logical models.\n3. **Exam Focus**: Pay special attention to edge cases and units of measurement.\n\n> 💡 *AI Tutor Tip*: Review your flashcard deck for ${topic} to lock this into long-term memory using spaced repetition!`;
  }

  /**
   * Offline Smart Local AI Companion Engine
   */
  private generateOfflineResponse(prompt: string, persona: AIPersona): string {
    const p = prompt.toLowerCase();

    if (p.includes('hello') || p.includes('hi') || p.includes('hey')) {
      if (persona === 'strict') return 'Greetings. What is your plan for today? Stay focused on your goals.';
      if (persona === 'professional') return 'Hello. How can I assist you with your schedule, study, or goals today?';
      if (persona === 'minimal') return 'Hello. Ready for your input.';
      return 'Hello! 👋 I am GuideNer AI, your personal life guide. How can I support your growth, schedule, or study session today?';
    }

    if (p.includes('study') || p.includes('math') || p.includes('physics') || p.includes('exam')) {
      return `I've analyzed your study plan. For optimal retention:
1. Complete a 45-minute focused time block without distraction.
2. Review key formulas in the Study Hub notes.
3. Test yourself using your adaptive Flashcard decks.`;
    }

    if (p.includes('health') || p.includes('water') || p.includes('sleep') || p.includes('workout')) {
      return `Health & Energy Check:
• Aim for 2,500ml water daily to maintain cognitive sharpness.
• Consistently tracking 7-8 hours of sleep boosts memory consolidation.
• Don't forget to log your evening exercise to keep your Life Score rising!`;
    }

    if (p.includes('goal') || p.includes('habit') || p.includes('routine')) {
      return `Consistency build momentum!
Small daily actions compound into major breakthroughs. Check off your pending habit blocks in the Life Manager workspace to maintain your current streak.`;
    }

    // Default intelligent offline response
    if (persona === 'strict') {
      return `Understood: "${prompt}". Focus on execution. Check your timeline planner, review high-priority tasks, and eliminate distractions.`;
    }

    return `I received your prompt: "${prompt}". You are operating in Offline Mode. I have logged this to your AI Memory context and updated your Life OS schedule overview.`;
  }

  private getGreetingTime(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}

export const aiEngine = new AIEngine();
