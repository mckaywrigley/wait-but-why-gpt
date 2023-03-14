import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import { FC } from "react";
import king from "../public/pp-logo-icon.svg";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[88px] border-b border-gray-300 py-2 px-8 shadow-3xl items-center justify-between">
      <div className="font-bold text-2xl flex items-center">
        <a
          className="flex hover:opacity-50 items-center"
          href="#"
        >
          <Image
            className="hidden sm:flex"
            src={king}
            alt="The Network State GPT"
            height={40}
          />
          <div className="ml-4">HELP CENTER</div>
        </a>
      </div>
    </div>
  );
};
