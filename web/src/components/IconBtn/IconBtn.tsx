import React from "react";
import "./IconBtn.css";

type IconBtnProps = {
  type?: "back" | "forward" | "x" | "info" | "copy" | "check";
  title?: string;
  onClick?: () => void;
  color?: "white" | "black";
  size?: "large";
  position?: "left" | "right";
};

const IconBtn = ({
  type,
  title,
  onClick,
  color = "white",
  size,
  position,
}: IconBtnProps): React.JSX.Element => {
  const classNames: Array<string> = ["iconBtn"];
  if (color) {
    classNames.push(color);
  }
  if (size) {
    classNames.push(size);
  }
  if (position) {
    classNames.push(position);
  }
  let icon = "";
  switch (type) {
    case "check": {
      icon = "ion-checkmark";
      break;
    }
    case "copy": {
      icon = "ion-ios-copy";
      break;
    }
    case "back": {
      icon = "ion-ios-arrow-back";
      break;
    }
    case "forward": {
      icon = "ion-ios-arrow-forward";
      break;
    }
    case "info": {
      icon = "ion-ios-information-outline";
      break;
    }
    default:
      icon = "ion-close-round";
  }

  return (
    <button className={classNames.join(" ")} title={title} onClick={onClick}>
      <i className={icon} />
    </button>
  );
};

export default IconBtn;
