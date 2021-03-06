#!/usr/bin/env node
/* eslint no-console:off */

import * as fs from 'fs/promises';
import { program } from 'commander';
import { generateRuntypes } from 'generate-runtypes';
import * as getStdin from 'get-stdin';
import { parseToGenerator } from '.';

const main = async () => {
  const prog = program
    .name('protobuf-to-runtypes')
    .description(
      'Convert Protobuf into Runtypes.',
    )
    .option('-i, --input <input file>', 'Path to Protobuf. Can also be stdin.')
    .option('-o, --output <output file>', 'Output file. stdout if omitted.')
    .parse(process.argv);

  const { input, output } = prog.opts();
  const content = input ? await fs.readFile(input, 'utf-8') : await getStdin();

  const toGenerator = await parseToGenerator(content);
  const out = await generateRuntypes(toGenerator);
  if (output) {
    await fs.writeFile(output, out);
  } else {
    process.stdout.write(out);
  }
};

main().catch(console.error);
