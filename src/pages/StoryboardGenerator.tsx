import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Character {
  id: string;
  character_name: string;
  profile_text: string;
}

interface StoryboardPrompt {
  id: number;
  text: string;
}

const StoryboardGenerator = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [sceneDescription, setSceneDescription] = useState("");
  const [sceneDuration, setSceneDuration] = useState(6);
  const [cameraMovement, setCameraMovement] = useState("");
  const [lightingStyle, setLightingStyle] = useState("");
  const [generatedPrompts, setGeneratedPrompts] = useState<StoryboardPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const cameraOptions = [
    "Static Shot",
    "Close-up", 
    "Medium Shot",
    "Wide Shot",
    "Low-angle Shot",
    "Travelling Shot / Dolly"
  ];

  const lightingOptions = [
    "Natural Light",
    "Soft Light",
    "Golden Hour",
    "Volumetric Lighting",
    "Cinematic Shadow"
  ];

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("character_name", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch characters",
        variant: "destructive",
      });
      return;
    }

    setCharacters(data || []);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  const generateStoryboard = () => {
    if (!sceneDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a scene description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate generation process
    setTimeout(() => {
      const selectedCharacterNames = characters
        .filter(char => selectedCharacters.includes(char.id))
        .map(char => char.character_name);

      const characterText = selectedCharacterNames.length > 0 
        ? `Featuring characters: ${selectedCharacterNames.join(", ")}. `
        : "";

      const cameraText = cameraMovement ? `Camera: ${cameraMovement}. ` : "";
      const lightingText = lightingStyle ? `Lighting: ${lightingStyle}. ` : "";
      const durationText = `Duration: ${sceneDuration} seconds.`;

      const basePrompt = `${characterText}Scene: ${sceneDescription}. ${cameraText}${lightingText}${durationText}`;

      const prompts = [
        {
          id: 1,
          text: `${basePrompt} Opening establishing shot to set the mood and context.`
        },
        {
          id: 2, 
          text: `${basePrompt} Main action sequence with character interactions and dialogue.`
        },
        {
          id: 3,
          text: `${basePrompt} Reaction shots and emotional beats to enhance storytelling.`
        },
        {
          id: 4,
          text: `${basePrompt} Closing shot that transitions to the next scene or provides resolution.`
        }
      ];

      setGeneratedPrompts(prompts);
      setLoading(false);

      toast({
        title: "Success",
        description: "Storyboard prompts generated successfully!",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-medium text-foreground mb-8">Create Your Scene</h1>
        
        {/* Form Section */}
        <section className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="space-y-6">
            {/* Scene Description */}
            <div>
              <Label htmlFor="scene-description" className="text-sm font-medium text-foreground">
                Scene Description
              </Label>
              <Textarea
                id="scene-description"
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                placeholder="Describe the scene you want to create..."
                rows={4}
                className="mt-1 bg-input text-input-foreground border-border focus:border-border-focus resize-none"
              />
            </div>

            {/* Scene Duration */}
            <div>
              <Label htmlFor="scene-duration" className="text-sm font-medium text-foreground">
                Scene Duration (seconds)
              </Label>
              <Input
                id="scene-duration"
                type="number"
                value={sceneDuration}
                onChange={(e) => setSceneDuration(Number(e.target.value))}
                min="1"
                max="60"
                className="mt-1 bg-input text-input-foreground border-border focus:border-border-focus w-32"
              />
            </div>

            {/* Select Characters */}
            <div>
              <Label className="text-sm font-medium text-foreground">
                Select Characters
              </Label>
              
              {characters.length === 0 ? (
                <div className="mt-2 p-4 border border-border rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    No characters available. Create characters in the Character Library first.
                  </p>
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  {characters.map((character) => (
                    <div key={character.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`char-${character.id}`}
                        checked={selectedCharacters.includes(character.id)}
                        onCheckedChange={() => handleCharacterToggle(character.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`char-${character.id}`} 
                          className="text-sm font-medium text-foreground cursor-pointer"
                        >
                          {character.character_name}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {character.profile_text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cinematic Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Camera Movement
                </Label>
                <Select value={cameraMovement} onValueChange={setCameraMovement}>
                  <SelectTrigger className="mt-1 bg-input text-input-foreground border-border">
                    <SelectValue placeholder="Choose camera style" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameraOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Lighting Style
                </Label>
                <Select value={lightingStyle} onValueChange={setLightingStyle}>
                  <SelectTrigger className="mt-1 bg-input text-input-foreground border-border">
                    <SelectValue placeholder="Choose lighting style" />
                  </SelectTrigger>
                  <SelectContent>
                    {lightingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateStoryboard}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Storyboard
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Results Section */}
        {generatedPrompts.length > 0 && (
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-medium text-foreground mb-6">Generated Storyboard</h2>
            
            <div className="space-y-4">
              {generatedPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary">
                          Prompt {index + 1}
                        </span>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">
                        {prompt.text}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => copyToClipboard(prompt.text)}
                      variant="outline"
                      size="sm"
                      className="ml-4 border-border text-muted-foreground hover:text-foreground hover:border-primary"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StoryboardGenerator;