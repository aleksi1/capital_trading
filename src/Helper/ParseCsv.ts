import Papa from 'papaparse'

export const parse = (files: any, process: any) => {
  Papa.parse(files, {
    header: true,
    skipEmptyLines: true,
    complete(results: any) {
      process(results)
    },
  })
}
