import { LDOId } from './LDOId'
import { RDFPropertyType } from './RDFPropertyType';

export type LDOProperty = {
    property: LDOId;
    propertyType: RDFPropertyType;
    value: string
}