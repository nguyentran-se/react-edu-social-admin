import { useEffect, useRef, useState } from 'react';

export function useRefState<T>(initialValue: T = null as T) {
  const [value, setValue] = useState<T>(initialValue);
  const refValue = useRef<T>(initialValue);

  refValue.current = value;
  return [refValue, setValue] as const;
}
