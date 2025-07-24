import config from "@/data/config";
import { Play } from "lucide-react";
import { Abyssinica_SIL } from "next/font/google";

const abyssinicaSIL = Abyssinica_SIL({
  variable: "--font-abyssinica-sil",
  subsets: ["latin"],
  weight: ["400"],
});

const Logo = () => {
  return (
    <div className="logo flex items-center gap-1 py-4">
      <Play className="size-5 mt-1/2" />
      <p className={`text-2xl font-bold ${abyssinicaSIL.variable}`}>
        {config.name}
      </p>
    </div>
  );
};

export default Logo;
