import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <form className="flex items-center gap-2 max-w-md mx-auto mb-8 bg-white rounded-full shadow px-4 py-2 border">
      <span className="text-muted-foreground">
        <Search size={20} />
      </span>
      <input
        type="text"
        placeholder="Rechercher un outil..."
        className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none rounded-full"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-muted-foreground text-white rounded-full font-medium hover:bg-muted-foreground/90 transition"
      >
        Rechercher
      </button>
    </form>
  );
}
