setupUser = function(linkedInResponse) {
  localStorage.setItem('lastLinkedInSync', new Date());

  if (linkedInResponse.memberId && linkedInResponse.email) {
    Meteor.loginWithPassword(linkedInResponse.email, linkedInResponse.memberId);
  } else {
    var linkedInData = linkedInResponse.values[0];
    Accounts.createUser({ email: linkedInData.emailAddress }, function onCallback() {
    });
  }

  if (linkedInResponse) {
  }
  debugger;
}
