import z from 'zod';

export const settingsTabs = [
	{ value: 'account', label: 'Account' },
	{ value: 'general', label: 'General' },
	{ value: 'users', label: 'Users' },
] as const;

export const defaultSettingsTab: SettingsTab = settingsTabs[0].value;

export const settingsTabSchema = z.enum(
	settingsTabs.map((tab) => tab.value) as [string, ...string[]],
);

export type SettingsTab = z.infer<typeof settingsTabSchema>;
