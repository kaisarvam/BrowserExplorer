export const APP_TITLE = 'Mini Workspace Explorer';

export const NOTICE_DURATION_MS = 3000;

export const STORAGE_KEY = 'mini-workspace-explorer:workspace:v1';

export const PREFERENCES_STORAGE_KEY = 'mini-workspace-explorer:preferences:v1';

export const DEFAULT_PREFERENCES: PreferencesState = {
	viewMode: 'list',
	iconSize: 'small',
	colorScheme: 'system',
};

const ROOT_ID = 'workspace-root';

const sampleItems: WorkspaceItem[] = [
	{ id: ROOT_ID, name: 'Workspace', type: 'folder', parentId: null },
	{ id: 'sample-projects', name: 'Projects', type: 'folder', parentId: ROOT_ID },
	{ id: 'sample-webbly', name: 'Webbly', type: 'folder', parentId: 'sample-projects' },
	{ id: 'sample-personal', name: 'Personal', type: 'folder', parentId: 'sample-projects' },
	{ id: 'sample-documents', name: 'Documents', type: 'folder', parentId: ROOT_ID },
	{
		id: 'sample-notes',
		name: 'notes.txt',
		type: 'file',
		parentId: 'sample-webbly',
		content: 'Webbly kickoff notes.\n\nDecide on the navigation model before the next review.',
	},
	{
		id: 'sample-tasks',
		name: 'tasks.txt',
		type: 'file',
		parentId: 'sample-webbly',
		content: '- Draft the landing page\n- Review the search behaviour\n- Write the release notes',
	},
	{
		id: 'sample-readme',
		name: 'README.txt',
		type: 'file',
		parentId: ROOT_ID,
		content:
			'Welcome to your workspace.\n\nUse the sidebar to move between folders, and open a text ' +
			'file to edit it.',
	},
];

export function createSampleWorkspace(): Workspace {
	return {
		rootId: ROOT_ID,
		items: Object.fromEntries(sampleItems.map((item) => [item.id, structuredClone(item)])),
	};
}
