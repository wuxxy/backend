import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useState } from "react";

const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
];

export function MethodFormCard() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Method:", method);
    console.log("Path:", path);
  };

  return (
    <Card className="w-full h-full max-w-md shadow-lg bg-zinc-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">New Endpoint</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="method" className="text-white/80">
              Method
            </Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger
                id="method"
                className="text-white bg-zinc-800 border-white/10"
              >
                <SelectValue placeholder="Select HTTP method" />
              </SelectTrigger>
              <SelectContent className="text-white bg-zinc-800 border-white/10">
                {httpMethods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="path" className="text-white/80">
              Path
            </Label>
            <Input
              id="path"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="text-white bg-zinc-800 border-white/10"
              placeholder="/api/users"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-pink-600 hover:bg-pink-700"
          >
            Save Endpoint
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
