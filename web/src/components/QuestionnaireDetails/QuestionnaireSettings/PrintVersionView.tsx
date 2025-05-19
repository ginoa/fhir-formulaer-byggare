import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getValidationError } from "src/components/Validation/validationHelper";
import { ValidationType } from "src/components/Validation/validationTypes";
import { translatableSettings } from "src/helpers/LanguageHelper";
import {
  getTextValidationErrorClassName,
  getValidaitonClassNameWithPropsName,
} from "src/helpers/validationClassHelper";
import { ValidationError } from "src/utils/validationUtils";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

interface PrintVersionViewProps {
  errors: ValidationError[];
  removeExtension: (extensionUrl: string) => void;
  updateExtension: (extension: Extension) => void;
}

const PrintVersionView = ({
  errors,
  removeExtension,
  updateExtension,
}: PrintVersionViewProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  const validationError = getValidationError(ValidationType.binary, errors);

  return (
    <FormField label={t("Connect to print version (binary)")}>
      <InputField
        className={getValidaitonClassNameWithPropsName(
          ValidationType.binary,
          errors,
        )}
        placeholder={t("For example Binary/35")}
        defaultValue={
          qMetadata?.extension?.find(
            (ex) => ex.url === IExtensionType.printVersion,
          )?.valueReference?.reference ?? ""
        }
        onBlur={(e) => {
          if (!e.target.value) {
            removeExtension(IExtensionType.printVersion);
          } else {
            const extensionSettings =
              translatableSettings[IExtensionType.printVersion];
            if (extensionSettings) {
              updateExtension(extensionSettings.generate(e.target.value));
            }
          }
        }}
      />
      {validationError?.errorReadableText && (
        <div
          className={getTextValidationErrorClassName(validationError)}
          aria-live="polite"
        >
          {validationError.errorReadableText}
        </div>
      )}
    </FormField>
  );
};

export default PrintVersionView;
