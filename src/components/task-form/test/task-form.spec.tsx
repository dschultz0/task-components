import { newSpecPage } from '@stencil/core/testing';
import { TaskForm } from '../task-form';

describe('task-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TaskForm],
      html: `<task-form></task-form>`,
    });
    expect(page.root).toEqualHtml(`
      <task-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </task-form>
    `);
  });
});
