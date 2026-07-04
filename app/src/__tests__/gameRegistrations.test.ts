import fs from 'fs';
import path from 'path';

describe('game registrations', () => {
  it('keeps the GBA emulator enabled in the registry', () => {
    const registrationsSource = fs.readFileSync(
      path.resolve(__dirname, '../gameRegistrations.ts'),
      'utf8',
    );

    expect(registrationsSource).toMatch(
      /id:\s*'gba-emulator'[\s\S]*?navigator:\s*GbaEmulatorNavigator[\s\S]*?isEnabled:\s*true/,
    );
  });
});
