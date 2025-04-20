import PatternUserRead from "./pattern_user_read";
import graphlib from '@dagrejs/graphlib';

export default class PatternUserShow extends PatternUserRead {
  run(): void {
    console.log(JSON.stringify(this.toJSON(), null, 2));
  }

  toJSON() {
    return {
      graph: graphlib.json.write(this.graph),
      rules: Array.from(this.rules.keys()).map(key => {
        return { k: key, v: this.rules.get(key) }
      })
    }
  }
}
