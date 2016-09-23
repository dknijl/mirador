describe('MetadataView', function() {
  var subject;
  beforeEach(function() {
    jasmine.getJSONFixtures().fixturesPath = 'spec/fixtures';
    this.fixture = getJSONFixture('metadataFixture.json');
    this.manifest = new Mirador.Manifest(
      this.fixture['@id'], 'IIIF', this.fixture
    );
    $('body').append('<div id="metadata-view-container"></div>');
    this.sandbox = jQuery('#metadata-view-container');
    this.windowId = '380c9e54-7561-4010-a99f-f132f5dc13fd';
    this.canvasID = 'https://oculus-dev.harvardx.harvard.edu/manifests/drs:5981093/canvas/canvas-5981522.json';
    this.metadataView = new Mirador.MetadataView({
      manifest: this.manifest,
      appendTo: this.sandbox,
      windowId: this.windowId,
      canvasID: this.canvasID
    });
    subject = this.metadataView;
  });

  afterEach(function() {
    delete this.metadataView;
    this.sandbox.remove();
    $('body').html('');
  });

  describe('Initialization', function() {
    it('should initialize', function() {
      expect(true).toBe(true); //Force beforeEach() setup to run
    });
  });

  describe('stringifyObject', function() {
    it('should stringify regular expressions', function() {
      expect(subject.stringifyObject(/\w\S*/g)).toEqual('/\\w\\S*/');
    });
    it('should stringify arrays', function() {
      expect(subject.stringifyObject(['a', 'b', 'c'])).toEqual('[ a, b, c ]');
    });
    it('should stringify objects', function() {
      expect(subject.stringifyObject({ a: 3, b: 'waahoo'})).toEqual('<div style="margin-left:0px">a: 3<br/>b: waahoo</div>');
      expect(subject.stringifyObject({ a: 3, b: { c: 'waahoo' }})).toEqual('<div style="margin-left:0px">a: 3<br/>b: <div style="margin-left:15px">c: waahoo</div></div>');
    });
    it('should return strings as-is', function() {
      expect(subject.stringifyObject('abc')).toEqual('abc');
    });
  });

  describe('stringifyRelated', function() {
    it('should handle arrays of strings', function() {
      expect(subject.stringifyRelated([
        'http://projectmirador.org', 
        '', 
        'http://iiif.io', 
        'http://github.com/iiif'
      ])).toEqual(
        '<a href="http://projectmirador.org" target="_blank">http://projectmirador.org</a>' +
        '<br/><a href="http://iiif.io" target="_blank">http://iiif.io</a>' +
        '<br/><a href="http://github.com/iiif" target="_blank">http://github.com/iiif</a>'
      );
    });
    it('should handle objects', function() {
      expect(subject.stringifyRelated({
        '@id': 'http://projectmirador.org',
        label: 'Project Mirador',
        format: 'text/html'
      })).toEqual('<a href="http://projectmirador.org"  target="_blank">Project Mirador</a> ');
      expect(subject.stringifyRelated({
        '@id': 'http://projectmirador.org/logo.png',
        format: 'image/png'
      })).toEqual('<a href="http://projectmirador.org/logo.png"  target="_blank">http://projectmirador.org/logo.png</a> (image/png)');
    });
    it('should handle strings', function() {
      expect(subject.stringifyRelated('This should not be changed.')).toEqual('This should not be changed.');
    });
    it('should handle strings with links', function() {
      expect(subject.stringifyRelated('See us at http://projectmirador.org for more examples!')).toEqual('See us at <a href="http://projectmirador.org" target="_blank">http://projectmirador.org</a> for more examples!');
    });
  });

  describe('getMetadataDetails', function() {
    it('should grab English details', function() {
      expect(subject.getMetadataDetails(this.manifest.jsonLd)).toEqual({
        label: '<b></b>',
        description: '',
        'Single': 'default',
        'Multiple with default': 'English',
        'Multiple without default': 'English',
        'Single HTML with invalid elements': "<span style='height:500px'>test <script language='Javascript'>alert('bad!');</script><blink>bad</blink></span>",
        'Single HTML with valid elements': "<span><b>bold</b><i>italic</i><br/><a href='http://iiif.io/'><img src='http://iiif.io/img/logo-iiif-34x30.png'></a></span>"
      });
    });
  });

  describe('getMetadataRights', function() {
    it('should grab rights when present', function() {
      expect(subject.getMetadataRights({
        license: 'CC-BY-ND 2.0',
        attribution: 'Oodlepods Fellowship International'
      })).toEqual({
        license: 'CC-BY-ND 2.0',
        attribution: 'Oodlepods Fellowship International'
      });
    });
    it('should default to blanks when not present', function() {
      expect(subject.getMetadataRights(this.manifest.jsonLd)).toEqual({
        license: '',
        attribution: ''
      });
    });
  });

  describe('getMetadataLinks', function() {
    it('should grab metadata links when present', function() {
      expect(subject.getMetadataLinks({
        related: "http://news.example.net",
        seeAlso: "http://oodlepods.example.net",
        within: "Oodlepods Monthly Issue #6"
      })).toEqual({
        related: '<a href="http://news.example.net" target="_blank">http://news.example.net</a>',
        seeAlso: '<a href="http://oodlepods.example.net" target="_blank">http://oodlepods.example.net</a>',
        within: 'Oodlepods Monthly Issue #6'
      });
    });
    it('should default to blanks when not present', function() {
      expect(subject.getMetadataLinks(this.manifest.jsonLd)).toEqual({
        related: '',
        seeAlso: '',
        within: ''
      });
    });
  });

  describe('extractLabelFromAttribute', function() {
    it('Converts attributes', function() {
      expect(subject.extractLabelFromAttribute('super   WaahooLabelFromAttr')).toEqual('Super Waahoo Label From Attr');
    });
  });

  xdescribe('bindEvents', function() {

  });

  describe('toggle', function() {
    beforeEach(function() {
      spyOn(subject, 'show');
      spyOn(subject, 'hide');
    });
    it('should call show for true', function() {
      subject.toggle(true);
      expect(subject.show).toHaveBeenCalled();
      expect(subject.hide).not.toHaveBeenCalled();
    });
    it('should call hide for false', function() {
      subject.toggle(false);
      expect(subject.show).not.toHaveBeenCalled();
      expect(subject.hide).toHaveBeenCalled();
    });
  });

  describe('show', function() {
    it('should show the metadataView', function () {
      spyOn(jQuery.fn, 'show');
      subject.show();
      expect(jQuery.fn.show).toHaveBeenCalled();
    });
    it('should show at the parent level if embedded', function() {
      var dummyParent = document.createElement('span');
      subject.panel = { panel: "fake" };
      spyOn(subject.element, 'parent').and.returnValue(dummyParent);
      spyOn(jQuery.fn, 'show');
      subject.show();
      expect(jQuery.fn.show).toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    it('should hide the metadataView', function () {
      spyOn(jQuery.fn, 'hide');
      subject.hide();
      expect(jQuery.fn.hide).toHaveBeenCalled();
    });
    it('should hide at the parent level if embedded', function() {
      var dummyParent = document.createElement('span');
      subject.panel = { panel: "fake" };
      spyOn(subject.element, 'parent').and.returnValue(dummyParent);
      spyOn(jQuery.fn, 'hide');
      subject.hide();
      expect(jQuery.fn.hide).toHaveBeenCalled();
    });
  });

  describe('addLinksToUris', function() {
    it('should replace URIs with links', function() {
      expect(subject.addLinksToUris('See us at http://projectmirador.org for more examples!')).toEqual('See us at <a href="http://projectmirador.org" target="_blank">http://projectmirador.org</a> for more examples!');
    });
    it('should leave other things alone', function() {
      expect(subject.addLinksToUris('This should not be changed.')).toEqual('This should not be changed.');
    });
  });
});
