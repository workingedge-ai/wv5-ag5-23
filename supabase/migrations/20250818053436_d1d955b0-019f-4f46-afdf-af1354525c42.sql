-- Create table for storing agentic content
CREATE TABLE public.agentic_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  formatted_content TEXT NOT NULL,
  task TEXT,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agentic_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since QR codes need to work for anyone)
CREATE POLICY "Anyone can view agentic content" 
ON public.agentic_content 
FOR SELECT 
USING (true);

-- Create policy to allow public insert (for content generation)
CREATE POLICY "Anyone can create agentic content" 
ON public.agentic_content 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agentic_content_updated_at
  BEFORE UPDATE ON public.agentic_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();