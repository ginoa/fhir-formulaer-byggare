import React, { MouseEvent } from "react";

import { useTranslation } from "react-i18next";

import Btn from "../Btn/Btn";
import IconBtn from "../IconBtn/IconBtn";
import "./Modal.css";

type Props = {
  close?: () => void;
  primary?: (event?: MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  children: React.JSX.Element | React.JSX.Element[];
  size?: "large" | "small";
  id?: string;
  buttonSecondaryText?: string;
  buttonPrimaryText?: string;
};

const Modal = ({
  close,
  primary,
  children,
  title,
  size = "small",
  id,
  buttonSecondaryText,
  buttonPrimaryText,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="overlay align-everything">
      <div className={`modal ${size}`} id={id}>
        <div className="title">
          <IconBtn type="x" title={t("Close")} onClick={close} />
          <h1>{title}</h1>
        </div>
        <div className="content">{children}</div>
        <div className="modal-btn-bottom">
          <div className="center-text">
            {buttonSecondaryText && (
              <Btn
                title={buttonSecondaryText}
                type="button"
                variant="secondary"
                onClick={close}
              />
            )}
            {buttonPrimaryText && (
              <Btn
                title={buttonPrimaryText}
                type="button"
                variant="primary"
                onClick={primary}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
