import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Character {
  id: string;
  character_name: string;
  profile_text: string;
}

const CharacterLibrary = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterName, setCharacterName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: true });

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

  const handleSave = async () => {
    if (!characterName.trim() || !profileText.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both character name and profile",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        // Update existing character
        const { error } = await supabase
          .from("characters")
          .update({
            character_name: characterName,
            profile_text: profileText,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Character updated successfully",
        });
        
        setEditingId(null);
      } else {
        // Create new character
        const { error } = await supabase
          .from("characters")
          .insert([
            {
              character_name: characterName,
              profile_text: profileText,
            },
          ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Character saved successfully",
        });
      }

      setCharacterName("");
      setProfileText("");
      fetchCharacters();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save character",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (character: Character) => {
    setCharacterName(character.character_name);
    setProfileText(character.profile_text);
    setEditingId(character.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete character",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Character deleted successfully",
    });
    
    fetchCharacters();
  };

  const handleCancel = () => {
    setCharacterName("");
    setProfileText("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-medium text-foreground mb-8">Character Library</h1>
        
        {/* Add New Character Section */}
        <section className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-foreground mb-6">
            {editingId ? "Edit Character" : "Add New Character"}
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="character-name" className="text-sm font-medium text-foreground">
                Character Name
              </Label>
              <Input
                id="character-name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name"
                className="mt-1 bg-input text-input-foreground border-border focus:border-border-focus"
              />
            </div>
            
            <div>
              <Label htmlFor="character-profile" className="text-sm font-medium text-foreground">
                Character Profile
              </Label>
              <Textarea
                id="character-profile"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Enter detailed character description, background, traits, etc."
                rows={6}
                className="mt-1 bg-input text-input-foreground border-border focus:border-border-focus resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                {loading ? "Saving..." : editingId ? "Update Character" : "Save Character"}
              </Button>
              
              {editingId && (
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* My Characters Section */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-medium text-foreground mb-6">My Characters</h2>
          
          {characters.length === 0 ? (
            <div className="text-center py-8">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No characters yet. Add your first character above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-2">
                        {character.character_name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {character.profile_text}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(character)}
                        variant="outline"
                        size="sm"
                        className="border-border text-muted-foreground hover:text-foreground hover:border-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(character.id)}
                        variant="outline"
                        size="sm"
                        className="border-border text-destructive hover:text-destructive-foreground hover:bg-destructive hover:border-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CharacterLibrary;