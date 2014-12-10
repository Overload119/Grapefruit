Constants = {
  DEFAULT_MESSAGES_LIMIT: 30,
  DEFAULT_LIMIT: 10,
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
  THREAD_CATEGORIES: [
    {
      dbName: 'qanda',
      friendlyName: 'Q&A'
    },
    {
      dbName: 'projects',
      friendlyName: 'Projects'
    },
    {
      dbName: 'events',
      friendlyName: 'Events'
    }
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
  },
  MARKED_OPTIONS: {
    gfm: true,
    tables: false,
    breaks: true,
    pedantic: true, // will strip HTML before converting to Markdown
    sanitize: false,
    highlight: null
  },
  EPIC_EDITOR_OPTIONS: {
    container:  'editor',
    basePath:   '/editor',
    clientSideStorage: false,
    autogrow: false,
    button: {
      preview: true,
      fullscreen: false
    },
    string: {
      togglePreview: 'Preview your post'
    },
    theme: {
      base:'/themes/base/epiceditor.css',
      preview:'/themes/preview/github.css',
      editor:'/themes/editor/epic-light.css'
    }
  }
}
