foounit.require(':spec/spec-helper');

describe('profile', function (){
  describe('as', function (){
    it('loads a profile fixture', function (){

      concurrently()
      .as('bob', function (bob){
        bob.switchTo('LoginPage')
          .enterUsername()
          .enterPassword()
          .submitForm()
        .switchTo('MyFeed')
          .element('MainMessageForm')
            .typeMessage('hey now!')
            .postMessage()
          .element('Feed')
            .waitForMessage('hey now!', { from: bob })
          .element('FeedNavigator')
            .clickPrivateMessageLink()
        .switchTo('PrivateMessage')
          .element('Feed')
            .clickMore()
            .waitForMoreMessages();
      })
      .as('jane', function (jane){
        jane.switchTo('LoginPage')
          .enterUsername()
          .enterPassword()
        .switchTo('MyFeed')
          .element('Feed')
          .waitForMessage('hey now!', { from: bob });
      });

    });
  });
});
