import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import useErrors from "ajv-errors";
import useKeywords from "ajv-keywords";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
useErrors(ajv);
useKeywords(ajv, "transform");

function compileSchema<T>(schema: JSONSchemaType<T>){
    return ajv.compile(schema);
}

export { 
    compileSchema, 
    JSONSchemaType 
};