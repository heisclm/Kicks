import { SettingsRepository } from '../../../features/settings/settings-repository';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const settings = await SettingsRepository.getSettings();

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
