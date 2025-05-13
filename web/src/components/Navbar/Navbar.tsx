import React, { useContext, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, NavLink } from "react-router-dom";
import { setItemValidationErrors } from "src/helpers/validation/validationHelper";
import { useUploadFile } from "src/hooks/useUploadFile";
import { saveQuestionnaire } from "src/store/treeStore/indexedDbHelper";
import { getInitialState } from "src/store/treeStore/initialState";

import { generateQuestionnaire } from "../../helpers/generateQuestionnaire";
import { validateSidebar } from "../../helpers/validation/orphanValidation";
import { infoSecurity } from "../../helpers/validation/securityValidation";
import {
  validateTranslations,
  warnMarkdownInTranslations,
} from "../../helpers/validation/translationValidation";
import useOutsideClick from "../../hooks/useOutsideClick";
import MoreIcon from "../../images/icons/ellipsis-horizontal-outline.svg";
import {
  resetQuestionnaireAction,
  saveAction,
} from "../../store/treeStore/treeActions";
import { TreeContext } from "../../store/treeStore/treeStore";
import { ValidationErrors } from "../../utils/validationUtils";
import Btn from "../Btn/Btn";
import "./Navbar.css";
import ImportValueSet from "../ImportValueSet/ImportValueSet";
import JSONView from "../JSONView/JSONView";
import CloseFormModal from "../Modal/CloseFormModal";
import PredefinedValueSetModal from "../PredefinedValueSetModal/PredefinedValueSetModal";
import { ValidationErrorsModal } from "../ValidationErrorsModal/validationErrorsModal";

type Props = {
  showFormFiller: () => void;
  setValidationErrors: (errors: ValidationErrors[]) => void;
  setTranslationErrors: (errors: ValidationErrors[]) => void;
  setSidebarErrors: (errors: ValidationErrors[]) => void;
  setMarkdownWarning: (warning: ValidationErrors | undefined) => void;
  setSecurityInformation: (info: ValidationErrors | undefined) => void;
  setCloseForm: React.Dispatch<React.SetStateAction<boolean>>;
  validationErrors: ValidationErrors[];
  translationErrors: ValidationErrors[];
  sidebarErrors: ValidationErrors[];
  markdownWarning: ValidationErrors | undefined;
  securityInformation: ValidationErrors | undefined;
};

enum MenuItem {
  none = "none",
  file = "file",
  more = "more",
}

const Navbar = ({
  showFormFiller,
  setValidationErrors,
  setTranslationErrors,
  setSidebarErrors,
  setMarkdownWarning,
  setSecurityInformation,
  setCloseForm,
  validationErrors,
  translationErrors,
  sidebarErrors,
  markdownWarning,
  securityInformation,
}: Props): React.JSX.Element => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { uploadQuestionnaire, uploadRef } = useUploadFile({
    onUploadComplete: (formId: string) => {
      navigate(`/formbuilder/${formId}`);
      hideMenu();
    },
  });
  const { state, dispatch } = useContext(TreeContext);
  const [selectedMenuItem, setSelectedMenuItem] = useState(MenuItem.none);
  const [showContained, setShowContained] = useState(false);
  const [showImportValueSet, setShowImportValueSet] = useState(false);
  const [showJSONView, setShowJSONView] = useState(false);
  const [showCloseFormModal, setShowCloseFormModal] = useState(false);
  const [showValidationErrors, setShowValidationErrors] =
    useState<boolean>(false);
  const navBarRef = useRef<HTMLDivElement>(null);
  const fileExtension = "json";
  const hideMenu = (): void => {
    setSelectedMenuItem(MenuItem.none);
  };

  useOutsideClick(navBarRef, hideMenu, selectedMenuItem === MenuItem.none);

  const callbackAndHide = (callback: () => void): void => {
    callback();
    hideMenu();
  };

  const getFileName = (): string => {
    let technicalName = state.qMetadata.name || "skjema";
    technicalName =
      technicalName.length > 40
        ? technicalName.substring(0, 40) + "..."
        : technicalName;
    const version = state.qMetadata.version
      ? `-v${state.qMetadata.version}`
      : "";
    if (
      state.qAdditionalLanguages &&
      Object.values(state.qAdditionalLanguages).length < 1
    ) {
      return `${technicalName}-${state.qMetadata.language}${version}`;
    }
    return `${technicalName}${version}`;
  };

  function exportToJsonAndDownload(): void {
    const questionnaire = generateQuestionnaire(state);
    const filename = `${getFileName()}.${fileExtension}`;
    const contentType = "application/json;charset=utf-8;";

    /*eslint-disable */
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      const blob = new Blob([decodeURIComponent(encodeURI(questionnaire))], {
        type: contentType,
      });
      (navigator as any).msSaveOrOpenBlob(blob, filename);
      /*eslint-enable */
    } else {
      const a = document.createElement("a");
      a.download = filename;
      a.href = "data:" + contentType + "," + encodeURIComponent(questionnaire);
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    dispatch(saveAction());
  }

  const handleMenuItemClick = (clickedItem: MenuItem): void => {
    if (selectedMenuItem !== clickedItem) {
      setSelectedMenuItem(clickedItem);
    } else {
      hideMenu();
    }
  };

  const cachedProfile = sessionStorage.getItem("profile");
  const profile = cachedProfile ? JSON.parse(cachedProfile) : null;

  function getProfileName(): string {
    return `${profile.given_name} ${profile.family_name}`;
  }

  const closeForm = (): void => {
    if (!state.isDirty) {
      setCloseForm(true);
    } else {
      setShowCloseFormModal(true);
    }
  };

  const handleSetNewQuestionnaire = async (): Promise<void> => {
    const state = getInitialState(true);
    dispatch(resetQuestionnaireAction(state));
    await saveQuestionnaire(state);
    navigate(`/formbuilder/${state.qMetadata.id}`);
    hideMenu();
  };

  return (
    <>
      <header ref={navBarRef}>
        <NavLink to="/" className="form-logo">
          <h2 className="form-title--link">{t("Frontpage")}</h2>
        </NavLink>
        <div className="form-title">
          <h1>{getFileName()}</h1>
        </div>

        <div className="pull-right">
          {profile && profile.name && (
            <p
              className="truncate profile-name"
              title={t("You are logged in as {0}").replace("{0}", profile.name)}
            >
              {getProfileName()}
            </p>
          )}
          <Btn title={t("Preview")} onClick={showFormFiller} />
          <Btn title={t("Save")} onClick={() => exportToJsonAndDownload()} />
          <div
            className="more-menu"
            tabIndex={0}
            role="button"
            aria-label="menu list"
            aria-pressed="false"
            onClick={() => handleMenuItemClick(MenuItem.more)}
            onKeyPress={(e) =>
              e.code === "Enter" && handleMenuItemClick(MenuItem.more)
            }
          >
            <img
              className="more-menu-icon"
              src={MoreIcon}
              alt="more icon"
              height={25}
            />
          </div>
        </div>
        {selectedMenuItem === MenuItem.more && (
          <div className="menu">
            <Btn
              title={t("Validate")}
              onClick={() => {
                setValidationErrors(setItemValidationErrors(t, state));
                setTranslationErrors(validateTranslations(t, state));
                setSidebarErrors(
                  validateSidebar(t, state.qItems, state.qMetadata),
                );
                setMarkdownWarning(warnMarkdownInTranslations(t, state));
                setSecurityInformation(infoSecurity(t, state.qMetadata));
                setShowValidationErrors(true);
              }}
            />
            <Btn
              title={t("JSON")}
              onClick={() =>
                callbackAndHide(() => setShowJSONView(!showJSONView))
              }
            />
            <Btn
              title={t("Import choices")}
              onClick={() =>
                callbackAndHide(() =>
                  setShowImportValueSet(!showImportValueSet),
                )
              }
            />
            <Btn
              title={t("Choices")}
              onClick={() =>
                callbackAndHide(() => setShowContained(!showContained))
              }
            />
            {i18n.language !== "nb-NO" && (
              <Btn
                title={t("Change to norwegian")}
                onClick={() =>
                  callbackAndHide(() => {
                    i18n.changeLanguage("nb-NO");
                    localStorage.setItem("editor_language", "nb-NO");
                  })
                }
              />
            )}
            {i18n.language !== "en-US" && (
              <Btn
                title={t("Change to English")}
                onClick={() =>
                  callbackAndHide(() => {
                    i18n.changeLanguage("en-US");
                    localStorage.setItem("editor_language", "en-US");
                  })
                }
              />
            )}
            {i18n.language !== "fr-FR" && (
              <Btn
                title={t("Change to French")}
                onClick={() =>
                  callbackAndHide(() => {
                    i18n.changeLanguage("fr-FR");
                    localStorage.setItem("editor_language", "fr-FR");
                  })
                }
              />
            )}
            <Btn title={t("Close form")} onClick={closeForm} />
            <Btn
              title={t("Upload questionnaire")}
              onClick={() => {
                uploadRef.current?.click();
              }}
            />
            <input
              type="file"
              ref={uploadRef}
              onChange={uploadQuestionnaire}
              accept="application/json"
              style={{ display: "none" }}
            />
            <Btn
              title={t("New questionnaire")}
              onClick={handleSetNewQuestionnaire}
            />
          </div>
        )}
      </header>
      {showValidationErrors && (
        <ValidationErrorsModal
          validationErrors={validationErrors}
          translationErrors={translationErrors}
          sidebarErrors={sidebarErrors}
          markdownWarning={markdownWarning}
          securityInformation={securityInformation}
          qAdditionalLanguages={state.qAdditionalLanguages}
          onClose={() => setShowValidationErrors(false)}
        />
      )}
      {showContained && (
        <PredefinedValueSetModal
          close={() => setShowContained(!showContained)}
        />
      )}
      {showImportValueSet && (
        <ImportValueSet
          close={() => setShowImportValueSet(!showImportValueSet)}
        />
      )}
      {showJSONView && (
        <JSONView showJSONView={() => setShowJSONView(!showJSONView)} />
      )}
      {showCloseFormModal && (
        <CloseFormModal
          setShowCloseFormModal={setShowCloseFormModal}
          setCloseForm={setCloseForm}
          hideMenu={hideMenu}
        />
      )}
    </>
  );
};

export default Navbar;
