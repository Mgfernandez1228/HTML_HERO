const MainButton = ({ title, func, size }) => {
  const baseClasses = `bg-gray-800 text-white border-2 border-gray-500 rounded-2xl transition-transform duration-300 hover:text-cyan-300 hover:bg-gray-700 hover:scale-110 hover:shadow-[0_0px_20px_#00ffff]`;
  const sizeClasses = size === 'sm'
    ? 'p-2 px-4 sm:px-6 text-lg sm:text-xl md:text-2xl'
    : 'p-4 px-8 sm:px-12 md:px-16 lg:px-24 text-3xl sm:text-4xl md:text-5xl lg:text-6xl';

  return (
    <button
      onClick={func ? func : undefined}
      style={{ fontFamily: '"gameboy", "Courier New", Courier, monospace' }}
      className={`${baseClasses} ${sizeClasses}`}
    >
      {title}
    </button>
  );
};

export default MainButton;
