import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
    let strategy: GoogleStrategy;

    beforeEach(() => {
        strategy = new GoogleStrategy();
    });

    it('should return a simplified user object from Google profile', () => {
        const mockProfile: any = {
            id: '12345',
            name: { givenName: 'John', familyName: 'Doe' },
            emails: [{ value: 'john@example.com' }],
            photos: [{ value: 'http://photo.url' }],
        };

        const result = strategy.validate(
            'accessToken',
            'refreshToken',
            mockProfile
        );

        expect(result).toEqual({
            googleId: '12345',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: 'http://photo.url',
        });
    });
});
