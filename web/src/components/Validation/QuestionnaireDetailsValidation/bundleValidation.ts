import { Bundle, BundleEntry, Questionnaire } from "fhir/r4";
import { TFunction } from "react-i18next";
import { generarteQuestionnaireOrBundle } from "src/helpers/generateQuestionnaire";
import { TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadataType } from "src/types/IQuestionnaireMetadataType";
import { ValidationError } from "src/utils/validationUtils";

import { createError } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

export const validateBundle = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const questionnaires = generarteQuestionnaireOrBundle(state);

  errors.push(...validateQuestionnaireIds(t, questionnaires));
  return errors;
};

const validateQuestionnaireIds = (
  t: TFunction<"translation">,
  questionnaires: Questionnaire | Bundle,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (questionnaires.resourceType === "Bundle") {
    const questionnaireIds = questionnaires.entry?.map(
      (entry) => entry.resource?.id,
    );

    const seenIds = new Set<string>();
    questionnaireIds?.forEach((id) => {
      if (id) {
        if (seenIds.has(id)) {
          returnErrors.push(
            createError(
              "",
              IQuestionnaireMetadataType.id,
              t("One or more questionnaires in bundle has the same id"),
              ErrorLevel.error,
            ),
          );
        }
        seenIds.add(id);
      }
    });
  }
  return returnErrors;
};
