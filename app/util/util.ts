export function formatDate(date_instance: Date) {
  const [ _, month, date, full_year ] = date_instance.toDateString().split(" ");
  return `${ month } ${ date }, ${ full_year }`;
}
