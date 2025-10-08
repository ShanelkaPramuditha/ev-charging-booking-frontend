import { useNavigate, useSearch } from '@tanstack/react-router';

import { General } from '@/components/pages/settings/general';
import { Profile } from '@/components/pages/settings/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type SettingsTab, settingsTabs } from '@/config/search/settings';
import { useAuth } from '@/context/auth/use-auth';

import { UserManagement } from './users';

export function Settings() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const { tab: currentTab } = useSearch({
		from: '/_authenticated/settings',
	});

	if (!user) return null;

	// Tab Configurations
	const tabs = [
		{
			value: settingsTabs[0].value,
			label: settingsTabs[0].label,
			content: <Profile user={user} />,
		},
		{
			value: settingsTabs[1].value,
			label: settingsTabs[1].label,
			content: <General />,
		},
		{
			value: settingsTabs[2].value,
			label: settingsTabs[2].label,
			content: <UserManagement />,
		},
	];

	const handleTabChange = (value: SettingsTab) => {
		navigate({ to: '/settings', search: { tab: value } });
	};

	return (
		<div className='flex w-full max-w-7xl flex-col gap-6'>
			<Tabs value={currentTab}>
				{/* Tab list */}
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							onClick={() => handleTabChange(tab.value as SettingsTab)}
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Tab Contents */}
				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value}>
						{tab.content}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
