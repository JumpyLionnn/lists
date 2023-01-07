import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import useErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
useErrors(ajv);

function compileSchema<T>(schema: JSONSchemaType<T>){
    return ajv.compile(schema);
}

export { 
    compileSchema, 
    JSONSchemaType 
};