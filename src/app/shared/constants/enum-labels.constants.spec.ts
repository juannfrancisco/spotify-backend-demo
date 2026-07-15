import { ENUM_LABELS, enumToOptions } from './enum-labels.constants';

describe('enum-labels.constants', () => {
  describe('ENUM_LABELS', () => {
    it('should contain known status labels', () => {
      expect(ENUM_LABELS['ACTIVE']).toBe('Activo');
      expect(ENUM_LABELS['PENDING']).toBe('Pendiente');
    });
  });

  describe('enumToOptions()', () => {
    it('should map enum values to options using ENUM_LABELS when available', () => {
      const result = enumToOptions({ STATUS: 'ACTIVE' });
      expect(result).toEqual([{ id: 'ACTIVE', name: 'Activo' }]);
    });

    it('should fall back to the raw value when no label exists', () => {
      const result = enumToOptions({ CUSTOM: 'UNKNOWN_VALUE' });
      expect(result).toEqual([{ id: 'UNKNOWN_VALUE', name: 'UNKNOWN_VALUE' }]);
    });
  });
});
