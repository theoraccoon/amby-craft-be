import { Profile as GoogleProfile } from 'passport-google-oauth20';

export class GoogleAuthCommand {
  constructor(public readonly googleProfile: GoogleProfile) {}
}
