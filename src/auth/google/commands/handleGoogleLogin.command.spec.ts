import { HandleGoogleLoginCommand } from './handleGoogleLogin.command';

describe('HandleGoogleLoginCommand', () => {
    it('should create a command with correct properties', () => {
        const command = new HandleGoogleLoginCommand(
            'google-id-123',
            'user@example.com',
            'Jane',
            'Doe',
            'https://example.com/photo.jpg'
        );

        expect(command.googleId).toBe('google-id-123');
        expect(command.email).toBe('user@example.com');
        expect(command.firstName).toBe('Jane');
        expect(command.lastName).toBe('Doe');
        expect(command.profilePicture).toBe('https://example.com/photo.jpg');
    });
});
