import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function RunSelect() {
  return (
    <div>
      <p className="text-sm font-black font-title">Showing Run</p>
      <Select>
        <SelectTrigger className="w-56">
          <SelectValue placeholder={"Select Run"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fahrenheit">°F</SelectItem>
          <SelectItem value="celsius">°C</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
