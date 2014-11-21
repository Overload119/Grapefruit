// onLinkedInAuth = function() {
//   // After they have been authenticated with LinkedIn, we import their latest information.
//   // We do this every 3 days to keep the login process fast.
//   var lastSyncDate;
//   if (localStorage.getItem('lastLinkedInSync'))
//     lastSyncDate = new Date(localStorage.getItem('lastLinkedInSync'));

//   // If we synced in the last 3 days, then skip pulling information in from LinkedIn.
//   if (lastSyncDate && lastSyncDate > moment().subtract(3, 'days')) {
//     // Retrieve the member ID, this will be used to login.
//     setupUser({ email: localStorage.getItem('email'), memberId: localStorage.getItem('memberId') });
//   } else {
//     localStorage.setItem('memberId', IN.ENV.auth.member_id);
//     IN.API.Profile().ids('me').fields(Constants.LINKED_IN_FIELDS).result(setupUser);
//   }
// }

// onLinkedInLoad = function() {
//   $('#connect').addClass('loaded');
//   IN.Event.on(IN, 'auth', onLinkedInAuth);
// }

// $.getScript('http://platform.linkedin.com/in.js?async=true', function() {
//   IN.init({
//     apiKey: '7791pqvkxx29oi',
//     authorize: true,
//     onLoad: 'onLinkedInLoad'
//   });
// });


