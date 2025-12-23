const MainButton = ({ title, func, size }) => {
  const baseClasses = `bg-gray-800 text-white border-2 border-gray-500 rounded-2xl transition-transform duration-300 hover:text-cyan-300 hover:bg-gray-700 hover:scale-110 hover:shadow-[0_0px_20px_#00ffff]`;
  const sizeClasses = size === 'sm'
    ? 'p-2 px-4 sm:px-6 text-sm sm:text-base md:text-lg'
    : 'p-3 px-6 sm:px-8 md:px-10 lg:px-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl';

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
