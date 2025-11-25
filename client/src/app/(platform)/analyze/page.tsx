import BrandAnalyzer from '@/components/BrandAnalyzer';

export default function AnalyzePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center py-12">
      <main className="w-full max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-google font-medium text-foreground mb-4 tracking-tight">Analyze a new brand</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Enter a website URL to extract its Brand DNA and generate content.
          </p>
        </div>
        
        <BrandAnalyzer />
      </main>
    </div>
  );
}
