"use client";

import { useTransition, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Save } from "lucide-react";
import { updateSettingsAction } from "../../../features/settings/settings-actions";
import { StoreSettings } from "../../../features/settings/settings-types";

export function SettingsForm({ initialSettings }: { initialSettings: StoreSettings }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function onSubmit(formData: FormData) {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const result = await updateSettingsAction(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to update settings");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your store preferences and system details.</p>
        </div>
        <Button 
          type="submit"
          disabled={isPending}
          className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto"
        >
          <Save size={16} />
          {isPending ? "Saving..." : success ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium animate-fade-in-up" style={{ animationDelay: '50ms', opacity: 0 }}>
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-lg">Store Details</CardTitle>
            <p className="text-sm text-muted-foreground">Your store&apos;s public-facing information.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store Name</label>
                <Input name="store_name" defaultValue={initialSettings.store_name} required className="bg-muted/40" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Email</label>
                <Input name="contact_email" defaultValue={initialSettings.contact_email} type="email" required className="bg-muted/40" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store Address</label>
              <Input name="store_address" defaultValue={initialSettings.store_address} required className="bg-muted/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-lg">Regional & Format</CardTitle>
            <p className="text-sm text-muted-foreground">Configure currency and time formatting.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default Currency</label>
                <select name="default_currency" defaultValue={initialSettings.default_currency} className="w-full h-10 px-3 rounded-md bg-muted/40 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option className="bg-background text-foreground" value="USD">USD ($) - US Dollar</option>
                  <option className="bg-background text-foreground" value="EUR">EUR (€) - Euro</option>
                  <option className="bg-background text-foreground" value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timezone</label>
                <select name="timezone" defaultValue={initialSettings.timezone} className="w-full h-10 px-3 rounded-md bg-muted/40 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option className="bg-background text-foreground" value="EST">Eastern Time (EST)</option>
                  <option className="bg-background text-foreground" value="PST">Pacific Time (PST)</option>
                  <option className="bg-background text-foreground" value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
