import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { geminiFlashService, AgenticContent } from '@/services/geminiFlashService';
import { generateQRCode, generateContentUrl } from '@/utils/qrCodeGenerator';
interface AgenticModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  task: string;
  contentType: string;
}
const AgenticModeOverlay: React.FC<AgenticModeOverlayProps> = ({
  isOpen,
  onClose,
  task,
  contentType
}) => {
  const [content, setContent] = useState<AgenticContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen && task) {
      generateContent();
      // Focus the overlay when it opens with a small delay to ensure it's rendered
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.focus();
        }
      }, 150);
    }
  }, [isOpen, task]);
  useEffect(() => {
    if (content && !loading) {
      // Trigger fade-in animation after content is loaded
      setTimeout(() => {
        setShowContent(true);
      }, 200);
    }
  }, [content, loading]);
  const generateContent = async () => {
    setLoading(true);
    setShowContent(false);
    setContent(null);
    try {
      const generatedContent = await geminiFlashService.generateContent(task, contentType);
      setContent(generatedContent);

      // Generate QR code with mobile-friendly URL using the content ID
      const contentUrl = generateContentUrl(generatedContent.id!);
      const qrUrl = generateQRCode(contentUrl);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  const copyToClipboard = async () => {
    if (content) {
      try {
        await navigator.clipboard.writeText(content.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy content');
      }
    }
  };
  const downloadContent = () => {
    if (content) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${content.title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px; 
              line-height: 1.6;
              color: #333;
            }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 30px; }
            h3 { color: #7f8c8d; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            strong { color: #2c3e50; }
            em { color: #7f8c8d; }
            li { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <h1>${content.title}</h1>
          <div class="content">
            ${content.formattedContent}
          </div>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], {
        type: 'text/html'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-end justify-center px-[30px]">
        <div ref={overlayRef} tabIndex={0} onKeyDown={handleKeyDown} className="bg-zinc-900 rounded-t-2xl shadow-2xl w-full max-w-6xl h-[88vh] overflow-hidden border-t border-l border-r border-zinc-700 focus:outline-none flex flex-col py-0 my-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-700 flex-shrink-0 py-[9px] bg-neutral-900">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {loading ? <span className="animate-pulse">Atlas is Generating Content...</span> : content?.title || 'Agentic Mode'}
              </h2>
              <p className="text-zinc-400 mt-1 text-sm">
                {contentType.charAt(0).toUpperCase() + contentType.slice(1)} • Generated by AI
              </p>
            </div>
            
            {/* QR Code */}
            {qrCodeUrl && !loading && <div className="flex flex-col items-center mx-6">
                <img src={qrCodeUrl} alt="QR Code for mobile view" className="w-20 h-20 border-2 border-white rounded-lg" />
                <p className="text-xs text-zinc-400 mt-1 text-center">
                  Scan to view<br />on mobile
                </p>
              </div>}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {content && !loading && <>
                  <button onClick={copyToClipboard} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors" title="Copy to clipboard">
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                  
                </>}
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto py-[40px] px-[110px] bg-neutral-900">
            {loading ? <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-zinc-400 text-lg animate-pulse">
                    Atlas is generating your {contentType}...
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">This may take a few moments</p>
                </div>
              </div> : content ? <div className="prose prose-invert max-w-none">
                <div className={`text-zinc-200 leading-relaxed transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} dangerouslySetInnerHTML={{
              __html: content.formattedContent
            }} />
              </div> : <div className="flex items-center justify-center h-full">
                <p className="text-zinc-400">Failed to generate content. Please try again.</p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default AgenticModeOverlay;