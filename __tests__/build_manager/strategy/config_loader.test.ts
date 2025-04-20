import mock from 'mock-fs'
import { YamlConfigLoader } from '../../../build_manager/strategy/yaml_config_loader'

describe('test yaml config loader using mock filesystem', () => {
  const simpleRuleYmlPath = 'simple_rules.yml';
  beforeEach(() => {
    mock({
      [simpleRuleYmlPath]: `- target: A
  depends:
  - B
  - C
  recipes:
  - "update A from B and C"
- target: B
  depends:
  - C
  recipes:
  - "update B from C"
- target: C
  depends: []
  recipes: []
`})
  })

  afterEach(() => {
    mock.restore()
  })

  test('test yaml config loader happy path', () => {
    const yamlConfig = new YamlConfigLoader(simpleRuleYmlPath);
    const rules = yamlConfig.load();
    expect(rules.length).toBe(3);
    expect(rules[0].target).toBe('A');
    expect(rules[0].depends.length).toBe(2);
    expect(rules[2].depends.length).toBe(0);
  })
})
