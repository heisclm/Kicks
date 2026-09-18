import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your store preferences and system details.</p>
        </div>
        <Button className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto">
          <Save size={16} />
          Save Changes
        </Button>
      </div>

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
                <Input defaultValue="KICKS Official" className="bg-muted/40" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Email</label>
                <Input defaultValue="support@kicks.com" type="email" className="bg-muted/40" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store Address</label>
              <Input defaultValue="123 Sneaker Avenue, NY 10012" className="bg-muted/40" />
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
                <select className="w-full h-10 px-3 rounded-md bg-muted/40 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option className="bg-background text-foreground" value="USD">USD ($) - US Dollar</option>
                  <option className="bg-background text-foreground" value="EUR">EUR (€) - Euro</option>
                  <option className="bg-background text-foreground" value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timezone</label>
                <select className="w-full h-10 px-3 rounded-md bg-muted/40 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option className="bg-background text-foreground" value="EST">Eastern Time (EST)</option>
                  <option className="bg-background text-foreground" value="PST">Pacific Time (PST)</option>
                  <option className="bg-background text-foreground" value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
