import { CsvFile } from "https://deno.land/x/csv_file/mod.ts";
import { default as isValid } from "https://deno.land/x/date_fns/isValid/index.js";
import * as path from "https://deno.land/std/path/mod.ts";

const filename = Deno.args[0];

const input = new CsvFile(
  await Deno.open(filename, {
    read: true,
  })
);

const output = new CsvFile(
  await Deno.open(path.basename(filename), {
    write: true,
    create: true,
    truncate: true,
  })
);

await input.seekRecord(0);

await input.readHeader();
await output.writeRecord(input.header);

for await (let record of input) {
  const date = record[0];
  if (isValid(new Date(date))) {
    await output.writeRecord(record);
  }
}

input.close();
output.close();
