import { Coding, Extension } from "fhir/r4";

import { IExtensionType } from "../types/IQuestionnareItemType";
import {
  Language,
  MetadataProperty,
  SettingsProperty,
  TranslatableItemProperty,
  TranslatableMetadataProperty,
} from "../types/LanguageTypes";

import { isValidId } from "./MetadataHelper";
import { Languages, TreeState } from "../store/treeStore/treeStore";

export const INITIAL_LANGUAGE: Language = {
  code: "sv-SE",
  display: "Svenska",
  localDisplay: "Svenska",
};

export const supportedLanguages: Language[] = [
  INITIAL_LANGUAGE,
  { code: 'nb-NO', display: 'Norska (Bokmål)', localDisplay: 'Bokmål'},
  { code: "nn-NO", display: "Norska (nynorsk)", localDisplay: "Nynorsk" },
  { code: "se-NO", display: "Samiska", localDisplay: "Davvisámegillii" },
  { code: "en-GB", display: "Engelska", localDisplay: "English" },
  { code: "pl-PL", display: "Polska", localDisplay: "Polskie" },
  { code: "ro-RO", display: "Rumenska", localDisplay: "Română" },
  { code: "lt-LT", display: "Litauiska", localDisplay: "Lietuvis" },
  { code: "ru-RU", display: "Rysska", localDisplay: "русский" },
  { code: "fr-FR", display: "Franska", localDisplay: "Français" },
];

export const getLanguageFromCode = (
  languageCode: string,
): Language | undefined => {
  return supportedLanguages.find(
    (x) => x.code.toLowerCase() === languageCode.toLowerCase(),
  );
};

export const isSupportedLanguage = (languageCode: string): boolean => {
  return supportedLanguages.some(
    (lang) => lang.code.toLowerCase() === languageCode.toLowerCase(),
  );
};

export const getLanguagesInUse = ({
  qMetadata,
  qAdditionalLanguages,
}: TreeState): Language[] => {
  return supportedLanguages.filter(
    (x) =>
      qMetadata.language?.toLowerCase() === x.code.toLowerCase() ||
      (qAdditionalLanguages && qAdditionalLanguages[x.code]),
  );
};

export const getAdditionalLanguages = (state: TreeState): string[] => {
  const languageInUse = getLanguagesInUse(state).map((x) => x.code);
  return languageInUse.filter(
    (x) => x.toLowerCase() !== state.qMetadata.language?.toLowerCase(),
  );
};

export const isUniqueAcrossLanguages = (
  propertyName: TranslatableMetadataProperty,
  value: string,
  { qAdditionalLanguages, qMetadata }: TreeState,
  targetLanguage: string,
): boolean => {
  if (!qAdditionalLanguages || Object.keys(qAdditionalLanguages).length < 1) {
    return false;
  }
  const usedPropertyValues: string[] = [];
  const mainPropertyValue = String(qMetadata[propertyName]);
  if (mainPropertyValue) {
    usedPropertyValues.push(mainPropertyValue);
  }
  Object.entries(qAdditionalLanguages)
    .filter(([languageCode]) => languageCode !== targetLanguage)
    .forEach(([, translation]) => {
      usedPropertyValues.push(translation.metaData[propertyName]);
    });
  return !usedPropertyValues.some((usedValue) => usedValue === value);
};

export const translatableMetadata: MetadataProperty[] = [
  {
    propertyName: TranslatableMetadataProperty.title,
    label: "Tittel",
    markdown: false,
    validate: undefined,
  },
  {
    propertyName: TranslatableMetadataProperty.id,
    label: "Id",
    markdown: false,
    validate: (
      value: string,
      state?: TreeState,
      targetLanguage?: string,
    ): string => {
      if (!isValidId(value)) {
        return "Id must be 1-64 characters and only letters a-z, numbers, - and .";
      }
      if (
        state &&
        targetLanguage &&
        !isUniqueAcrossLanguages(
          TranslatableMetadataProperty.id,
          value,
          state,
          targetLanguage,
        )
      ) {
        return "Id must be unique across languages";
      }
      return "";
    },
  },
  {
    propertyName: TranslatableMetadataProperty.url,
    label: "Url",
    markdown: false,
    validate: undefined,
  },
  {
    propertyName: TranslatableMetadataProperty.description,
    label: "Description",
    markdown: false,
    validate: undefined,
  },
  {
    propertyName: TranslatableMetadataProperty.publisher,
    label: "Publisher",
    markdown: false,
    validate: undefined,
  },
  {
    propertyName: TranslatableMetadataProperty.purpose,
    label: "Purpose",
    markdown: true,
    validate: undefined,
  },
  {
    propertyName: TranslatableMetadataProperty.copyright,
    label: "Copyright",
    markdown: true,
    validate: undefined,
  },
];

export const translatableSettings: {
  [key in IExtensionType]?: SettingsProperty;
} = {
  [IExtensionType.printVersion.toString()]: {
    extension: IExtensionType.printVersion,
    label: "Print version",
    generate: (value: string): Extension => {
      return {
        url: IExtensionType.printVersion,
        valueReference: {
          reference: value,
        },
      };
    },
    getValue: (e: Extension): string | undefined => {
      return e?.valueReference?.reference;
    },
  },
};
export function getItemPropertyTranslation(
  languageCode: string,
  languages: Languages,
  linkId: string,
  property: Exclude<TranslatableItemProperty, "code">,
): string {
  if (!languages[languageCode].items[linkId]) {
    return "";
  }

  return languages[languageCode].items[linkId][property] || "";
}

export const getItemCodeDisplayTranslation = (
  languageCode: string,
  languages: Languages,
  linkId: string,
  code: Coding,
): string => {
  if (!languages[languageCode].items[linkId]) {
    return "";
  }
  return (
    languages[languageCode].items[linkId].code?.find(
      (x) => x.code === code.code && x.system === code.system,
    )?.display ||
    code.display ||
    ""
  );
};
