import { BuildManager } from "./build_manager";
import { YamlConfigLoader } from "./config_loader";
import { CycleChecker } from "./cycle_checker";
import { PatternRuleExpander } from "./pattern_rule";
import { PatternDisplayOnly } from "./pattern_user_show";
import { VariableExpandProcessor } from "./variable_expander";

const main = async () => {
  const yamlConfig = process.argv[2];
  const yamlConfigLoader = new YamlConfigLoader(yamlConfig);
  const patternRuleGraphBuilder = new PatternRuleExpander();
  const cycleChecker = new CycleChecker();
  const variableExpander = new VariableExpandProcessor();
  const patternDisplayRunner = new PatternDisplayOnly();

  const builder = new BuildManager(
    yamlConfigLoader,
    patternRuleGraphBuilder,
    [
      cycleChecker,
      variableExpander
    ],
    patternDisplayRunner
  );
  builder.build();
}
main()
