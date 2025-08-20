
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/integrations/supabase/client';

const GEMINI_API_KEY = 'AIzaSyA9flNk5RP21zFdvC3I0p4LBp5sZgL7048';

export interface AgenticContent {
  id?: string;
  title: string;
  content: string;
  formattedContent: string;
}

export class GeminiFlashService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  async generateContent(task: string, contentType: string): Promise<AgenticContent> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `
You are an expert content creator. Generate high-quality, professional content based on the following request:

Task: ${task}
Content Type: ${contentType}

Please provide the content in the following format:
1. A clear, concise title
2. Well-structured content with proper formatting

Guidelines:
- Use appropriate headings (H1, H2, H3) for structure
- Use bold text for important points
- Use italics for emphasis where appropriate
- Use bullet points or numbered lists when helpful
- Make the content professional and polished
- Ensure proper grammar and spelling
- Structure the content logically

The content should be complete, actionable, and ready to use.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract title and content
      const lines = text.split('\n');
      const title = this.extractTitle(text, contentType);
      const content = text;
      const formattedContent = this.formatContent(text);

      // Save to database
      const { data, error } = await supabase
        .from('agentic_content')
        .insert({
          title,
          content,
          formatted_content: formattedContent,
          task,
          content_type: contentType
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving to database:', error);
        throw new Error('Failed to save content');
      }

      return {
        id: data.id,
        title,
        content,
        formattedContent
      };
    } catch (error) {
      console.error('Error generating content with Gemini Flash:', error);
      throw new Error('Failed to generate content');
    }
  }

  private extractTitle(content: string, contentType: string): string {
    // Try to extract title from the first line or heading
    const lines = content.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('#') || line.match(/^[A-Z][^.!?]*$/)) {
        return line.replace(/^#+\s*/, '').trim();
      }
    }
    
    // Fallback title based on content type
    const typeMap: Record<string, string> = {
      letter: 'Generated Letter',
      document: 'Generated Document',
      list: 'Generated List',
      suggestion: 'Suggestions',
      report: 'Generated Report',
      proposal: 'Business Proposal'
    };
    
    return typeMap[contentType.toLowerCase()] || 'Generated Content';
  }

  private formatContent(content: string): string {
    let formatted = content;

    // Convert markdown-style formatting to HTML
    formatted = formatted
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-2 text-white">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 text-white">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-white">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="ml-4 mb-1 text-gray-200">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 text-gray-200">$1</li>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3 text-gray-200">')
      .replace(/\n/g, '<br/>');

    // Wrap in paragraphs
    formatted = `<p class="mb-3 text-gray-200">${formatted}</p>`;

    return formatted;
  }
}

export const geminiFlashService = new GeminiFlashService();
