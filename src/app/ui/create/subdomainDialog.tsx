import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SubdomainDialog {
  shouldCreateOrUpdate: (subdomain: string) => Promise<{ error?: string } | void>;
}

export default function SubdomainDialog(props) {
  const [subdomain, setSubdomain] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { shouldCreateOrUpdate } = props;

  const handleCreate = async (subdomain) => {
    if (!subdomain) {
      setError("Please enter a subdomain for your blog.");
      return;
    }

    setError("");
    const result = await shouldCreateOrUpdate(subdomain);
    if (result && result.error) {
      setError(result.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pick the subdomain of your blog</DialogTitle>
          <DialogDescription>
            Type in the subdomain of your blog, which will be used by people in order to
            access it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Subdomain" className="text-right">
              Subdomain
            </Label>
            <Input
              id="Subdomain"
              value={subdomain}
              placeholder="myawesomeblog"
              className={`col-span-3 ${error ? "border-2 border-red-700" : ""}`}
              onChange={(e) => setSubdomain(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-red-700">{error}</p>}
        <DialogFooter>
          <Button type="submit" onClick={() => handleCreate(subdomain)}>
            Create blog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
