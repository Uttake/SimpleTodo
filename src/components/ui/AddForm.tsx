import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import clsx from "clsx";
import { useTheme } from "@/Context/ContextTheme";

type Props = {
  btnTitle: string;
  onAdd: (title: string) => void;
  className?: string;
  placeholder: string;
};

const AddForm = ({ btnTitle, onAdd, className, placeholder }: Props) => {
  const [title, setTitle] = useState("");
  const { theme } = useTheme();
  return (
    <form
      data-theme={theme}
      className={clsx(
        className,
        "flex justify-center items-center gap-5 group"
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-black dark:text-white"
        placeholder={placeholder}
      />
      <Button
        variant={"default"}
        onClick={() => {
          if (title === "") return;
          onAdd(title);
          setTitle("");
        }}
        className=" bg-[#008bd0]"
      >
        {btnTitle}
      </Button>
    </form>
  );
};

export default AddForm;
