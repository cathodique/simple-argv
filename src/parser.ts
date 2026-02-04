const cleanFlag = (flag: string) => flag.slice(flag[1] === "-" ? 2 : 1);

export default (input: string[]) => {
  const withoutEquals = input.flatMap((e) => {
    if (e.includes("=") && e !== "=") {
      const [key, ...values] = e.split('=');
      return [key, values.join("=")];
    } else {
      return e;
    }
  });

  const multibooleanSerialized = withoutEquals.flatMap((e) => {
    if (Number.isNaN(Number.parseFloat(e)) && e.match(/^-[^-]{2,}$/i)) {
      return Array.from(e.slice(1)).flatMap((v) => [`-${v}`, ""])
    } else {
      return e;
    }
  });

  const argv = multibooleanSerialized.reduce((acc, e, i) => {
    if (e?.[0] !== "-") {
      const prevE = multibooleanSerialized[i - 1]
      if (prevE[0] === "-") {
        acc[cleanFlag(prevE)] = e;
      }
    } else {
      const cleaned = cleanFlag(e);
      acc[cleaned] = "";
    }
    return acc;
  }, {} as Record<string, string>);

  return argv;
}
