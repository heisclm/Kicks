
const fs = require("fs");
let log = fs.readFileSync("admin/app/login/page.tsx", "utf8");
log = log.replace(/const handleSubmit = \(e: React\.FormEvent<HTMLFormElement>\) => \{[\s\S]*?\} finally \{\s*\}\s*\}/m, 
`const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setError(null);
      try {
        const result = await login(formData);
        if (result?.error) {
          setError(result.error);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  };`);
fs.writeFileSync("admin/app/login/page.tsx", log);

