foounit = typeof foounit == 'undefined' ? require('foounit') : foounit;

foounit.mount('lib',  __dirname + '/../lib');     // Change to your source directory
foounit.mount('spec', __dirname);
foounit.mount('fixtures', __dirname + '/fixtures');

/**
 * Add test files to your suite
 */
foounit.getSuite().addFile(':spec/co-context-spec');
foounit.getSuite().addFile(':spec/keywords-spec');
//foounit.getSuite().addFile(':spec/page-spec');
//foounit.getSuite().addFile(':spec/page-element-spec');
//foounit.getSuite().addFile(':spec/concurrent-spec');

//foounit.getSuite().addFile(':spec/login-spec');
//foounit.getSuite().addFile(':spec/widget-spec');
//foounit.getSuite().addFile(':spec/feed-spec');
foounit.getSuite().run();
