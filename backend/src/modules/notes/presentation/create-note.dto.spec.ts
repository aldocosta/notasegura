import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateNoteDto } from './create-note.dto';

function validateNote(overrides: Record<string, unknown>) {
  const dto = plainToInstance(CreateNoteDto, {
    text: 'hi',
    expiresInDays: 1,
    maxViews: 1,
    ...overrides,
  });
  return validate(dto);
}

describe('CreateNoteDto', () => {
  it('accepts 30 days and 50 views', async () => {
    const errors = await validateNote({ expiresInDays: 30, maxViews: 50 });
    expect(errors).toHaveLength(0);
  });

  it('rejects expiresInDays above 30', async () => {
    const errors = await validateNote({ expiresInDays: 31 });
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('expiresInDays');
  });

  it('rejects maxViews above 50', async () => {
    const errors = await validateNote({ maxViews: 51 });
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('maxViews');
  });

  it.each([
    ['expiresInDays', 0],
    ['maxViews', 0],
  ])('rejects %s=%p', async (property, value) => {
    const errors = await validateNote({ [property]: value });
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe(property);
  });
});
