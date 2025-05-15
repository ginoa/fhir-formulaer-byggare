import { ValidationError } from "src/utils/validationUtils";

import { getValidationError } from "../components/Validation/validationHelper";
import { ErrorLevel } from "../components/Validation/validationTypes";

export const getTextValidationErrorClassName = (
  error: ValidationError,
): string => {
  switch (error.errorLevel) {
    case ErrorLevel.info:
      return "msg-info";
    case ErrorLevel.warning:
      return "msg-warning";
    default:
      return "msg-error";
  }
};

export const getValidaitonClassNameWithPropsName = (
  propsname: string,
  validationErrors: ValidationError[],
): string => {
  const error = getValidationError(propsname, validationErrors);
  return getValidationClassName(error);
};

export const getValidationClassName = (
  validationError: ValidationError | undefined,
): string => {
  switch (validationError?.errorLevel) {
    case ErrorLevel.info:
      return "validation-info";
    case ErrorLevel.warning:
      return "validation-warning";
    case ErrorLevel.error:
      return "validation-error";
    default:
      return "";
  }
};
