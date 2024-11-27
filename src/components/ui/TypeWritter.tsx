import { useEffect, useState } from "react";

const TypeWritter = ({
  text,
  speed = 150,
}: {
  text: string;
  speed: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index === text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setIsCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorBlink);
  }, []);

  return (
    <div
      style={{ fontFamily: "monospace" }}
      className="text-3xl text-center mt-20 text-black dark:text-white relative z-30 transition-all"
    >
      {displayedText}
      <span style={{ visibility: isCursorVisible ? "visible" : "hidden" }}>
        |
      </span>
    </div>
  );
};

export default TypeWritter;
