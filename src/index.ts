import Ajv2020, { MissingRefError } from 'ajv/dist/2020.js';
import schemaValidation from './schema-validation.json';
import fs from 'fs';
let ajv: Ajv2020;
let schema: object;

function validateCallback(elem: string | { data: string[] }, name: string) {
  if (typeof elem === 'string') {
    const buffer = fs.readFileSync('src\\schema\\' + elem);
    schema = JSON.parse(buffer.toString());
    addSchema(schema);
  } else if (typeof elem === 'object') {
    elem.data.forEach((dataJson) => {
      const buffer = fs.readFileSync('src\\data\\' + dataJson);
      const data = JSON.parse(buffer.toString());
      // schema must contain a root json schema object for validating chain of related schemas
      const valid = ajv.validate(schema, data);
      if (!valid) {
        console.log(dataJson + ' validating');
        console.log(ajv.errors);
      } else console.log(dataJson + ' validated successfuly');
    });
  }
}

function loadSchemas() {
  schemaValidation.resources.forEach((elem) => {
    validateCallback(elem, 'resources');
  });
  schemaValidation.services.forEach((elem) => {
    validateCallback(elem, 'services');
  });
  schemaValidation.project.forEach((elem) => {
    validateCallback(elem, 'project');
  });
  schemaValidation['step-opt'].forEach((elem) => {
    validateCallback(elem, 'step-opt');
  });
  schemaValidation['trigger-opt'].forEach((elem) => {
    validateCallback(elem, 'trigger-opt');
  });
  schemaValidation['components-opt'].forEach((elem) => {
    validateCallback(elem, 'components-opt');
  });
  schemaValidation['flow-opt'].forEach((elem) => {
    validateCallback(elem, 'flow-opt');
  });
  schemaValidation['flow-opt2'].forEach((elem) => {
    validateCallback(elem, 'flow-opt2');
  });
}

function addSchema(sch: any) {
  try {
    console.log(sch.$id + ' loading...');
    ajv.addSchema(sch).compile(sch);
    console.log(sch.$id + ' loaded successfuly');
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.indexOf('schema with key or id') > -1 && e.message.indexOf('already exists') > -1) {
        console.warn(e.message);
        return;
      }
      console.error(e.message);
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
