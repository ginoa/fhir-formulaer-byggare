import { Items, OrderItem } from '../store/treeStore/treeStore';
import { Coding, ValueSet, ValueSetCompose } from '../types/fhir';
import createUUID from './CreateUUID';
import { initPredefinedValueSet } from './initPredefinedValueSet';

export const addIDToValueSet = (compose: ValueSetCompose): ValueSetCompose => {
    const concept = compose.include[0].concept;

    const alteredConcept = concept?.map((x) => {
        return {
            ...x,
            id: x.id || createUUID(),
        };
    });

    return {
        include: [{ ...compose.include[0], concept: alteredConcept }],
    };
};

export const addPredefinedValueSet = (valueSets?: ValueSet[]): ValueSet[] => {
    const avalibleValueSets = valueSets?.map((x) => x.id) || ([] as string[]);

    const predefinedValueSetsToAdd = initPredefinedValueSet.filter((x) => !avalibleValueSets?.includes(x.id));

    const importedValueSets = [...(valueSets || [])].map((x) => {
        return { ...x, compose: x.compose ? addIDToValueSet(x.compose) : x.compose };
    });

    return [...predefinedValueSetsToAdd, ...importedValueSets];
};

export const getValueSetValues = (valueSet: ValueSet | undefined): Coding[] => {
    const codings: Coding[] = [];
    valueSet?.compose?.include.forEach((include) => {
        include?.concept?.forEach((concept) => {
            codings.push({
                code: concept.code,
                system: include.system,
                display: concept.display,
            });
        });
    });

    return codings;
};

export const getFirstAnswerValueSetFromOrderItem = (orderItem: OrderItem[], qItems: Items): string => {
    let newString: string = '';
    orderItem.forEach((item) => {
        const qItem = qItems[item.linkId];
        if (qItem.answerValueSet) {
            newString = qItem.answerValueSet;
        }
    })
    return newString;
}

export const getAllAnswerValueSetFromOrderItem = (orderItem: OrderItem[], qItems: Items): string[] => {
    const newArray: string[] = [];
    orderItem.forEach((item) => {
        const qItem = qItems[item.linkId];
        if (qItem.answerValueSet) {
            newArray.push(qItem.answerValueSet)
        }
    })
    return newArray;
}

export const doesAllItemsHaveSameAnswerValueSet = (orderItem: OrderItem[], qItems: Items): boolean => {
    const allChoiceAnswerValueSet = getAllAnswerValueSetFromOrderItem(orderItem, qItems);
    return allChoiceAnswerValueSet.every((answerValueSet) => answerValueSet === allChoiceAnswerValueSet[0])
}
