import { Search } from "lucide-react";
import { ChangeEvent } from "react";

type SearchBarProps = {
  onSearch: (value: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <form
      className="flex items-center gap-2 max-w-md mx-auto mb-8 bg-white rounded-full shadow px-4 py-2 border"
      onSubmit={(e) => e.preventDefault()}
    >
      <span className="text-muted-foreground">
        <Search size={20} />
      </span>
      <input
        type="text"
        placeholder="Rechercher un outil..."
        className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none rounded-full"
        onChange={handleChange}
      />
      {/* Le bouton est supprimé pour une recherche instantanée */}
    </form>
  );
}
