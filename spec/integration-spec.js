foounit.require(':spec/spec-helper');

var driver = foounit.require(':lib/driver');

describe('local integration test', function (){
  after(function (){
    killProfiles();
  });

  it('switches between pages and elements', function (){
    as('bob', function (bob){
      var page = bob.switchTo('Login')
        .typeUsername()
        .typePassword()
        .clickSubmit()
    //  .switchTo('Profile')
    //    .element('Stats')
    //      .hasText('5 million followers');
    //      .hasText('You are sooooo famous');
    //  .switchTo('EditProfile')
    //    .element('EditProfileForm')
    //      .typeUsername('foobarfighter');
    //      .clickSubmit();
    });
  });

});
