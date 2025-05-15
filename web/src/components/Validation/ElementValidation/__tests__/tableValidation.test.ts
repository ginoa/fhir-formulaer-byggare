import { QuestionnaireItem } from "fhir/r4";
import { ItemControlType } from "src/helpers/itemControl";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { ErrorLevel, ValidationType } from "../../validationTypes";
import { validateTableElements } from "../tableValidation";

const groupItem = {
  linkId: "1",
  type: "group",
  text: "Group",
  extension: [
    {
      url: IExtensionType.itemControl,
      valueCodeableConcept: {
        coding: [
          {
            code: ItemControlType.table,
            system: IValueSetSystem.itemControlValueSet,
          },
        ],
      },
    },
  ],
} as QuestionnaireItem;

describe("data-receiver Validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("table with answer options as columns", () => {
    it("table has no children", () => {
      const qOrder = [{ linkId: "1", items: [] }] as OrderItem[];
      const treeState = {
        qOrder: qOrder,
        qItems: { "1": groupItem } as Items,
      } as TreeState;

      const validationErrors = validateTableElements(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorProperty).toBe(ValidationType.table);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Table with answer options has no children",
      ]);
    });

    it("table has no children", () => {
      const child1 = {
        linkId: "1.1",
        text: "Choice 1",
        type: "choice",
        answerValueSet: "#1101",
      } as QuestionnaireItem;
      const child2 = {
        linkId: "1.2",
        text: "Choice 2",
        type: "choice",
        answerValueSet: "#1102",
      } as QuestionnaireItem;
      const qOrder = [
        {
          linkId: "1",
          items: [
            { linkId: "1.1", items: [] },
            { linkId: "1.2", items: [] },
          ],
        },
      ] as OrderItem[];
      const treeState = {
        qOrder: qOrder,
        qItems: { "1": groupItem, "1.1": child1, "1.2": child2 } as Items,
      } as TreeState;

      const validationErrors = validateTableElements(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorProperty).toBe(ValidationType.table);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "All answerValueSet values within a group with coding 'table' must be equal",
      ]);
    });
  });
});
