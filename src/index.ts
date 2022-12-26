import Ajv2020, { MissingRefError } from 'ajv/dist/2020.js';
import schemaValidation from './schema-validation.json';
import fs from 'fs';
import path from 'path';
let ajv: Ajv2020;
let schema: object;

function validateCallback(elem: string | { data: string[] }, name: string) {
  if (typeof elem === 'string') {
    const buffer = fs.readFileSync(path.resolve(__dirname, 'schema\\' + elem));
    schema = JSON.parse(buffer.toString());
    addSchema(schema);
  } else if (typeof elem === 'object') {
    elem.data.forEach((dataJson) => {
      const buffer = fs.readFileSync(path.resolve(__dirname, 'data\\' + dataJson));
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

function validatePairsCallback(elem: {schema: string, data: string}) {
  let buffer = fs.readFileSync(path.resolve(__dirname, 'schema\\' + elem.schema));
  const schema = JSON.parse(buffer.toString());
  addSchema(schema);
  buffer = fs.readFileSync(path.resolve(__dirname, 'data\\' + elem.data));
  const data = JSON.parse(buffer.toString());
  const valid = ajv.validate(schema, data);
  if (!valid) {
    console.log(elem.data + ' validating');
    console.log(ajv.errors);
  } else console.log(elem.data + ' validated successfuly');
}

function loadSchemas() {
  schemaValidation.step.forEach((elem) => {
    validateCallback(elem, 'step');
  });
  schemaValidation.trigger.forEach((elem) => {
    validateCallback(elem, 'trigger');
  });
  schemaValidation.components.forEach((elem) => {
    validateCallback(elem, 'components');
  });
  schemaValidation.flow.forEach((elem) => {
    validateCallback(elem, 'flow');
  });
  schemaValidation.bp.forEach((elem) => {
    validateCallback(elem, 'bp');
  });
  schemaValidation.repositories.forEach((elem) => {
    validatePairsCallback(elem);
  });
  schemaValidation.resourcesandservices.forEach((elem) => {
    validatePairsCallback(elem);
  });
  schemaValidation.project.forEach((elem) => {
    validateCallback(elem, 'project');
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
