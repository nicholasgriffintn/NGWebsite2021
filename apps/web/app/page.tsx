import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  return (
    <main>
       <div className="pt-6 pb-6 flex flex-col items-center space-y-4 text-center">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-white-800">Hi! I'm Nicholas Griffin!</h1>
        <p className="text-white-600">I'm currently rebuilding my website after a bit of a break, please bare with.</p>
      </div>
    </main>
  );
}
