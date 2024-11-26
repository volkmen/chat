declare module 'classnames' {
  function classNames(
    ...args: Array<string | number | undefined | null | boolean | { [key: string]: boolean }>
  ): string;

  // If you want to add custom types or overloads, you can declare them here

  export default classNames;
}

declare module 'relative-date' {
  function convert(arg: Date | number | string): string;

  export default convert;
}
