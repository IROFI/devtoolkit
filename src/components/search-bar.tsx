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
      className="flex items-center gap-2 max-w-md mx-auto mt-8 bg-white dark:bg-zinc-900 rounded-full shadow px-4 py-2 border border-zinc-200 dark:border-zinc-700"
      onSubmit={(e) => e.preventDefault()}
    >
      <span className="text-muted-foreground dark:text-zinc-400">
        <Search size={20} />
      </span>
      <input
        type="text"
        placeholder="Search a tool..."
        className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none rounded-full text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        onChange={handleChange}
      />
    </form>
  );
}
