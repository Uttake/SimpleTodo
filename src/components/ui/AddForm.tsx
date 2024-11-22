import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import clsx from "clsx";

type Props = {
  btnTitle: string;
  onAdd: (title: string) => void;
  className?: string;
  placeholder: string;
};

const AddForm = ({ btnTitle, onAdd, className, placeholder }: Props) => {
  const [title, setTitle] = useState("");

  return (
    <form
      className={clsx(className, "flex justify-center items-center gap-5")}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-white"
        placeholder={placeholder}
      />
      <Button
        variant={"default"}
        onClick={() => {
          if (title === "") return;
          onAdd(title);
          setTitle("");
        }}
        className=" bg-cyan-700"
      >
        {btnTitle}
      </Button>
    </form>
  );
};

export default AddForm;
