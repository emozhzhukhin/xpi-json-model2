import Ajv2020, { MissingRefError } from 'ajv/dist/2020.js';
import schemaValidation from './schema-validation.json'
import fs from 'fs';
var ajv: Ajv2020;
var schema: object;

function validateCallback(elem: (string | {data: string[]}), name: string) {
    if(typeof elem === 'string')
    {
        const buffer = fs.readFileSync('src\\schema\\' + elem);
        schema = JSON.parse(buffer.toString());
        addSchema(schema);
    }
    else if (typeof elem === 'object')
    {
        elem.data.forEach( (dataJson) => {
            const buffer = fs.readFileSync('src\\data\\' + dataJson);
            const data = JSON.parse(buffer.toString());
            //schema must contain a root json schema object for validating chain of related schemas
            const valid = ajv.validate(schema, data);
            if (!valid) console.log(ajv.errors);
            else console.log(name +' validation successful');
          
        })
    }

}

function loadSchemas() {
    schemaValidation.resources.forEach(elem => {
        validateCallback(elem, 'resources');
    });
    schemaValidation.services.forEach(elem => {
        validateCallback(elem, 'services');
    });
    schemaValidation.project.forEach(elem => {
        validateCallback(elem, 'project');
    });
}

function addSchema(schema: any) {
    try {
        ajv.addSchema(schema).compile(schema);
    } catch (e) {
        if(e instanceof Error) {
            if(e.message.indexOf('already exists') > -1) {
              console.error(e.message);
              return;
            }
        }
        throw e;
    }
}

export function schemasCompileAndValidate(): boolean {
  ajv = new Ajv2020(); // options can be passed, e.g. {allErrors: true}

  loadSchemas();

  console.log('end validation');

  return true;
}

schemasCompileAndValidate();