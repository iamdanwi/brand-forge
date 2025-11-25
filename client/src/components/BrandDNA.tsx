import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BrandProfile {
  brandName: string;
  toneOfVoice: string[];
  keywords: string[];
  visualStyle: string;
  colors: string[];
  // Pro Fields
  typography?: {
    primary: string;
    secondary: string;
    pairing_reason: string;
  };
  tagline?: string;
  personality?: {
    traits: string[];
    voice_description: string;
  };
}

interface BrandDNAProps {
  profile: BrandProfile;
}

export default function BrandDNA({ profile }: BrandDNAProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <Card className="border-0 shadow-sm bg-card rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-secondary/30 pb-6 pt-8 px-8">
          <CardTitle className="text-2xl font-google font-medium text-foreground">Brand Identity</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Brand Name</h3>
            <p className="text-3xl font-google text-foreground">{profile.brandName}</p>
          </div>
          {profile.tagline && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tagline</h3>
              <p className="text-xl text-foreground/80 italic font-light">"{profile.tagline}"</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Tone of Voice</h3>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(profile.toneOfVoice) ? (
                profile.toneOfVoice.map((tone, i) => (
                  <span key={i} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium border border-transparent hover:border-border transition-colors cursor-default">
                    {tone}
                  </span>
                ))
              ) : (
                <p className="text-lg text-foreground leading-relaxed">{profile.toneOfVoice}</p>
              )}
            </div>
          </div>
          {profile.personality && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Personality Traits</h3>
              <div className="flex flex-wrap gap-3">
                {profile.personality.traits.map((trait, i) => (
                  <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium border border-transparent hover:bg-primary/20 transition-colors cursor-default">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Visual Style</h3>
            <p className="text-lg text-foreground leading-relaxed font-light">{profile.visualStyle}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-card rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-secondary/30 pb-6 pt-8 px-8">
          <CardTitle className="text-2xl font-google font-medium text-foreground">Brand Assets</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Color Palette</h3>
            <div className="flex flex-wrap gap-6">
              {profile.colors.map((color, index) => (
                <div key={index} className="group flex flex-col items-center gap-3">
                  <div
                    className="w-20 h-20 rounded-[1.5rem] shadow-sm transition-transform group-hover:scale-105 ring-1 ring-black/5"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {profile.typography && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Typography</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-secondary/20 rounded-[1.5rem] border border-transparent hover:border-border/50 transition-colors">
                  <span className="text-xs font-medium text-muted-foreground block mb-2 uppercase tracking-wider">Primary</span>
                  <span className="text-2xl font-google text-foreground">{profile.typography.primary}</span>
                </div>
                <div className="p-6 bg-secondary/20 rounded-[1.5rem] border border-transparent hover:border-border/50 transition-colors">
                  <span className="text-xs font-medium text-muted-foreground block mb-2 uppercase tracking-wider">Secondary</span>
                  <span className="text-xl font-sans text-foreground">{profile.typography.secondary}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">{profile.typography.pairing_reason}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-3">
              {profile.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium border border-transparent hover:brightness-95 transition-all cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
