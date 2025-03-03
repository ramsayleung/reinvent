#!/usr/bin/env node

import minimist from 'minimist';
import path from 'path';
import fs from 'fs-extra-promise';
import { backup, BackupCliOptions } from './backup';
import { ManifestFileFormat } from './manifest';

const argv = minimist(process.argv.slice(2), {
  string: ['src', 'dst', 'format'],
  boolean: ['verbose', 'help', 'version'],
  alias: {
    s: 'src',
    d: 'dst',
    t: 'timestamp',
    f: 'format',
    v: 'verbose',
    h: 'help',
    V: 'version'
  },
  default: {
    format: 'csv',
    verbose: false
  }
});

const VERSION = '1.0.0';

const showHelp = () => {
  console.log(`
File Backup CLI - A simple file backup utility

Usage:
  backup-cli --src <source_directory> --dst <destination_directory> [options]

Options:
  -s, --src <path>       Source directory path (required)
  -d, --dst <path>       Destination directory path (required)
  -t, --timestamp <num>  Custom timestamp (default: current time)
  -f, --format <type>    Manifest format: 'csv' or 'json' (default: csv)
  -v, --verbose          Enable verbose logging
  -h, --help             Show this help message
  -V, --version          Show version information

Examples:
  backup-cli --src ./my_documents --dst ./backups
  backup-cli -s ./my_documents -d ./backups -f json -v
`);
};

const showVersion = () => {
  console.log(`File Backup CLI v${VERSION}`);
};

const validateArgs = (options: BackupCliOptions): boolean => {
  if (!options.src || !options.dst) {
    console.error('Error: Both source (--src) and destination (--dst) directories are required.');
    showHelp();
    return false;
  }

  if (!fs.existsSync(options.src)) {
    console.error(`Error: Source directory '${options.src}' does not exist.`);
    return false;
  }

  if (options.format && ![ManifestFileFormat.CSV, ManifestFileFormat.JSON].includes(options.format)) {
    console.error(`Error: Invalid format '${options.format}'. Must be 'csv' or 'json'.`);
    return false;
  }

  return true;
};

const verboseLog = (message: string, options: BackupCliOptions) => {
  if (options.verbose) {
    console.log(`[INFO] ${message}`);
  }
};

const main = async () => {
  let format = ManifestFileFormat.CSV;
  if (argv.format === 'json') {
    format = ManifestFileFormat.JSON;
  }
  const options: BackupCliOptions = {
    src: argv.src,
    dst: argv.dst,
    format: format,
    verbose: argv.verbose,
    help: argv.help,
    version: argv.version
  };

  if (options.help) {
    showHelp();
    return;
  }

  if (options.version) {
    showVersion();
    return;
  }

  if (!validateArgs(options)) {
    process.exit(1);
  }

  try {
    await fs.ensureDirAsync(options.dst);
    verboseLog(`Destination directory ensured: ${options.dst}`, options);
  } catch (error) {
    console.error(`Error creating destination directory: ${error.message}`);
    process.exit(1);
  }

  verboseLog(`Starting backup from '${options.src}' to '${options.dst}'`, options);

  try {
    console.time('Backup completed in');

    // Perform backup
    await backup(
      path.resolve(options.src),
      path.resolve(options.dst),
      null,
      {
        format: options.format,
        verbose: options.verbose
      }
    );

    console.timeEnd('Backup completed in');
    console.log(`Backup completed successfully!`);
  } catch (error) {
    console.error(`Error during backup: ${error.message}`);
    process.exit(1);
  }
};

// Run the application
main().catch(error => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
