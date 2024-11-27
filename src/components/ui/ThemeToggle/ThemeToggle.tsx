import { useTheme } from "@/Context/ContextTheme";
import Sun from "../../../assets/svg/sun.svg?react";
import Moon from "../../../assets/svg/moon.svg?react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center justify-center">
      <label
        className="relative flex items-center cursor-pointer"
        htmlFor="theme-toggle"
      >
        <input
          id="theme-toggle"
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
          className="sr-only peer"
        />
        <div
          className={`w-14 h-7 rounded-full transition-all duration-300 ease-in-out relative border-[1px] border-[#6D28D9] ${
            theme === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div
            className={`absolute top-1 w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${
              theme === "dark"
                ? "bg-white translate-x-7"
                : "bg-black translate-x-1"
            }`}
          ></div>

          {theme === "dark" ? (
            <Sun
              width={18}
              height={18}
              fill="#fff"
              className=" absolute top-1 left-1"
            />
          ) : (
            <Moon
              height={25}
              width={25}
              fill="#000"
              stroke="#000"
              className=" absolute top-0 right-0"
            />
          )}
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
