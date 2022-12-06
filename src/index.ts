import Ajv2020 from 'ajv/dist/2020.js';
import schema_res from './schema/resources.json';
import schema_res_elem from './schema/resource-element.json';
import schema_service from './schema/services.json';
import data_res from './data/resources-data.json';

import schema_proj from './schema/project.json';
import schema_step from './schema/step.json';
import schema_flow from './schema/flow.json';
import schema_bp from './schema/business-process.json';
import schema_repos from './schema/repositories.json';
import data_proj from './data/project-data.json';

export function schemasCompileAndValidate(): boolean {
  const ajv = new Ajv2020(); // options can be passed, e.g. {allErrors: true}

  // resources and services validation
  ajv.addSchema(schema_res_elem).compile(schema_res_elem);
  ajv.addSchema(schema_res).compile(schema_res);
  ajv.addSchema(schema_service).compile(schema_service);

  const validRes = ajv.validate(schema_res, data_res);
  if (!validRes) {
    console.log(ajv.errors);
    return false;
  } else console.log('resources validation successful');

  const validSrv = ajv.validate(schema_service, data_res);
  if (!validSrv) {
    console.log(ajv.errors);
    return false;
  } else console.log('services validation successful');

  // project validation
  ajv.addSchema(schema_repos).compile(schema_repos);
  ajv.addSchema(schema_step).compile(schema_step);
  ajv.addSchema(schema_flow).compile(schema_flow);
  ajv.addSchema(schema_bp).compile(schema_bp);
  ajv.addSchema(schema_proj).compile(schema_proj);

  const validProj = ajv.validate(schema_proj, data_proj);
  if (!validProj) {
    console.log(ajv.errors);
    return false;
  } else console.log('project validation successful');

  console.log('end validation');
  return true;
}

schemasCompileAndValidate();