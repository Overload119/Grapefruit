Constants = {
  DEFAULT_MESSAGES_LIMIT: 30,
  LINKED_IN_FIELDS: [
    'email-address',
    'interests',
    'skills',
    'three-past-positions',
    'three-current-positions',
    'first-name',
    'last-name',
    'headline',
    'summary',
    'picture-url',
    'public-profile-url',
    'picture-urls::(original)'
  ],
  PROTECTED_USER_FIELDS: [
    'location',
    'firstName',
    'lastName',
    'pictureUrl',
    'largePictureUrl',
    'linkedInUrl',
    'services',
    'isTutorialComplete',
    'numVotesCast',
    'numVotesReceived',
    'email',
    'isAdmin'
  ],
  // Determines which fields should return for a user.
  PUBLIC_USER_FIELDS: {
    _id: true,
    createdAt: true,
    twitterUrl: true,
    firstName: true,
    lastName: true,
    skills: true,
    listedAs: true,
    lookingFor: true,
    interests: true,
    jobExperience: true,
    pictureUrl: true,
    largePictureUrl: true,
    isHidden: true,
    headline: true,
    summary: true,
    lastActiveAt: true,
    linkedInUrl: true
  }
}
