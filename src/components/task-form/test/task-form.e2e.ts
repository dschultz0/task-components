import { newE2EPage } from '@stencil/core/testing';

describe('task-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<task-form></task-form>');

    const element = await page.find('task-form');
    expect(element).toHaveClass('hydrated');
  });
});
