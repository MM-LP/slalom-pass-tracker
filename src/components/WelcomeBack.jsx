export default function WelcomeBack({ user }) {
    return (
      <div className="text-center p-6">
        <div className="text-6xl mb-4">🏄‍♂️</div>  {/* Water Ski Icon */}
        <h1 className="text-3xl font-bold mb-4">Welcome Back, {user?.user_metadata?.username || 'Skier'}!</h1>
        <p className="text-sky-600 dark:text-sky-300">
          Ready to track your next set? 🎯🌊
        </p>
      </div>
    );
  }
  