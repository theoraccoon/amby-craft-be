import { GoogleStrategy } from './google.strategy';
import { Profile } from 'passport-google-oauth20';

describe('GoogleStrategy', () => {
    let strategy: GoogleStrategy;

    beforeEach(() => {
        strategy = new GoogleStrategy();
    });

    it('should call done with user object from Google profile', () => {
        const mockProfile = {
            id: 'google-id-123',
            name: { givenName: 'John', familyName: 'Doe' },
            emails: [{ value: 'john.doe@example.com' }],
            photos: [{ value: 'http://photo.url/jfohn.jpg' }],
        } as unknown as Profile;

        const done = jest.fn();

        strategy.validate('access-token', 'refresh-token', mockProfile, done);

        expect(done).toHaveBeenCalledWith(null, {
            googleId: 'google-id-123',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: 'http://photo.url/jfohn.jpg',
            roleId: 'user-role-id',
        });
    });
});
