import { describe, it, expect, vi } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NgHapticClickDirective } from './haptic-click.directive';
import { HapticsService } from '../service/haptics.service';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { NoopAdapter } from '../adapters/noop.adapter';

@Component({
    template: `<button ngHapticClick="success">test</button>`,
    standalone: true,
    imports: [NgHapticClickDirective],
})
class TestComponent { }

describe('NgHapticClickDirective', () => {
    it('can be imported and used in a component', () => {
        const adapter = new NoopAdapter();

        expect(() => {
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
        }).not.toThrow();
    });

    it('calls adapter success() method when button is clicked', async () => {
        const adapter = new NoopAdapter();

        const { fixture } = await render(TestComponent, {
            componentImports: [NgHapticClickDirective],
            providers: [
                HapticsService,
                { provide: HAPTICS_ADAPTER, useValue: adapter },
                { provide: HAPTICS_CONFIG, useValue: { debug: false } },
            ],
        });

        const service = fixture.componentRef.injector.get(HapticsService);
        const successSpy = vi.spyOn(service, 'success');

        const button = screen.getByRole('button', { name: /test/i });
        await userEvent.click(button);

        expect(successSpy).toHaveBeenCalled();
    });
});
