import minimist from 'minimist';
import { glob } from 'glob';
import hope from './hope';
import { fileURLToPath } from 'url';

const parse = (args: string[]) => {
  const parsed = minimist(args)

  return {
    // Default root directory is current directory if not specified
    root: parsed.root || '.',

    // Output format can be 'terse' or 'verbose' (default)
    output: parsed.output || 'verbose',

    // Array of test filenames if explicitly provided
    filenames: parsed._ || [],

    select: parsed.select || parsed.s,

    tag: parsed.tag || parsed.t
  }
}

const main = async (args: Array<string>) => {
  const options = parse(args);
  if (options.filenames.length == 0) {
    const namePattern = options.select ?? 'test*';
    options.filenames = await glob(`${options.root}/**/${namePattern}.{ts,js}`);
  }

  for (const f of options.filenames) {
    const absolutePath = fileURLToPath(new URL(f, import.meta.url));
    await import(absolutePath);
  }

  await hope.run(options.tag);
  const result = (options.output === 'terse') ? hope.terse() : hope.verbose();
  console.log(result);
}

main(process.argv.slice(2))
