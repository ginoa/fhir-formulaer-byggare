import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getAllOrderItemChildrenOfItem } from "src/helpers/codeHelper";
import {
  existItemControlWithCode,
  ItemControlType,
} from "src/helpers/itemControl";
import { doesAllItemsHaveSameAnswerValueSet } from "src/helpers/valueSetHelper";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireItemType } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { createError } from "../validationHelper";
import { ErrorLevel, ValidationType } from "../validationTypes";

export const validateTableElements = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  state.qOrder.forEach((item) =>
    validate(t, item, state.qItems, state.qOrder, errors),
  );

  return errors;
};

const validate = (
  t: TFunction<"translation">,
  currentItem: OrderItem,
  qItems: Items,
  qOrder: OrderItem[],
  errors: ValidationError[],
): void => {
  const qItem = qItems[currentItem.linkId];

  // Answer options table (table)
  errors.push(...validateAnswerOptionsTable(t, qItem, qOrder, qItems));

  currentItem.items.forEach((item) =>
    validate(t, item, qItems, qOrder, errors),
  );
};

const validateAnswerOptionsTable = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
  qItems: Items,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (
    qItem.type === IQuestionnaireItemType.group &&
    existItemControlWithCode(qItem, ItemControlType.table)
  ) {
    const orderItems = getAllOrderItemChildrenOfItem(qOrder, qItem.linkId);

    if (orderItems.length === 0) {
      returnErrors.push(
        createError(
          qItem.linkId,
          ValidationType.table,
          t("Table with answer options has no children"),
          ErrorLevel.error,
        ),
      );
    } else {
      const allAnswerValueSetHasSameValue = doesAllItemsHaveSameAnswerValueSet(
        orderItems,
        qItems,
      );
      if (!allAnswerValueSetHasSameValue) {
        returnErrors.push(
          createError(
            qItem.linkId,
            ValidationType.table,
            t(
              "All answerValueSet values within a group with coding 'table' must be equal",
            ),
            ErrorLevel.error,
          ),
        );
      }
    }
  }
  return returnErrors;
};
