"use client"
import MainButton from "./components/MainButton";
import { useRouter } from "next/navigation"; 
export default function Home() { 
  const router = useRouter()

  const loadLevel1 = () => {
    router.push('levels/Level1')
  }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black animate-gradient text-white">
      <div className="relative z-10 flex flex-col items-center gap-20">
        <h1 className="font-extrabold text-9xl text-white drop-shadow-[0_0_25px_#00ffff] [text-shadow:3px_5px_0px_#1a1a1a,6px_8px_15px_rgba(0,0,0,0.7)] breathe">
          HTML HERO
        </h1>
        <div className="flex flex-col gap-6">
          <MainButton title="New Game" func={loadLevel1} />
          <MainButton title="Load Game" func={loadLevel1}/>
          <MainButton title="Settings"  func={loadLevel1}/>
        </div>
      </div>
    </div>
  );
}
