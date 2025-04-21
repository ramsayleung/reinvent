import { BuildManager } from "./build_manager";
import { YamlConfigLoader } from "./yaml_config_loader"
import { CycleChecker } from "./cycle_checker";
import { PatternRuleExpander } from "./pattern_rule";
import { VariableExpandProcessor } from "./variable_expander";
import { AddTimestampProcessor } from "./add_timestamp";
import { TimebasedStaleStrategy } from "./timebased_stale_strategy";
import { ShellRunner } from "./shell_runner";
import { IRunner } from "./interface";

const main = async () => {
  const yamlConfig = process.argv[2];
  const yamlConfigLoader = new YamlConfigLoader(yamlConfig);
  const patternRuleGraphBuilder = new PatternRuleExpander();
  const cycleChecker = new CycleChecker();
  const variableExpander = new VariableExpandProcessor();
  const timebasedStaleStrategy = new TimebasedStaleStrategy();
  const runner: IRunner = new ShellRunner(timebasedStaleStrategy, process.argv.slice(3));
  const addtimestampProcessor = new AddTimestampProcessor();

  const builder = new BuildManager(
    yamlConfigLoader,
    patternRuleGraphBuilder,
    [
      cycleChecker,
      variableExpander,
      addtimestampProcessor
    ],
    runner
  );
  await builder.build();
}
main()
