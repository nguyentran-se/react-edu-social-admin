function pluralize(noun: string): string {
  const exceptions = {
    syllabus: 'syllabi',
    curriculum: 'curricula',
    workspace: 'workspace',
  };

  if (exceptions[noun.toLowerCase()]) {
    return exceptions[noun.toLowerCase()];
  }

  const lastLetter = noun[noun.length - 1];

  if (lastLetter === 'y') {
    return noun.slice(0, -1) + 'ies';
  }

  if (['s', 'x', 'z'].includes(lastLetter) || noun.slice(-2) === 'ch' || noun.slice(-2) === 'sh') {
    return noun + 'es';
  }

  return noun + 's';
}
const fakePromise = <TData>(data: TData): Promise<TData> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      return res(data);
    }, 1000);
  });

const generateOptions = <TData>({
  data,
  valuePath,
  labelPath,
}: {
  data: TData[] | TData;
  valuePath: keyof TData;
  labelPath: keyof TData;
}) => {
  if (!data) return null;
  if (Array.isArray(data))
    return data.map((op) => ({ value: op[valuePath], label: op[labelPath] }));
  return { value: data[valuePath], label: data[labelPath] };
};
//TODO: enhance getSelectValue type
const getSelectValue = (option: any): any => {
  if (typeof option === 'object') return option.value;
  return option;
};

const getPreviousPathSlash = (path: string) => {
  return path.substring(0, path.lastIndexOf('/'));
};
function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function capitalizeAndOmitUnderscore(str: string) {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
export {
  capitalizeAndOmitUnderscore,
  pluralize,
  fakePromise,
  generateOptions,
  getSelectValue,
  getPreviousPathSlash,
  removeAccents,
};
