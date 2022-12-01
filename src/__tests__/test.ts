import { schemasCompileAndValidate } from '../index';
test('compiling and validationg all the schemas', () => {
  expect(schemasCompileAndValidate()).toBe(true);
});
