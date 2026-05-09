import { describe, it, expect } from 'vitest';
import { NoopAdapter } from './noop.adapter';

describe('NoopAdapter', () => {
  let adapter: NoopAdapter;

  beforeEach(() => {
    adapter = new NoopAdapter();
  });

  it('isSupported() returns false', () => {
    expect(adapter.isSupported()).toBe(false);
  });

  it('does not throw on any method call', () => {
    expect(() => adapter.light()).not.toThrow();
    expect(() => adapter.medium()).not.toThrow();
    expect(() => adapter.heavy()).not.toThrow();
    expect(() => adapter.success()).not.toThrow();
    expect(() => adapter.warning()).not.toThrow();
    expect(() => adapter.error()).not.toThrow();
    expect(() => adapter.selection()).not.toThrow();
    expect(() => adapter.pattern([10, 20])).not.toThrow();
  });
});
