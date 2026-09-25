
const fs = require("fs");

let cat = fs.readFileSync("admin/app/(dashboard)/categories/AddCategoryForm.tsx", "utf8");
cat = cat.replace("{isSubmitting ?", "{isPending ?");
cat = cat.replace("{isSubmitting ? \x27Saving...\x27 : \x27Save Category\x27}", "{isPending ? <><Loader2 className=\x22mr-2 h-4 w-4 animate-spin\x22 /> Saving...</> : \x27Save Category\x27}");
cat = cat.replace("disabled={isSubmitting}", "disabled={isPending}");
fs.writeFileSync("admin/app/(dashboard)/categories/AddCategoryForm.tsx", cat);

let set = fs.readFileSync("admin/app/(dashboard)/settings/SettingsForm.tsx", "utf8");
set = set.replace("function onSubmit(formData: FormData) {", "const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const formData = new FormData(e.currentTarget);\n");
set = set.replace("      });\n  }", "      });\n  };");
fs.writeFileSync("admin/app/(dashboard)/settings/SettingsForm.tsx", set);

let log = fs.readFileSync("admin/app/login/page.tsx", "utf8");
log = log.replace("async function handleSubmit(formData: FormData) {", "const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const formData = new FormData(e.currentTarget);\n    startTransition(async () => {");
log = log.replace("      } finally {\n        setIsLoading(false)\n      }\n    }", "      }\n    });\n  };");
log = log.replace("setIsLoading(true)", "");
log = log.replace("setIsLoading(false)", "");
fs.writeFileSync("admin/app/login/page.tsx", log);

let not = fs.readFileSync("admin/components/ui/CreateNotificationDialog.tsx", "utf8");
not = not.replace("async function onSubmit(formData: FormData) {", "const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const formData = new FormData(e.currentTarget);\n");
not = not.replace("      });\n  }", "      });\n  };");
fs.writeFileSync("admin/components/ui/CreateNotificationDialog.tsx", not);

let pro = fs.readFileSync("admin/components/ui/CreatePromotionDialog.tsx", "utf8");
pro = pro.replace("async function onSubmit(formData: FormData) {", "const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const formData = new FormData(e.currentTarget);\n");
pro = pro.replace("      });\n  }", "      });\n  };");
fs.writeFileSync("admin/components/ui/CreatePromotionDialog.tsx", pro);

