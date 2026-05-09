import { describe, it, expect, vi } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgHapticDirective } from './haptic.directive';
import { HapticsService } from '../service/haptics.service';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { NoopAdapter } from '../adapters/noop.adapter';

@Component({
  template: `<button [ngHaptic]="'success'">tap</button>`,
  imports: [NgHapticDirective],
  standalone: true,
})
class TestComponent {}

describe('NgHapticDirective', () => {
  function setup() {
    const adapter = new NoopAdapter();
    const successSpy = vi.spyOn(adapter, 'success');

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        HapticsService,
        { provide: HAPTICS_ADAPTER, useValue: adapter },
        { provide: HAPTICS_CONFIG, useValue: { debug: false } },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return { fixture, successSpy };
  }

  it('calls adapter.success() on click', () => {
    const { fixture, successSpy } = setup();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(successSpy).toHaveBeenCalled();
  });
});
