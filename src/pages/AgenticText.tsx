import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AgenticTextData {
  title: string;
  content: string;
  formattedContent: string;
}

const AgenticText: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [contentData, setContentData] = useState<AgenticTextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      // Get content ID from URL parameter
      const contentId = searchParams.get('id');
      
      if (contentId) {
        try {
          const { data, error } = await supabase
            .from('agentic_content')
            .select('*')
            .eq('id', contentId)
            .single();

          if (error) {
            console.error('Error fetching content:', error);
          } else if (data) {
            setContentData({
              title: data.title,
              content: data.content,
              formattedContent: data.formatted_content
            });
          }
        } catch (error) {
          console.error('Failed to fetch content:', error);
        }
      } else {
        // Fallback to sessionStorage for backward compatibility
        const storedContent = sessionStorage.getItem('agentic-content');
        if (storedContent) {
          try {
            const parsed = JSON.parse(storedContent);
            setContentData(parsed);
          } catch (error) {
            console.error('Failed to parse stored content:', error);
          }
        }
      }
      
      setLoading(false);
    };

    fetchContent();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600">
            The requested content could not be loaded. Please generate new content from the main application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <main className="prose prose-lg max-w-none">
          <div 
            className="content-display"
            dangerouslySetInnerHTML={{ 
              __html: contentData.formattedContent 
            }} 
          />
        </main>
        
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            This content was generated using AI technology
          </p>
        </footer>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .content-display {
            color: #374151;
            line-height: 1.7;
          }
          
          .content-display h1 {
            color: #111827 !important;
            font-size: 1.875rem !important;
            font-weight: 700 !important;
            margin-bottom: 1rem !important;
            border-bottom: 2px solid #e5e7eb !important;
            padding-bottom: 0.5rem !important;
          }
          
          .content-display h2 {
            color: #1f2937 !important;
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            margin-top: 2rem !important;
            margin-bottom: 1rem !important;
          }
          
          .content-display h3 {
            color: #374151 !important;
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .content-display strong {
            color: #111827 !important;
            font-weight: 600 !important;
          }
          
          .content-display em {
            color: #6b7280 !important;
            font-style: italic !important;
          }
          
          .content-display p {
            margin-bottom: 1rem !important;
            color: #374151 !important;
          }
          
          .content-display li {
            margin-bottom: 0.5rem !important;
            color: #374151 !important;
          }
          
          .content-display ul, .content-display ol {
            margin-bottom: 1rem !important;
            padding-left: 1.5rem !important;
          }
          
          .content-display li::marker {
            color: #6b7280 !important;
          }
        `
      }} />
    </div>
  );
};

export default AgenticText;