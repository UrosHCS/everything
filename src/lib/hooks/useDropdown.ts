import { useEffect, useRef } from 'react';
import { useState } from 'react';

export default function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu({ target }: MouseEvent) {
      if (!ref.current?.contains(target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', closeMenu);

    return () => document.removeEventListener('mousedown', closeMenu);
  }, [ref]);

  return [ref, isOpen, setIsOpen] as const;
}
