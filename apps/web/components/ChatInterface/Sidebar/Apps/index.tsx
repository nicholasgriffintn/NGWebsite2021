import { SidebarPodcastApp } from './PodcastApp';

export function SidebarApps() {
  return (
    <div className="px-4 space-y-2 pt-4">
      <span className="text-xs text-muted-foreground">Apps</span>
      <div className="grid grid-cols-4 gap-4">
        <SidebarPodcastApp />
      </div>
    </div>
  );
}
